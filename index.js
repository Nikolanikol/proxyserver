// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
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
app.get("/getmanga", async (req, res) => {
  const data = await axios
    .get(`https://api.mangadex.org/manga`)
    .then((res) => res.data);
  res.json(data);

  res.send("Привет! Сервер на Node.js, Express и CORS работает.");
});

// Пример дополнительного маршрута
app.get("/api/data", (req, res) => {
  res.json({ message: "Это данные с сервера!" });
});

// Запуск сервера
app.listen(PORT, () => console.log("hello start app"));
