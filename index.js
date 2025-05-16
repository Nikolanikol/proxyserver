const axios = require("axios");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = new express();
const PORT = process.env.PORT | 3000;
const BASEURL = `https://api.mangadex.org`;
app.use(cors());
// Определяем путь к папке с загруженными файлами
const downloadsDir = path.join(__dirname, "downloads");

// Проверяем наличие папки "downloads", если её нет — создаем
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
  console.log("📂 Папка 'downloads' успешно создана.");
}
app.use("/downloads", express.static(downloadsDir));
//check endpoint
app.get("/", (req, res) => {
  res.send("Hello all working");
});
//get mangai tems endpoint
app.get("/manga", async (req, res) => {
  try {
    const responce = await axios
      .get(BASEURL + "/manga", {
        params: {
          offset: 20,
          limit: 20,
        },
      })
      .then((res) => res.data);
    res.send(responce);
  } catch (error) {
    console.log(error);
  }
});
//getcover img
app.get("/cover", async (req, res) => {
  try {
    const { id } = req.query;

    const responce = await axios(BASEURL + "/cover" + "/" + id).then(
      (res) => res.data
    );
    res.send(responce);
  } catch (error) {
    console.log(error);
  }
});
app.get("/test", async (req, res) => {
  try {
    const { query: imageUrl } = req.query;
    console.log(imageUrl, "imgUrl");
    if (!imageUrl) {
      return res.status(400).send("Ошибка: Укажите URL изображения");
    }

    try {
      const response = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
      });
      console.log(response, "response");
      // Передаем изображение клиенту без сохранения
      res.setHeader("Content-Type", response.headers["content-type"]);
      console.log("header setted");
      response.data.pipe(res);
    } catch (error) {
      console.error("Ошибка получения изображения:", error.message);
      res.status(500).send("Не удалось загрузить изображение");
    }
  } catch (error) {}
});

app.get("/download", async (req, res) => {
  const imageUrl =
    "https://uploads.mangadex.org/covers/0f19ed5a-e496-4416-8d4d-86d338655156/d6ea2d68-709b-4c17-9e67-2f93fa759071.jpg.256.jpg";
  //   req.query.url; // Получаем URL изображения из параметра запроса
  if (!imageUrl) {
    return res.status(400).send("Ошибка: Не указан URL изображения");
  }

  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    const fileName = path.basename(imageUrl);
    const filePath = path.join(__dirname, "downloads", fileName);

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      res.send(`✅ Изображение сохранено: ${filePath}`);
    });

    writer.on("error", (err) => {
      console.error("Ошибка записи файла:", err);
      res.status(500).send("Ошибка при сохранении изображения");
    });
  } catch (error) {
    console.error("Ошибка загрузки изображения:", error.message);
    res.status(500).send("Не удалось загрузить изображение");
  }
});

app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
