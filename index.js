const axios = require("axios");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { send } = require("process");

const app = new express();
const PORT = process.env.PORT | 3000;
const BASEURL = `https://api.mangadex.org`;
const LANG = "en";
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
app.get("/manga/catalog", async (req, res) => {
  const { offset, limit, createdAtSince, includedTags, contentRating, title } =
    req.query;

  console.log(
    "createdAtSince",
    createdAtSince,
    "includedTags",
    includedTags,
    "contentRating",
    contentRating
  );
  try {
    const responce = await axios
      .get(BASEURL + "/manga", {
        params: {
          offset,
          limit,
          includedTags: [includedTags],
          createdAtSince,
          contentRating: [contentRating],
          //   hasAvailableChapters: true,
          order: {
            relevance: "desc",
          },
          title,
          availableTranslatedLanguage: [LANG],

          //   originalLanguage: ["ja"],
        },
      })
      .then((res) => res.data);
    res.send(responce);
  } catch (error) {
    console.log("ошибка получения каталога");
  }
});

///получаем тайтлы через поиск
app.get("/manga/search", async (req, res) => {
  const { title } = req.query;

  console.log(title);

  const responce = await axios.get(BASEURL + "/manga", {
    params: {
      title,
    },
  });
  res.send(responce.data);
});
//получаем filename
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
//зеркалим изображение
app.get("/cover/img", async (req, res) => {
  try {
    const { query: imageUrl } = req.query;

    if (!imageUrl) {
      return res.status(400).send("Ошибка: Укажите URL изображения");
    }

    try {
      const response = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
      });

      // Передаем изображение клиенту без сохранения
      res.setHeader("Content-Type", response.headers["content-type"]);

      response.data.pipe(res);
    } catch (error) {
      console.error("Ошибка получения изображения:", error.message);
      res.status(500).send("Не удалось загрузить изображение");
    }
  } catch (error) {}
});
//получаем информацию о манге тайтл
app.get("/manga/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const responce = await axios(BASEURL + "/manga" + "/" + id).then(
      (res) => res.data
    );
    res.send(responce);
  } catch (error) {
    console.log(error);
  }
});

///ПОЛУЧАЕМ СПИСОК ГЛАВ МАНГИ
app.get("/manga/:id/chapters", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const responce = await axios(BASEURL + "/manga" + "/" + id + "/aggregate", {
      params: {
        translatedLanguage: [LANG],
        groups: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
      },
    });

    res.send(responce.data);
  } catch (error) {
    console.log(error);
  }
});
//ПОЛУАЧАЕМ СЛАЙДЫ ДЛЯ МАНГИ ПО ID
app.get("/manga/chapter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const responce = await axios(BASEURL + "/at-home/server" + "/" + id);
    res.send(responce.data);
  } catch (error) {
    console.log(error);
  }
});
/////ЗАГРУДАЕМ ТЕГИ ДЛЯ ПОИСКА МАНГИ
app.get("/tags", async (req, res) => {
  const responce = await axios(BASEURL + "/manga/tag");
  res.send(responce.data.data);
});

app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});

///модуль для загрузки фото
// app.get("/download", async (req, res) => {
//   const imageUrl =
//     "https://uploads.mangadex.org/covers/0f19ed5a-e496-4416-8d4d-86d338655156/d6ea2d68-709b-4c17-9e67-2f93fa759071.jpg.256.jpg";
//   //   req.query.url; // Получаем URL изображения из параметра запроса
//   if (!imageUrl) {
//     return res.status(400).send("Ошибка: Не указан URL изображения");
//   }

//   try {
//     const response = await axios({
//       url: imageUrl,
//       method: "GET",
//       responseType: "stream",
//     });

//     const fileName = path.basename(imageUrl);
//     const filePath = path.join(__dirname, "downloads", fileName);

//     const writer = fs.createWriteStream(filePath);
//     response.data.pipe(writer);

//     writer.on("finish", () => {
//       res.send(`✅ Изображение сохранено: ${filePath}`);
//     });

//     writer.on("error", (err) => {
//       console.error("Ошибка записи файла:", err);
//       res.status(500).send("Ошибка при сохранении изображения");
//     });
//   } catch (error) {
//     console.error("Ошибка загрузки изображения:", error.message);
//     res.status(500).send("Не удалось загрузить изображение");
//   }
// });
