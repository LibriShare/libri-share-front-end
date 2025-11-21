# Estágio 1: Build (Construção)
FROM node:18-alpine AS build

# --- ADICIONE ESTAS 2 LINHAS ---
# 1. Declara o argumento que vamos receber do docker-compose
ARG NEXT_PUBLIC_API_URL
# 2. Define a variável de ambiente DENTRO do build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# --- FIM DA ADIÇÃO ---

RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

# Estágio 2: Produção (Execução)
FROM node:18-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["pnpm", "start"]