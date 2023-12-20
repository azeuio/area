# Use an official Node.js image
FROM node:20.9-buster-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json /app/

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . /app/

# Expose any required ports
EXPOSE 3000

# Start the React application
CMD ["yarn", "start"]
