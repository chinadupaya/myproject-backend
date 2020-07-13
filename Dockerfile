FROM node:12
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./ 
COPY . .
RUN npm install
# Bundle app source
#COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]