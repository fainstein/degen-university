const express = require('express');
// const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
var _ = require('lodash');

// file storage
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

/*const fileFilter = function (req, file, cb) {

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
      // reject a file if its not jpeg, jpg or png
    cb(null, false);
  }
}*/

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5
//   } /*,
//   fileFilter: fileFilter */
// });

const app = express();

app.set('view engine', 'ejs');


app.use(express.urlencoded({
  extended: true
}));


app.use(express.static("public"));
app.use('/images', express.static("images"));

// MONGOOSE MONGODB CONNECT

// mongoose.connect('mongodb+srv://foodmaster:PIGSd0ntfly@cj-cluster.dztz8.mongodb.net/CJDB', {
mongoose.connect("mongodb://localhost:27017/DeGenDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
filtersArray = [{
    value: "web30",
    content: "Web 3.0"
  },
  {
    value: "fitness",
    content: "Fitness"
  },
  {
    value: "diet",
    content: "Diet"
  },
  {
    value: "selfImprovement",
    content: "Self-Improvement"
  },
  {
    value: "finance",
    content: "Finance"
  },
  {
    value: "deFi",
    content: "DeFi"
  },
  {
    value: "nfts",
    content: "NFTs"
  }
]

// GET METHODS

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/classes", function (req, res) {
  res.render("classes", {filters: filtersArray});
});

app.get("/class", function (req, res) {
  res.render("class");
});

app.get("/shop", function (req, res) {
  res.render("shop", {filters: filtersArray});
});

app.get("/deGens", function (req, res) {
  res.render("deGens");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});


// POST METHODS

// app.post("/results", function (req, res) {
//   res.redirect("/results/" + _.toLower(req.body.searchQuery));
// })


app.listen(process.env.PORT || 3000, function () {
  console.log("Server succesfully running");
});
