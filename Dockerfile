# Étape de production
FROM node:16

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json yarn.lock ./
RUN yarn install

RUN yarn build

EXPOSE 3000

CMD ["yarn", "preview", "--port", "3000"]