# Use official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
