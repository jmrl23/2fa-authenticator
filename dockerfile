FROM node:20-alpine

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn run prisma db push
RUN yarn run build

ENTRYPOINT [ "yarn", "run", "start" ]
