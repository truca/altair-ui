# Use the official Node.js image as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --prod --no-audit

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN yarn build

# Expose the app on port 3000
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]