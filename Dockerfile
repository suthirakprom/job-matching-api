FROM node:16.13-alpine
WORKDIR /app
ADD . .
RUN npm install
CMD npm start
