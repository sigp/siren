#!/usr/bin/env python3
"""
pwgen.py – Generate a random password and (optionally) store it in a Kubernetes Secret.

Examples
--------
# Just print a 12-character password
python pwgen.py -l 12

# Create Secret db-pw in the default context namespace
python pwgen.py -l 16 -s db-pw

# Same but in the staging namespace
python pwgen.py -l 16 -n staging -s db-pw

# Replace the Secret if it already exists
python pwgen.py -l 20 -s db-pw --force
"""

import argparse
import secrets
import string
from random import SystemRandom

from kubernetes import client, config
from kubernetes.client.rest import ApiException


# ───────────────────────── Password generation ──────────────────────────
def generate_password(length: int = 10) -> str:
    if length < 3:
        raise ValueError("Length must be at least 3 (lower, upper, digit).")

    chars = [
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.digits),
    ]
    alphabet = string.ascii_letters + string.digits
    chars += [secrets.choice(alphabet) for _ in range(length - 3)]
    SystemRandom().shuffle(chars)
    return "".join(chars)


# ───────────────────────── Kubernetes helpers ───────────────────────────
def get_default_namespace() -> str:
    """Return namespace from current kube-context, defaulting to 'default'."""
    contexts, current = config.list_kube_config_contexts()
    if not current:
        return "default"
    return current.get("context", {}).get("namespace", "default")


def create_secret(namespace: str, name: str, password: str, force: bool) -> None:
    v1 = client.CoreV1Api()
    body = client.V1Secret(
        metadata=client.V1ObjectMeta(name=name),
        type="Opaque",
        string_data={"password": password},
    )

    try:
        v1.create_namespaced_secret(namespace, body)
        print(f"✅ Secret '{name}' created in namespace '{namespace}'.")
    except ApiException as e:
        if e.status == 409:  # Already exists
            if force:
                v1.replace_namespaced_secret(name, namespace, body)
                print(f"♻️  Secret '{name}' replaced in namespace '{namespace}'.")
            else:
                print(
                    f"⚠️  Secret '{name}' already exists in namespace '{namespace}'. "
                    "Use --force to replace it."
                )
        else:
            raise


# ────────────────────────────────── main ─────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate a secure random password; optionally save it as a Kubernetes Secret."
    )
    parser.add_argument("-l", "--length", type=int, default=10, help="Password length (default: 10)")
    parser.add_argument("-n", "--namespace", help="Kubernetes namespace (default: current-context namespace)")
    parser.add_argument("-s", "--secret", dest="secret_name", help="Name of the Secret to create")
    parser.add_argument("--force", action="store_true", help="Replace an existing Secret if it exists")
    args = parser.parse_args()

    password = generate_password(args.length)
    print(f"Generated password: {password}")

    if not args.secret_name:
        return  # No Secret requested.

    namespace = args.namespace or get_default_namespace()
    config.load_kube_config()  # Outside-cluster; switch to load_incluster_config() if desired
    create_secret(namespace, args.secret_name, password, args.force)


if __name__ == "__main__":
    main()
