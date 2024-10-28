FROM node:20.11.1

# Set working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install nodemon globally and npm packages with superuser permissions, then change ownership to the "node" user
RUN npm install -g nodemon && \
    npm install -g ts-node && \
    npm install -g typescript && \
    npm install --unsafe-perm=true --allow-root --only=dev

# Copy the entire source code to the working directory
COPY . .

# Change ownership of the working directory to the "node" user
RUN chown -R node:node /app

ARG EXPOSE_PORT

# Expose port
EXPOSE $EXPOSE_PORT
