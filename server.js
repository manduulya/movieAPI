const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const moviesData = require("./movies-data-small.json");

const app = express();

const morganSettings =
  process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganSettings));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  //move to the next middleware
  next();
});

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

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {});
