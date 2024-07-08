FROM node:20.11.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm uninstall bcrypt

RUN npm install bcrypt

EXPOSE 4000

CMD ["npm", "start"]