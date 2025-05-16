const axios = require("axios");
const cors = require("cors");
const express = require("express");

const app = new express();
const PORT = process.env.PORT | 3000;
const BASEURL = `https://api.mangadex.org`;
app.use(cors());
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
app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
