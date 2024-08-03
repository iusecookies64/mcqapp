FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build:packages

EXPOSE 5173

EXPOSE 3000

EXPOSE 8080

CMD ["npm", "run", "start"]



