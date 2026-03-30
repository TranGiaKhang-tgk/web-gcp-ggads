FROM node:18

# tạo thư mục làm việc
WORKDIR /app

# copy package.json của backend trước
COPY backend/package*.json ./backend/

# cài thư viện
RUN cd backend && npm install

# copy toàn bộ project
COPY . .

# chuyển vào backend
WORKDIR /app/backend

# chạy server
CMD ["node", "index.js"]