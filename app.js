const express = require('express');
// const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
var _ = require('lodash');

// file storage
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './images/');
  },
  filename: function(req, file, cb) {
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

app.use(express.static(__dirname + '/public'));
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

const userSchema = mongoose.Schema({
  username: String,
  password: String
});

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
const User = mongoose.model("User", userSchema);
const News = mongoose.model("News", newsSchema);
const DeGen = mongoose.model("DeGen", deGenSchema);
const Comment = mongoose.model("Comment", commentSchema);
const DeGenClass = mongoose.model("DeGenClass", deGenClassSchema);
const ShopItem = mongoose.model("ShopItem", shopItemSchema);

// GET METHODS

app.get("/", function(req, res) {

  News.find((err, news) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        newsArray: news
      });
    }
  })

});

app.get("/classes", function(req, res) {

  DeGenClass.find((err, deGenClasses) => {
    if (err) {
      console.log(err);
    } else {
      res.render("classes", {
        classesArray: deGenClasses,
        filters: filtersArray
      });
    }
  });
});

app.get("/class/:classId", function(req, res) {

  DeGenClass.findOne({
    id: req.params.classId
  }, (err, singleClass) => {
    if (err) {
      console.log(err);
    } else {
      res.render("class", {
        deGenClass: singleClass
      });
    }
  });
});

app.get("/shop", function(req, res) {

  ShopItem.find((err, shopItems) => {
    if (err) {
      console.log(err);
    } else {
      res.render("shop", {
        shopItemArray: shopItems,
        filters: filtersArray
      });
    }
  });
});

app.get("/deGens", function(req, res) {

  DeGen.find((err, deGens) => {
    if (err) {
      console.log(err);
    } else {
      res.render("deGens", {
        deGensArray: deGens
      });
    }
  });

});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/login", function(req, res) {
  res.render("login");
});


// POST METHODS

// app.post("/results", function (req, res) {
//   res.redirect("/results/" + _.toLower(req.body.searchQuery));
// })


app.listen(process.env.PORT || 3000, function() {
  console.log("Server succesfully running");
});
