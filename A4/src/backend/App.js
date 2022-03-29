const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JSONStream = require("JSONStream");

mongoose
  .connect(
    "mongodb+srv://adnan:abCXCd1TciAbxpJR@cluster0.lbvrc.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection failed");
  });

const Account = require("./models/account");
const Post = require("./models/post");

app.post("/api/register", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new Account({
      username: req.body.username,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
});

app.post("/api/login", (req, res, next) => {
  let fetchedUser;
  console.log(req.body.username);
  Account.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      return res.status(200).json({
        message: "Login Successfull",
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials!",
      });
    });
});

app.get("/api/getList", (req, res, next) => {
  const postQuery = Post.find();
  let fetchedPosts;

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
});
let arrayOfUsers = [];
app.get("/api/refreshData", (req, res) => {
  Post.find().deleteMany().exec();
  const dataStreamFromFile = fs.createReadStream(`sample2.json`);
  dataStreamFromFile
    .pipe(JSONStream.parse("*"))
    .on("data", async (userData) => {
      arrayOfUsers.push(userData);

      dataStreamFromFile.pause();
      await Post.insertMany(arrayOfUsers);
      arrayOfUsers = [];
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
