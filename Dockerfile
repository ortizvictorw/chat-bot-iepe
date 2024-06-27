# Stage 1: Build
FROM node:18-bullseye as bot

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:18-bullseye

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=bot /app .

# Set environment variables
ARG PUBLIC_URL
ARG PORT

# Expose the specified port
EXPOSE ${PORT}

# Start the application
CMD ["npm", "start"]
