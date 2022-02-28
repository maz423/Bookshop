FROM node:latest

WORKDIR /app


EXPOSE 3000


ENV PATH /app/node_modules/.bin:$PATH
RUN npm install react-router-dom react-bootstrap bootstrap@5.1.3

COPY package-lock.json  /app/
COPY package.json /app/
RUN npm install

COPY . ./


CMD ["npm", "start"]


