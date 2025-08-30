FROM node:current-alpine3.22

# Set working directory
WORKDIR /books-app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Ensure entrypoint script is executable
RUN chmod +x ./entrypoint.sh

# Create uploads directory inside container
RUN mkdir -p /app/uploads

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]