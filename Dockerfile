# Usar Node.js como base
FROM node:18

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos para o container
COPY package.json package-lock.json ./
RUN npm install

# Copiar restante do código
COPY . .

# Expor porta (Railway usará automaticamente)
EXPOSE 3001

# Comando para rodar o servidor
CMD ["npm", "start"]
