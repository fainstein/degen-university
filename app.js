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
];

const newsSchema = mongoose.Schema({
title: String,
description: String,
image: String
});

const deGenSchema = mongoose.Schema({
alias: String,
twitter: String,
substack: String,
avatarImg: String
});

const commentSchema = mongoose.Schema({
author: String,
content: String,
date: Date
});


const deGenClassSchema = mongoose.Schema({
deGen: deGenSchema,
title: String,
shortDescription: String,
description: [String],
tags: [String],
comments: [commentSchema]
});

const shopItemSchema = mongoose.Schema({
  image: String,
title: String,
content: String,
price: String,
tags: [String],
link: String
});



// MONGOOSE MODELS
const News = mongoose.model("News", newsSchema);
const DeGen = mongoose.model("DeGen", deGenSchema);
const Comment = mongoose.model("Comment", commentSchema);
const DeGenClass = mongoose.model("DeGenClass", deGenClassSchema);
const ShopItem = mongoose.model("ShopItem", shopItemSchema);

//ESTO ES PROVISORIO HASTA ARMAR LOS POST METHODS
const new1 = new News ({
  title:"Lorem ipsum 1",
  description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  image: "BowTiedOx.jpg"
});

const new2 = new News ({
  title:"Lorem ipsum 2",
  description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  image: "angryBird.jpeg"
});

const new3 = new News ({
  title:"Lorem ipsum 3",
  description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  image: "reptile.jpg"
});

const newsHardcoded = [new1, new2, new3];

const deGen1 = new DeGen({
alias: "BowTiedOx",
twitter: "BowTiedOx",
twitterLink: "https://twitter.com/",
substack: "BowTiedOx",
substackLink: undefined,
avatarImg: "BowTiedOx.jpg"
});

deGen1.substackLink = "https://" + deGen1.substack + ".substack.com/subscribe";

const comment1 = new Comment({
author: "BowTiedBull",
content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
date: new Date()
});

const class1 = new DeGenClass ({
  deGen: deGen1,
  title: "Why you must train",
  shortDescription: "Here BowTiedOx, 5x DeGen Island bodybuilding champion is going to teach you the basics of training and it's importance. Here BowTiedOx, 5x DeGen Island bodybuilding champion is going to teach you the basics of training and it's importance",
  description: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."],
  tags: ["Fitness", "Diet", "DeFi"],
  comments: [comment1, comment1]
})

const shopItem1 = new ShopItem({
image: "reptile.jpg",
title: "OX's Fat Loss Program",
content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
price: "255 U$TT",
tags: ["Fitness", "Diet", "DeFi"],
link: "https://bowtiedox.substack.com/subscribe"
});

// GET METHODS

app.get("/", function (req, res) {
  res.render("index", {newsArray: newsHardcoded});
});

app.get("/classes", function (req, res) {
  res.render("classes", {classesArray: [class1, class1, class1], filters: filtersArray});
});

app.get("/class", function (req, res) {
  res.render("class", {deGenClass: class1});
});

app.get("/shop", function (req, res) {
  res.render("shop", {shopItemArray: [shopItem1, shopItem1, shopItem1, shopItem1, shopItem1, shopItem1], filters: filtersArray});
});

app.get("/deGens", function (req, res) {
  res.render("deGens", {deGensArray: [deGen1, deGen1, deGen1, deGen1, deGen1, deGen1]});
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
