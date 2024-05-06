require("dotenv").config();
const express = require("express");
const mongoDB = require("./db/connect");
const usersSchema = require("./models/user");
const jwt = require("jsonwebtoken");
const cors = require("cors");
// const router = express.Router();
const router = require("./controllers/apiControllers");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello everyone!");
});

app.use("/api", router);

app.listen(process.env.PORT, () => {
  try {
    console.log("Server is running at port ", process.env.PORT);
    //mongodb database connection
    mongoDB();
  } catch (error) {
    console.log(error);
  }
});
