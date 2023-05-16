# Use an appropriate base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . /app

# Install the application dependencies
RUN npm install

# Expose the port on which the application will listen
EXPOSE 8080

# Define the entry point for the container
CMD ["npm", "start"]
