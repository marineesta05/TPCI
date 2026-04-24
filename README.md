# TP CI CD — App Full Stack

Application web full-stack avec pipeline CI/CD automatisé, déployée sur Azure VM via Kubernetes.

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Backend | Node.js / Express |
| Frontend | React |
| Conteneurisation | Docker |
| Registry | GitHub Container Registry (GHCR) |
| Orchestration | Kubernetes (minikube) |
| Infrastructure | Azure VM (Ubuntu) |
| CI/CD | GitHub Actions |

## Architecture

```
GitHub Push (main)
    │
    ├─ 1. Tests (npm test)
    │
    ├─ 2. Build & Push
    │     ├─ Build image backend → ghcr.io/.../tpci-backend
    │     └─ Build image frontend → ghcr.io/.../tpci-frontend
    │
    └─ 3. Deploy (SSH → VM Azure)
          ├─ kubectl set image deployment/backend
          └─ kubectl set image deployment/frontend
```

## Prérequis

- Azure VM avec minikube installé
- Déploiements Kubernetes `backend` et `frontend` existants
- Secrets GitHub configurés pour accès SSH et GHCR

## Secrets GitHub requis

| Secret | Description |
|--------|-------------|
| `VM_HOST` | IP publique de la VM Azure |
| `VM_USER` | Utilisateur SSH (ex: `azureuser`) |
| `VM_SSH_KEY` | Clé privée SSH (contenu du fichier `.pem`) |
| `CR_PAT` | Personal Access Token GitHub avec scope `write:packages` |

## Pipeline CI/CD

Le pipeline `.github/workflows/ci.yml` se déclenche à chaque push sur `main` :

### Job 1 — Tests
```yaml
- npm ci
- npm test
```

### Job 2 — Build & Push
```yaml
permissions:
  contents: read
  packages: write
```
Build les images Docker et les push sur GHCR avec deux tags : `latest` et `${{ github.sha }}`.

### Job 3 — Deploy
Connexion SSH à la VM puis mise à jour des déploiements Kubernetes :
```bash
kubectl set image deployment/backend backend=ghcr.io/.../tpci-backend:<sha>
kubectl set image deployment/frontend frontend=ghcr.io/.../tpci-frontend:<sha>
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend
```

## Déploiement manuel (première fois)

Sur la VM Azure, exposer les services :

```bash
# Exposer le frontend sur le port 80
sudo kubectl port-forward service/frontend-service 80:80 \
  --address 0.0.0.0 \
  --kubeconfig /home/azureuser/.kube/config &

# Exposer le backend sur le port 3001
sudo kubectl port-forward service/backend-service 3001:3001 \
  --address 0.0.0.0 \
  --kubeconfig /home/azureuser/.kube/config &
```

## Accès à l'application

| Service | URL |
|---------|-----|
| Frontend | `http://<VM_HOST>` |
| Backend health | `http://<VM_HOST>:3001/health` |
| Backend API | `http://<VM_HOST>:3001/api/message` |

## Structure du projet

```
.
├── .github/
│   └── workflows/
│       └── ci.yml          # Pipeline CI/CD
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── README.md
```

## Variables d'environnement

### Backend
| Variable | Description |
|----------|-------------|
| `PORT` | Port d'écoute (défaut: 3001) |

### Frontend (build-time)
| Variable | Description |
|----------|-------------|
| `REACT_APP_BACKEND_URL` | URL du backend (ex: `http://<VM_HOST>:3001`) |