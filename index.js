const axios = require("axios");
const cors = require("cors");
const express = require("express");

const app = new express();
const PORT = process.env.PORT | 3000;

app.get("/", (req, res) => {
  res.send("Hello all working");
});

app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
