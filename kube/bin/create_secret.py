#!/usr/bin/env python3
"""
create_secret.py — Create or update a Kubernetes Secret from a file or stdin.

Requirements:
  pip install kubernetes

Usage examples:
  # From file; secret name defaults to sanitized file name; namespace from context
  python create_secret.py -f secret.txt

  # From stdin; secret name defaults to 3-letter month + day, e.g., aug11
  echo -n "supersecret" | python create_secret.py

  # Explicit secret name and namespace; overwrite if it exists
  python create_secret.py -f cert.pem -s tls-cert -n myns --force
"""
import argparse
import base64
import datetime as dt
import os
import re
import sys
from pathlib import Path
from typing import Optional, Tuple

from kubernetes import client, config
from kubernetes.client.exceptions import ApiException


def read_bytes_from_source(path: Optional[str]) -> bytes:
    if path:
        with open(path, "rb") as f:
            return f.read()
    return sys.stdin.buffer.read()


def month_abbrev_day_today() -> str:
    # e.g., 'aug11' (lowercase for DNS-1123)
    today = dt.date.today()
    return f"{today.strftime('%b').lower()}{today.strftime('%d')}"


def strip_all_suffixes(p: Path) -> Path:
    while p.suffix:
        p = p.with_suffix("")
    return p


def sanitize_name(name: str) -> str:
    """Make DNS-1123 compliant."""
    name = name.lower()
    name = re.sub(r"[^a-z0-9-]", "-", name)
    name = re.sub(r"-{2,}", "-", name).strip("-")
    if not name:
        name = month_abbrev_day_today()
    if len(name) > 253:
        name = name[:253].rstrip("-")
    name = re.sub(r"^[^a-z0-9]+", "", name)
    name = re.sub(r"[^a-z0-9]+$", "", name)
    if not name:
        name = month_abbrev_day_today()
    return name


def default_name_from_file(file_path: str) -> str:
    p = Path(file_path)
    stem_all = strip_all_suffixes(p).name or p.stem or p.name
    return sanitize_name(stem_all)


def guess_default_namespace() -> str:
    # 1) in-cluster SA namespace
    sa_ns_file = "/var/run/secrets/kubernetes.io/serviceaccount/namespace"
    if os.path.exists(sa_ns_file):
        try:
            with open(sa_ns_file, "r", encoding="utf-8") as f:
                ns = f.read().strip()
                if ns:
                    return ns
        except Exception:
            pass
    # 2) kubeconfig context
    try:
        contexts, active = config.list_kube_config_contexts()
        if active and "context" in active:
            ctx = active["context"]
            ns = ctx.get("namespace")
            if ns:
                return ns
    except Exception:
        pass
    # 3) fallback
    return "default"


def load_kube_config() -> Tuple[bool, Optional[Exception]]:
    try:
        config.load_incluster_config()
        return True, None
    except Exception:
        try:
            config.load_kube_config()
            return True, None
        except Exception as e_out:
            return False, e_out


def ensure_secret(
    api: client.CoreV1Api,
    name: str,
    namespace: str,
    data_key: str,
    raw_bytes: bytes,
    secret_type: str,
    force: bool,
) -> None:
    b64 = base64.b64encode(raw_bytes).decode("ascii")
    metadata = client.V1ObjectMeta(name=name, namespace=namespace)
    body = client.V1Secret(
        api_version="v1",
        kind="Secret",
        metadata=metadata,
        type=secret_type,
        data={data_key: b64},
    )

    # Check existence
    try:
        existing = api.read_namespaced_secret(name=name, namespace=namespace)
        exists = True
    except ApiException as e:
        if e.status == 404:
            exists = False
        else:
            raise

    if exists and not force:
        print(
            f"Secret '{name}' already exists in namespace '{namespace}'. Use --force to overwrite.",
            file=sys.stderr,
        )
        sys.exit(1)

    if exists and force:
        body.metadata.resource_version = existing.metadata.resource_version
        api.replace_namespaced_secret(name=name, namespace=namespace, body=body)
        print(f"Replaced Secret '{name}' in namespace '{namespace}'.")
    else:
        api.create_namespaced_secret(namespace=namespace, body=body)
        print(f"Created Secret '{name}' in namespace '{namespace}'.")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Create a Kubernetes Secret from a file or stdin."
    )
    p.add_argument(
        "-f", "--file",
        help="Path to file containing the secret bytes. If omitted, read from stdin.",
    )
    p.add_argument(
        "-s", "--secretname",
        help="Secret name. Defaults to sanitized file name; if reading from stdin, "
             "defaults to today's 3-letter month + day (e.g., aug11).",
    )
    p.add_argument(
        "-k", "--key",
        default="password",
        help="Key inside the Secret data map (default: 'password').",
    )
    p.add_argument(
        "-n", "--namespace",
        help='Namespace to create the Secret in. Defaults to the current context\'s namespace or "default".',
    )
    p.add_argument(
        "--type",
        default="Opaque",
        help="Secret type (default: Opaque).",
    )
    p.add_argument(
        "--force",
        action="store_true",
        help="Overwrite the Secret if it already exists.",
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()

    # Determine secret name
    if args.secretname:
        name = sanitize_name(args.secretname)
    elif args.file:
        name = default_name_from_file(args.file)
    else:
        name = month_abbrev_day_today()  # e.g., 'aug11'

    # Determine namespace
    namespace = args.namespace or guess_default_namespace()

    # Read content
    payload = read_bytes_from_source(args.file)
    if not payload:
        print("Refusing to create an empty Secret (no input provided).", file=sys.stderr)
        sys.exit(2)

    # Kube client
    loaded, err = load_kube_config()
    if not loaded:
        print(f"Failed to load Kubernetes config: {err!s}", file=sys.stderr)
        sys.exit(3)
    api = client.CoreV1Api()

    # Create or replace
    try:
        ensure_secret(
            api=api,
            name=name,
            namespace=namespace,
            data_key=args.key,
            raw_bytes=payload,
            secret_type=args.type,
            force=bool(args.force),
        )
    except ApiException as e:
        msg = getattr(e, "reason", str(e))
        status = getattr(e, "status", "unknown")
        print(f"Kubernetes API error (status {status}): {msg}", file=sys.stderr)
        if e.body:
            print(e.body, file=sys.stderr)
        sys.exit(4)


if __name__ == "__main__":
    main()
