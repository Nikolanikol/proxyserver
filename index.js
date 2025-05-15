// server.js
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const app = express();

const PORT = process.env.PORT || 3000;
// Подключаем middleware CORS для разрешения кросс-доменных запросов
app.use(cors());

// Для обработки JSON-тел запросов
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "ok!" });
});
// Простой маршрут для проверки работы сервера
app.get("/hello", (req, res) => {
  res.send("Привет! Сервер на Node.js, Express и CORS работает.");
});

// Пример дополнительного маршрута
app.get("/api/data", (req, res) => {
  res.json({ message: "Это данные с сервера!" });
});

// Запуск сервера
app.listen(PORT, () => console.log("server started " + PORT));
