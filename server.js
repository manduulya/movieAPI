const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const moviesData = require("./movies-data-small.json");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.get("/movie", (req, res) => {
  let response = moviesData;

  if (req.query.genre) {
    response = response.filter((response) =>
      response.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  if (req.query.country) {
    response = response.filter((response) =>
      response.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }
  if (req.query.avg_vote) {
    response = response.filter(
      (response) => Number(response.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
