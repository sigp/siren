# siren

Deploy Siren on Kubernetes

## TL;DR
```bash
helm install <network>-ui  -f <network>-values.yaml ./siren
```

## Prerequisites
- Kubernetes >= 1.27
- Two Secrets with exact keys:
  - API token secret → key **`apitoken`** (→ `API_TOKEN`)
  - Session password secret → key **`password`** (→ `SESSION_PASSWORD`)

## Configuration
- `config.beaconUrl` (**required**): URL of your Beacon Node HTTP API (e.g. `http://lighthouse-beacon:5052`).
- `config.validatorUrl` (**required**): URL of your Validator Client HTTP API (e.g. `http://lighthouse-validator:5062`).
- `config.apiTokenSecretName` (**required**): Secret name holding key `apitoken`.
- `config.passwordSecretName` (**required**): Secret name holding key `password`.

> **Note:** This chart **does not** set defaults for `config.beaconUrl` or
> `config.validatorUrl`. You must set them in your values at deploy time.

## Install

**From a local checkout**
```bash
helm install <network>-ui  -f values.yaml ./siren
```

**From a chart repo (Artifact Hub) — coming soon**
```bash
helm repo add k8ev <REPO_URL>
helm repo update
helm upgrade --install siren k8ev/siren -n eth-validator -f values.yaml
```

## Minimal values example
```yaml
config:
  beaconUrl: "http://<beacon-service>:<port>"
  validatorUrl: "http://<validator-service>:<port>"
  debug: false
  apiTokenSecretName: "siren-api"
  passwordSecretName: "siren-session"
```

## Ingress (optional)

If you want a public URL for the UI, enable the chart’s Ingress and set your domain.
You **must** replace `\<your-domain.example.com\>` and adjust the controller class/annotations for your cluster.

```yaml
ingress:
  enabled: true

  # Prefer spec.ingressClassName when supported by your controller.
  # Example values: "nginx", "traefik", "haproxy".
  className: nginx

  # Add any controller-specific annotations here.
  annotations:
    # If using cert-manager with a ClusterIssuer:
    cert-manager.io/cluster-issuer: "letsencrypt"
    # Some clusters still require the legacy class annotation:
    kubernetes.io/ingress.class: "nginx"

  hosts:
    - host: <your-domain.example.com>
      paths:
        - path: /
          pathType: Prefix

  tls:
    - secretName: <your-domain.example.com>-tls
      hosts:
        - <your-domain.example.com>
```

### Notes
- Create an **A/AAAA** record for `<your-domain.example.com>` pointing to your Ingress controller’s external IP/hostname.
- If you use a **namespaced Issuer** (not a ClusterIssuer), replace the annotation with: `cert-manager.io/issuer: "<issuer-name>"`.
- Some controllers ignore `kubernetes.io/ingress.class` and only use `spec.ingressClassName` (`className` above). Keep whichever your cluster needs.
- For multiple domains, add additional entries under `ingress.hosts` and `ingress.tls`.
- If your app is served under a subpath, ensure your controller is configured for path rewrite/strip as needed.

### Verify
```bash
kubectl -n <namespace> get ingress
kubectl -n <namespace> describe ingress <release-name>
```

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` |  |
| autoscaling.enabled | bool | `false` |  |
| autoscaling.maxReplicas | int | `100` |  |
| autoscaling.minReplicas | int | `1` |  |
| autoscaling.targetCPUUtilizationPercentage | int | `80` |  |
| config.apiTokenSecretName | string | `""` |  |
| config.beaconUrl | string | `""` |  |
| config.debug | bool | `false` |  |
| config.passwordSecretName | string | `""` |  |
| config.validatorUrl | string | `""` |  |
| fullnameOverride | string | `""` |  |
| image.pullPolicy | string | `"Always"` |  |
| image.repository | string | `"sigp/siren"` |  |
| image.tag | string | `"v3.0.4"` |  |
| imagePullSecrets | list | `[]` |  |
| ingress.annotations | object | `{}` |  |
| ingress.className | string | `""` |  |
| ingress.enabled | bool | `false` |  |
| ingress.hosts[0].host | string | `"chart-example.local"` |  |
| ingress.hosts[0].paths[0].path | string | `"/"` |  |
| ingress.hosts[0].paths[0].pathType | string | `"ImplementationSpecific"` |  |
| ingress.tls | list | `[]` |  |
| livenessProbe.httpGet.path | string | `"/"` |  |
| livenessProbe.httpGet.port | string | `"http"` |  |
| nameOverride | string | `""` |  |
| nodeSelector | object | `{}` |  |
| podAnnotations | object | `{}` |  |
| podLabels | object | `{}` |  |
| podSecurityContext | object | `{}` |  |
| readinessProbe.httpGet.path | string | `"/"` |  |
| readinessProbe.httpGet.port | string | `"http"` |  |
| replicaCount | int | `1` |  |
| resources | object | `{}` |  |
| securityContext | object | `{}` |  |
| service.port | int | `3000` |  |
| service.type | string | `"ClusterIP"` |  |
| serviceAccount.annotations | object | `{}` |  |
| serviceAccount.automount | bool | `true` |  |
| serviceAccount.create | bool | `true` |  |
| serviceAccount.name | string | `""` |  |
| tolerations | list | `[]` |  |
| volumeMounts | list | `[]` |  |
| volumes | list | `[]` |  |

## Notes
- Secret keys must match exactly: `apitoken` and `password`.
- If you change the Secret names/keys, update `config.apiTokenSecretName` and/or
  `config.passwordSecretName` accordingly.
