# Use Node.js 18 LTS with Debian (required for TensorFlow.js and Canvas)
FROM node:18-slim

# Install system dependencies for Canvas and image processing
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    pkg-config \
    libpixman-1-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libgif-dev \
    libjpeg-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libxrender1 \
    libxext6 \
    libgomp1 \
    libgtk-3-0 \
    libsm6 \
    libnss3 \
    libxi6 \
    libxss1 \
    libatk-bridge2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - use npm install since we may need to compile native modules
# Force rebuild of canvas for JPEG support
RUN npm install && npm rebuild canvas

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
