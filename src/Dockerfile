FROM node:latest

WORKDIR /app


EXPOSE 3000


ENV PATH /app/node_modules/.bin:$PATH

COPY package-lock.json  /app/
COPY package.json /app/
RUN npm install react-router-dom react-bootstrap bootstrap@5.1.3 react-router-bootstrap react-bootstrap-range-slider --save
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . ./


CMD ["npm", "start"]


