# Docker Deployment Guide

This guide explains how to run the Ecommerce Analytics Dashboard in Docker with persistent data storage.

## 🐳 Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Stop and remove volumes (deletes persistent data)
docker-compose down -v
```

### Using Docker CLI

```bash
# Build the image
docker build -t ecommerce-dashboard .

# Run with persistent volume
docker run -d \
  --name ecommerce-dashboard \
  -p 3000:3000 \
  -v ecommerce-data:/app/data \
  ecommerce-dashboard

# View logs
docker logs -f ecommerce-dashboard

# Stop and remove container
docker stop ecommerce-dashboard
docker rm ecommerce-dashboard
```

## 📦 Data Persistence

### How It Works

1. **Volume Mount**: The `/app/data` directory is mounted as a Docker volume
2. **JSON Storage**: Sales data is saved to `/app/data/sales-data.json`
3. **Auto-Save**: Data is automatically saved when prices are updated
4. **Auto-Load**: Data is loaded from file on container startup

### Volume Management

**List volumes:**
```bash
docker volume ls
```

**Inspect volume:**
```bash
docker volume inspect ecommerce-dashboard_sales-data
```

**Backup data:**
```bash
# Copy data from container to host
docker cp ecommerce-dashboard:/app/data/sales-data.json ./backup-sales-data.json
```

**Restore data:**
```bash
# Copy data from host to container
docker cp ./backup-sales-data.json ecommerce-dashboard:/app/data/sales-data.json

# Restart container to load new data
docker restart ecommerce-dashboard
```

**Remove volume (deletes all data):**
```bash
docker volume rm ecommerce-dashboard_sales-data
```

## 🔧 Configuration

### Environment Variables

Set in `docker-compose.yml` or pass with `-e` flag:

```yaml
environment:
  - NODE_ENV=production
  - DATA_FILE=/app/data/sales-data.json
  - PORT=3000
```

### Custom Port

Change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Access on port 8080
```

Or with Docker CLI:
```bash
docker run -d -p 8080:3000 -v ecommerce-data:/app/data ecommerce-dashboard
```

## 🚀 Access the Dashboard

Once running, access:
- **Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **API Base**: http://localhost:3000/api/v1

## 📊 Data Persistence Example

1. **Start container:**
   ```bash
   docker-compose up -d
   ```

2. **Update a product price:**
   ```bash
   curl -X PUT http://localhost:3000/api/v1/products/prod-001/price \
     -H "Content-Type: application/json" \
     -d '{"price": 149.99}'
   ```

3. **Restart container:**
   ```bash
   docker-compose restart
   ```

4. **Verify data persisted:**
   - Visit http://localhost:3000
   - Click "Product Pricing" tab
   - Price change should still be there!

## 🔍 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Check if port is already in use
lsof -i :3000
```

### Data not persisting
```bash
# Verify volume is mounted
docker inspect ecommerce-dashboard | grep Mounts -A 10

# Check data file exists
docker exec ecommerce-dashboard ls -la /app/data/
```

### Reset to default data
```bash
# Stop container
docker-compose down

# Remove volume
docker volume rm ecommerce-dashboard_sales-data

# Start fresh
docker-compose up -d
```

## 🏗️ Production Deployment

### With Docker Swarm

```bash
docker stack deploy -c docker-compose.yml ecommerce
```

### With Kubernetes

Create a PersistentVolumeClaim:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ecommerce-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Mount in deployment:

```yaml
volumeMounts:
  - name: data
    mountPath: /app/data
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: ecommerce-data
```

## 📝 Notes

- Data is stored in JSON format for simplicity
- For production, consider using a proper database (PostgreSQL, MongoDB, etc.)
- Volume data persists even when container is removed
- Use `docker-compose down -v` to completely reset