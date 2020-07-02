const fs = require("fs");
const path = require("path")

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userExtnReq = require("./routers/Extn_req");
const dashSummary = require("./routers/dash_summry");
const userAuth = require("./routers/auth");
const dashImages = require("./routers/dash_images");

const app = express();

app.use('/upload/image', express.static(path.join('upload','images')))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(bodyParser.json());


app.use("/api/auth", userAuth);
app.use("/api/extn/user", userExtnReq);
app.use("/api/dash/summary", dashSummary);
app.use("/api/dash/images", dashImages);

app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err=>{
      // console.log(err)
    })
  }

  if (res.headerSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error" });
});
mongoose
  .connect(
    "mongodb+srv://prabjot:prabjot123@cluster0-xfofv.mongodb.net/content?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
