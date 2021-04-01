FROM node:14

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install && npm build

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "src/index.js" ]