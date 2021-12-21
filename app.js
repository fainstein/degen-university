const express = require('express');
// const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
var _ = require('lodash');

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const dotenv = require('dotenv').config()

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

// const fileFilter = function (req, file, cb) {
//
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//       // reject a file if its not jpeg, jpg or png
//     cb(null, false);
//   }
// }
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
  /*,
   fileFilter: fileFilter */
});

const app = express();

app.set('view engine', 'ejs');

app.use(session({
  secret: "Let$g0t0th3M4LL#2021.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));
app.use('/images', express.static("images"));

// MONGOOSE MONGODB CONNECT

mongoose.connect('mongodb+srv://degenmaster:Yw8GziDFPhLHErG@degenuniversity.lolji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
// mongoose.connect("mongodb://localhost:27017/DeGenDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



filtersArray = [{
    value: "fitness",
    content: "Fitness"
  }, {
    value: "selfImprovement",
    content: "Self-Improvement "
  },
  {
    value: "crypto",
    content: "Crypto"
  },
  {
    value: "nftMetaverse",
    content: "NFTs & Metaverse"
  },
  {
    value: "finance",
    content: "Finance"
  },
  {
    value: "eCommerceCarrer",
    content: "E-Commerce & Career"
  },
  {
    value: "trade",
    content: "Trade"
  },
  {
    value: "sales",
    content: "Sales"
  },
  {
    value: "taxes",
    content: "Taxes"
  },
  {
    value: "cooking",
    content: "Cooking"
  },
  {
    value: "naturalLife",
    content: "Natural Life"
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
  avatarImg: String,
  tags: [String]
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

userSchema.plugin(passportLocalMongoose);


// MONGOOSE MODELS
const User = mongoose.model("User", userSchema);
const News = mongoose.model("News", newsSchema);
const DeGen = mongoose.model("DeGen", deGenSchema);
const Comment = mongoose.model("Comment", commentSchema);
const DeGenClass = mongoose.model("DeGenClass", deGenClassSchema);
const ShopItem = mongoose.model("ShopItem", shopItemSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
  _id: req.params.classId
  }, (err, singleClass) => {
    if (err) {
      console.log(err);
    } else {
      res.render("class", {
        deGenClass: singleClass
      });
    }
  })
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




// POST METHODS

app.post("/new-comment", (req, res) => {

  const newComment = new Comment({
    author: req.body.author,
    content: req.body.commentContent,
    date: Date.now()
  });

  // newComment.save();


  DeGenClass.findById(req.body.classId, (err, foundClass) => {
    if (!err) {
      foundClass.comments.push(newComment);
      foundClass.save(err => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('back');
        }
      });
    } else {
      console.log(err);
    }
  });
});
// app.post("/results", function (req, res) {
//   res.redirect("/results/" + _.toLower(req.body.searchQuery));
// })


//NEWS ADMIN
app.route("/admin")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      News.find((err, news) => {
        if (err) {
          console.log(err);
        } else {
          res.render("admin/admin", {
            newsArray: news
          })
        }
      })
    } else {
      res.redirect("/login");
    }
  })
  .post(upload.single('userImg'), (req, res) => {
    if (req.isAuthenticated()) {
      const newNews = new News({
        title: req.body.newsTitle,
        description: req.body.newsDescription,
        image: req.file.path
      });
      newNews.save(err => {
        if (!err) {
          console.log("Succesfully added a new News");
          res.redirect("/admin");
        } else {
          console.log(err);
        }
      })
    } else {
      res.redirect("/login");
    }
  });

app.post("/deleteNews", (req, res) => {
  if (req.isAuthenticated()) {
    News.deleteOne({
      _id: req.body.idTarget
    }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Article succesfully deleted");
        res.redirect("/admin");
      }
    })
  } else {
    res.redirect("/login");
  }
});

// CLASSES Admin

