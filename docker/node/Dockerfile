FROM node:20.11.1

# Set working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install nodemon globally and npm packages with superuser permissions, then change ownership to the "node" user
RUN npm install -g @nestjs/cli && \
    npm install -g ts-node && \
    npm install -g typescript

# Copy the entire source code to the working directory
COPY . .

# Change ownership of the working directory to the "node" user
RUN chown -R node:node /app

USER node

ARG EXPOSE_PORT

# Expose port
EXPOSE $EXPOSE_PORT

CMD ["tail", "-f", "/dev/null"]
