FROM node:latest

WORKDIR /app


EXPOSE 3000



RUN npm install react-router-dom react-bootstrap bootstrap@5.1.3

COPY package-lock.json  /app/
COPY package.json /app/

COPY ./ ./

CMD ["npm", "start"]


