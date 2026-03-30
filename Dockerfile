FROM node:18

WORKDIR /app

# install backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# install frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install && npm run build

# copy code
COPY . .

# copy build vào backend
RUN cp -r frontend/build backend/build

WORKDIR /app/backend

CMD ["node", "index.js"]
