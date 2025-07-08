FROM ubuntu:22.04

# Evitar preguntas interactivas
ENV DEBIAN_FRONTEND=noninteractive

# Instala Node.js 18 y dependencias necesarias para Puppeteer/Chrome
RUN apt-get update && \
    apt-get install -y curl gnupg2 ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs \
    wget \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libdrm2 \
    xdg-utils \
    libgbm1 \
    libxshmfence1 \
    libglu1-mesa \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Crear carpeta de trabajo
WORKDIR /app

# Copiar dependencias y código
COPY package*.json ./
RUN npm install

COPY . .


# Exponer puerto
EXPOSE 3000
RUN ls -l /app/tokens/reminder-session || echo "❌ NO EXISTE reminder-session"

# Ejecutar el bot
CMD ["node", "index.js"]