app.route("/adminClasses")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      DeGenClass.find((err, deGenClasses) => {
        if (err) {
          console.log(err);
        } else {
          DeGen.find((err, deGens) => {
            if (err) {
              console.log(err);
            } else {
              res.render("admin/adminClasses", {
                classesArray: deGenClasses,
                filtersArray: filtersArray,
                deGensArray: deGens
              })
            }
          })
        }
      })
    } else {
      res.redirect("/login");
    }
  })
  .post((req, res) => {
    if (req.isAuthenticated()) {
      const descriptionParagraphsArray = req.body.classDescription.split(/\r\n|\r|\n/g);

      let tagsArray = [];
      for (let i = 0; i < filtersArray.length; i++) {
        if (req.body[filtersArray[i].value]) {
          tagsArray.push(filtersArray[i].content);
        }
      }

      DeGen.findOne({
        _id: req.body.classDeGen
      }, (err, foundDeGen) => {
        if (err) {
          console.log(err);
        } else {
          const newClass = new DeGenClass({
            deGen: foundDeGen,
            title: req.body.classTitle,
            shortDescription: req.body.classShortDescription,
            description: descriptionParagraphsArray,
            tags: tagsArray
          });
          newClass.save(err => {
            if (!err) {
              console.log("Succesfully added a new Class");
              res.redirect("/adminClasses");
            } else {
              console.log(err);
            }
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  });

app.post("/deleteClass", (req, res) => {
  if (req.isAuthenticated()) {
    DeGenClass.deleteOne({
      _id: req.body.idTarget
    }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Class succesfully deleted");
        res.redirect("/adminClasses");
      }
    })
  } else {
    res.redirect("/login");
  }
});

app.get("/admin/classes/:classId", function(req, res) {
  if (req.isAuthenticated()) {
    DeGenClass.findOne({
      _id: req.params.classId
    }, (err, singleClass) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin/adminClass", {
          deGenClass: singleClass
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/deleteComment", (req, res) => {
  if (req.isAuthenticated()) {
    DeGenClass.findById(req.body.classId, (err, foundClass) => {
      if (!err) {
        foundClass.comments.splice(req.body.idTarget, 1);
        foundClass.save();
        console.log("Comment deleted succesfully");
        res.redirect('back');
      } else {
        console.log(err);
      }
    });
  } else {
    res.redirect("/login");
  }
})

// ADMIN DE GENS
app.route("/adminDeGens")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      DeGen.find((err, deGens) => {
        if (err) {
          console.log(err);
        } else {
          res.render("admin/adminDeGens", {
            deGensArray: deGens,
            tagsArray: filtersArray
          })
        }
      })
    } else {
      res.redirect("/login");
    }
  })

  .post(upload.single('userImg'), (req, res) => {
    if (req.isAuthenticated()) {
      let newDeGenTags = [];
      for (let i = 0; i < filtersArray.length; i++) {
        if (req.body[filtersArray[i].value]) {
          newDeGenTags.push(filtersArray[i].content);
        }
      }
      const newDeGen = new DeGen({
        alias: req.body.deGenAlias,
        twitter: req.body.deGenTwitter,
        substack: req.body.deGenSubstack,
        avatarImg: req.file.path,
        tags: newDeGenTags
      })
      newDeGen.save(err => {
        if (!err) {
          console.log("Succesfully added a new DeGen");
          res.redirect("/adminDeGens");
        } else {
          console.log(err);
        }
      });
    } else {
      res.redirect("/login");
    }
  });

app.post("/deleteDeGen", (req, res) => {
  if (req.isAuthenticated()) {
    DeGen.deleteOne({
      _id: req.body.idTarget
    }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("DeGen succesfully deleted");
        res.redirect("/adminDeGens");
      }
    })
  } else {
    res.redirect("/login");
  }
});


// ADMIN SHOP
app.route("/adminShop")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      ShopItem.find((err, shopItems) => {
        if (err) {
          console.log(err);
        } else {
          res.render("admin/adminShop", {
            shopItemArray: shopItems,
            filtersArray: filtersArray
          })
        }
      })
    } else {
      res.redirect("/login");
    }
  })
  .post(upload.single('userImg'), (req, res) => {
    if (req.isAuthenticated()) {
      let newShopItemTags = [];
      for (let i = 0; i < filtersArray.length; i++) {
        if (req.body[filtersArray[i].value]) {
          newShopItemTags.push(filtersArray[i].content);
        }
      }
      const newShopItem = new ShopItem({
        image: req.file.path,
        title: req.body.shopItemTitle,
        content: req.body.shopItemDescription,
        price: req.body.shopItemPrice,
        tags: newShopItemTags,
        link: req.body.shopItemLink
      });
      newShopItem.save(err => {
        if (!err) {
          console.log("Succesfully added a new Shop Item");
          res.redirect("/adminShop");
        } else {
          console.log(err);
        }
      });
    } else {
      res.redirect("/login");
    }
  });

app.post("/deleteShopItem", (req, res) => {
  if (req.isAuthenticated()) {
    ShopItem.deleteOne({
      _id: req.body.idTarget
    }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Shop Item succesfully deleted");
        res.redirect("/adminShop");
      }
    })
  } else {
    res.redirect("/login");
  }
});

// LOGIN

app.route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    req.login(user, err => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/admin");
        });
      }
    })
  });

app.route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    User.register({
      username: req.body.username
    }, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/admin");
        });
      }
    })
  });

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/admin");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server succesfully running");
});
