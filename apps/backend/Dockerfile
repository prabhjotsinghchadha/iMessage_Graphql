FROM node:alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm -g install turbo@1.6.3
COPY . .
RUN turbo prune --scope=backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY packages/ packages/
RUN npx prisma generate 
COPY turbo.json turbo.json
RUN ls -a
RUN npm run build

FROM node:alpine AS runner
WORKDIR /app

# Don't run production as root
#RUN addgroup --system --gid 1001 expressjs
#RUN adduser --system --uid 1001 expressjs
#USER expressjs
COPY --from=installer /app .
WORKDIR /app/apps/backend

EXPOSE 4000

CMD [ "npm", "start" ]
