FROM node:20-alpine

WORKDIR /app

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

RUN yarn install
RUN chmod +x ./run

ENTRYPOINT [ "./run" ]
