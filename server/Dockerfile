# Use an official Node.js image
FROM node:21.5-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . /app/

# Expose the port that the NestJS application will run on
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "start"]
