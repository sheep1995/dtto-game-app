# 使用官方 Node.js 20 映像作為基礎映像
FROM node:20

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製其餘的應用程式程式碼到工作目錄
COPY . .

# 編譯 TypeScript 代碼
RUN npm run build

# 暴露應用程序的端口（假設應用程序在端口 3000 上運行）
EXPOSE 3000

# 定義容器啟動時要運行的命令
CMD ["npm", "start"]
