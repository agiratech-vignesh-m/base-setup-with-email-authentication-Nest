FROM node:19

WORKDIR /backend/api

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 4001

CMD ["npm", "run", "start:prod"]