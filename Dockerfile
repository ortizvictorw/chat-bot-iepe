# Use the official Node.js image as a base image
FROM node:18-bullseye as bot

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
