const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;
const mongoose = require("mongoose");
app.use(cors());
// const autoIncrement = require("mongoose-auto-increment");
const Schema = mongoose.Schema;
const detailSchema = new Schema({
  humidity: {
    type: String,
  },
  temperature: {
    type: Number,
  },
  time: {
    type: String,
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
});
const locationSchema = new Schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  goods: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Detail = mongoose.model("Detail", detailSchema);
const Location = mongoose.model("Location", locationSchema);

mongoose.connect("mongodb://127.0.0.1:27017/s", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("Connection with MongoDB was successful");
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello pranjal!");
});

app.get("/getData", function (req, res) {
  Detail.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});
app.get("/getlocation", function (req, res) {
  Location.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/makeathon", (req, res) => {
  const { humidity, temperature, time, longitude, latitude } = req.body;

  const detail = new Detail({
    humidity: humidity,
    temperature: temperature,
    time: time,
    longitude: longitude,
    latitude: latitude,
  });

  detail
    .save()
    .then(() => {
      res.send(detail);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/location", async (req, res) => {
  const { from, to, goods } = req.body;

  try {
    const location = new Location({
      from,
      to,
      goods,
      timestamp: new Date(),
    });
    await location.save();
    res.send(location);
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
