# GitHub Container Registry (GHCR) Deployment Guide

This guide shows you how to build and push your Docker container to GitHub Container Registry (ghcr.io).

## 📋 Prerequisites

1. **GitHub Account** with a personal access token (PAT)
2. **Docker** installed locally
3. **Git** repository initialized

## 🔑 Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: `GHCR_TOKEN`
4. Select scopes:
   - ✅ `write:packages` (includes read:packages)
   - ✅ `delete:packages` (optional, for cleanup)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

## 🔐 Step 2: Login to GitHub Container Registry

```bash
# Set your GitHub username
export GITHUB_USERNAME="your-github-username"

# Login to GHCR (paste your token when prompted)
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# Or login interactively
docker login ghcr.io -u $GITHUB_USERNAME
# Enter your PAT when prompted for password
```

## 🏗️ Step 3: Build the Docker Image

```bash
# Navigate to project directory
cd ecommerce-dashboard

# Build the image with GHCR tag
docker build -t ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest .

# Build with version tag
docker build -t ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:v1.0.0 .

# Build both tags at once
docker build \
  -t ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest \
  -t ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:v1.0.0 \
  .
```

## 📤 Step 4: Push to GitHub Container Registry

```bash
# Push latest tag
docker push ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Push version tag
docker push ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:v1.0.0

# Push all tags
docker push ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard --all-tags
```

## 🔓 Step 5: Make Package Public (Optional)

1. Go to your GitHub profile
2. Click "Packages" tab
3. Click on "ecommerce-dashboard"
4. Click "Package settings" (bottom right)
5. Scroll to "Danger Zone"
6. Click "Change visibility" → "Public"

## 🚀 Step 6: Pull and Run from GHCR

```bash
# Pull the image
docker pull ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Run the container
docker run -d \
  --name ecommerce-dashboard \
  -p 3000:3000 \
  -v ecommerce-data:/app/data \
  ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Or use docker-compose with GHCR image
```

## 📝 Step 7: Update docker-compose.yml for GHCR

Create `docker-compose.ghcr.yml`:

```yaml
version: '3.8'

services:
  ecommerce-dashboard:
    image: ghcr.io/YOUR_GITHUB_USERNAME/ecommerce-dashboard:latest
    ports:
      - "3000:3000"
    volumes:
      - sales-data:/app/data
    environment:
      - NODE_ENV=production
      - DATA_FILE=/app/data/sales-data.json
    restart: unless-stopped

volumes:
  sales-data:
    driver: local
```

Run with:
```bash
docker-compose -f docker-compose.ghcr.yml up -d
```

## 🤖 Step 8: Automate with GitHub Actions (Optional)

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./ecommerce-dashboard
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

## 📋 Complete Command Reference

### Build Commands
```bash
# Basic build
docker build -t ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest .

# Multi-platform build (ARM + x86)
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest \
  --push .
```

### Push Commands
```bash
# Push single tag
docker push ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Push all tags
docker push ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard --all-tags
```

### Pull Commands
```bash
# Pull latest
docker pull ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Pull specific version
docker pull ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:v1.0.0
```

### Tag Commands
```bash
# Tag existing image
docker tag ecommerce-dashboard:latest \
  ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Create version tag
docker tag ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest \
  ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:v1.0.0
```

## 🔍 Verify Deployment

```bash
# Check image exists
docker images | grep ecommerce-dashboard

# Inspect image
docker inspect ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Test run
docker run --rm -p 3000:3000 \
  ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest
```

## 🌐 Share Your Container

Once public, anyone can pull and run:

```bash
docker pull ghcr.io/YOUR_USERNAME/ecommerce-dashboard:latest
docker run -d -p 3000:3000 ghcr.io/YOUR_USERNAME/ecommerce-dashboard:latest
```

## 🧹 Cleanup

```bash
# Remove local images
docker rmi ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Delete package from GitHub
# Go to Package settings → Delete this package
```

## 🐛 Troubleshooting

### Authentication Failed
```bash
# Re-login
docker logout ghcr.io
docker login ghcr.io -u $GITHUB_USERNAME

# Check token has correct permissions
# Token needs: write:packages, read:packages
```

### Push Denied
```bash
# Ensure you're logged in
docker login ghcr.io

# Check image name format
# Must be: ghcr.io/USERNAME/IMAGE:TAG
```

### Image Not Found
```bash
# Check package visibility (public vs private)
# Private packages require authentication to pull
```

## 📚 Additional Resources

- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Build Documentation](https://docs.docker.com/engine/reference/commandline/build/)
- [GitHub Actions for Docker](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)