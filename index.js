const axios = require("axios");
const cors = require("cors");
const express = require("express");

const app = new express();
const PORT = process.env.PORT | 3000;
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello all working");
});
app.get("/manga", async (req, res) => {
  try {
    const responce = await axios
      .get("https://api.mangadex.org/manga")
      .then((res) => res.data);
    res.send(responce);
  } catch (error) {
    console.log(error);
  }
});
app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
