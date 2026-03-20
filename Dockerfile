FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY api/package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Create data directory for persistence
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set environment variable for data file
ENV DATA_FILE=/app/data/sales-data.json

# Start the application
CMD ["node", "api/server.js"]