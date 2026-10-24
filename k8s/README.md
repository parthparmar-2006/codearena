# Kubernetes

Plain YAML with Kustomize. `base/` holds every resource; overlays only change images.

| Overlay | Images | Used for |
|---|---|---|
| `overlays/local` | `codearena-<service>:latest` built by compose, `imagePullPolicy: IfNotPresent` | k3d / minikube / Docker Desktop |
| `overlays/prod` | `ghcr.io/<owner>/codearena-<service>:<sha>` (set by CI) | k3s on EC2 |

## Run locally with k3d

Run these from the repo root. They need Docker, kubectl and k3d.

```bash
# 1. Cluster with the ingress (Traefik) published on localhost:8081
k3d cluster create codearena -p "8081:80@loadbalancer"

# 2. Build the images and copy them into the cluster
docker compose build
k3d image import -c codearena \
  codearena-problem-service:latest codearena-submission-service:latest \
  codearena-judge-service:latest codearena-frontend:latest

# 3. Namespace and secret (never committed)
kubectl create namespace codearena
kubectl -n codearena create secret generic codearena-secrets \
  --from-literal=POSTGRES_PASSWORD='choose-a-password' \
  --from-literal=INTERNAL_TOKEN="$(openssl rand -hex 24)"

# 4. Deploy and wait
kubectl apply -k k8s/overlays/local
kubectl -n codearena rollout status deploy --timeout=300s
kubectl -n codearena get pods,hpa
```

Open http://localhost:8081. Without the ingress, use `kubectl -n codearena port-forward svc/frontend 8080:8080`. That serves the UI, but API calls then go through nginx, which also works.

Clean up with `k3d cluster delete codearena`.

**minikube or Docker Desktop:** replace step 1 with your cluster. Replace step 2 with `minikube image load <image>`; Docker Desktop can use local images directly. Both need an ingress controller with class `traefik` for the Ingress, or use port-forward.

## Validate without a cluster

```bash
kubectl kustomize k8s/overlays/local
kubectl kustomize k8s/overlays/prod
```
