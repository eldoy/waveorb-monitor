# FROM ubuntu:20.04
FROM node:22-alpine3.19
WORKDIR /app
COPY . .
RUN npm i
CMD ["node", "docker.js"]
EXPOSE 3000