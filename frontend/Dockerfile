# Use a standard Node image as the base
FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies (This step relies entirely on the volume mount being correct)
RUN npm install --no-cache

# Copy all remaining source code
COPY . .

# Command to run the development server
CMD ["npm", "run", "dev"]
