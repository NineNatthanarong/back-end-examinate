FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGO_URI=mongodb://mongodb:27017/seed_db
ENV PORT=3000

EXPOSE ${PORT}

CMD ["node", "server.js"]