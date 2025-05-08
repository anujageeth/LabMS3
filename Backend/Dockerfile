FROM node:20.14.0-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (bcryptjs doesn't need build tools)
RUN npm install --production

# Copy app source
COPY . .

# Expose port
EXPOSE 3001

# Start command
CMD [ "node", "server.js" ]