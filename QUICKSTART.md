# 🚀 Quick Start Guide - Push to GitHub Container Registry

Follow these steps to build and push your Docker container to GitHub Container Registry (GHCR).

## Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: `GHCR_TOKEN`
4. Select scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
5. Click **"Generate token"**
6. **Copy the token** (save it somewhere safe!)

## Step 2: Set Your GitHub Username

```bash
# Replace with your actual GitHub username
export GITHUB_USERNAME="your-github-username"
```

## Step 3: Login to GitHub Container Registry

```bash
# Login (paste your token when prompted for password)
docker login ghcr.io -u $GITHUB_USERNAME
```

## Step 4: Build the Docker Image

```bash
# Navigate to the project directory
cd ecommerce-dashboard

# Build the image
docker build -t ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest .
```

## Step 5: Push to GitHub Container Registry

```bash
# Push the image
docker push ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest
```

## Step 6: Make Package Public (Optional)

1. Go to: https://github.com/YOUR_USERNAME?tab=packages
2. Click on **"ecommerce-dashboard"**
3. Click **"Package settings"** (bottom right)
4. Scroll to **"Danger Zone"**
5. Click **"Change visibility"** → **"Public"**

## Step 7: Test Your Container

```bash
# Pull your image
docker pull ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Run it
docker run -d -p 3000:3000 \
  -v ecommerce-data:/app/data \
  ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# Access dashboard
open http://localhost:3000
```

## 🎉 Done!

Your container is now on GitHub Container Registry!

Share it with others:
```bash
docker pull ghcr.io/YOUR_USERNAME/ecommerce-dashboard:latest
```

---

## 🤖 Bonus: Automatic Builds with GitHub Actions

The project includes a GitHub Actions workflow that automatically builds and pushes your Docker image when you push to GitHub.

### Enable Automatic Builds:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ecommerce-dashboard.git
   git push -u origin main
   ```

2. **GitHub Actions will automatically:**
   - Build your Docker image
   - Push it to GHCR
   - Tag it with `latest` and commit SHA

3. **Check the build:**
   - Go to your repo → **Actions** tab
   - Watch the build progress

### Create Version Tags:

```bash
# Tag a version
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions will create:
# - ghcr.io/YOUR_USERNAME/ecommerce-dashboard:v1.0.0
# - ghcr.io/YOUR_USERNAME/ecommerce-dashboard:v1.0
# - ghcr.io/YOUR_USERNAME/ecommerce-dashboard:v1
# - ghcr.io/YOUR_USERNAME/ecommerce-dashboard:latest
```

---

## 📋 All Commands in One Place

```bash
# 1. Set username
export GITHUB_USERNAME="your-github-username"

# 2. Login
docker login ghcr.io -u $GITHUB_USERNAME

# 3. Build
cd ecommerce-dashboard
docker build -t ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest .

# 4. Push
docker push ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest

# 5. Test
docker pull ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest
docker run -d -p 3000:3000 -v ecommerce-data:/app/data \
  ghcr.io/$GITHUB_USERNAME/ecommerce-dashboard:latest
```

---

## 🆘 Troubleshooting

### "denied: permission_denied"
- Make sure your token has `write:packages` permission
- Re-login: `docker logout ghcr.io` then `docker login ghcr.io`

### "unauthorized: authentication required"
- Check you're using your GitHub username (not email)
- Use your Personal Access Token as password (not GitHub password)

### Build fails
- Make sure you're in the `ecommerce-dashboard` directory
- Check Dockerfile exists: `ls -la Dockerfile`

### Can't access after running
- Check container is running: `docker ps`
- Check logs: `docker logs <container-id>`
- Verify port 3000 is not in use: `lsof -i :3000`

---

## 📚 More Information

- Full deployment guide: See `GITHUB_ICR_DEPLOYMENT.md`
- Docker usage: See `DOCKER.md`
- Project README: See `README.md`