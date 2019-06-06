var express = require("express");
var router = express.Router();
var path = require("path");

var request = require("request");
var cheerio = require("cheerio");

var Article = require("../models/Article.js");


router.get("/", function(req, res) {
  res.redirect("/articles");
});


router.get("/scrape", function(req, res) {
    request("https://www.freecodecamp.org/news/", function(error, response, html) {
    var $ = cheerio.load(html);
    var titlesArray = [];

    $("article").each(function(i, element) {
     
      var result = {};

      result.title = $(this).find("h2.post-card-title > a").text().trim();
      result.link = "https://www.freecodecamp.org" + $(this).find("h2.post-card-title > a").attr("href");
      result.imageSource = $(element).find("img.post-card-image").attr("src");
      if(!result.imageSource.startsWith("http")){
        result.imageSource = "https://www.freecodecamp.org" + result.imageSource;
      }
      result.authorName = $(this).find("div.author-name-tooltip").text().trim();
      result.profileLink = "https://www.freecodecamp.org" + $(this).find("a.static-avatar").attr("href");
      result.authorImage = $(this).find("img.author-profile-image").attr("src"); 
      if (result.authorImage.startsWith("//")) {
        result.authorImage = "https:" + result.authorImage;
      } else if (result.authorImage.startsWith("/news")) {
        result.authorImage = "https://www.freecodecamp.org" + result.authorImage;
      }



      if (result.title !== "" && result.link !== "") { //if we have title and link...
        if (titlesArray.indexOf(result.title) == -1) { // and if we don't already have the title in the array...
          titlesArray.push(result.title); //push the title to the titles array

          Article.count({ title: result.title }, function(err, test) { 
            if (test === 0) {
              var entry = new Article(result);

              entry.save(function(err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  //console.log(doc);
                }
              });
            }
          });
        } else {
          console.log("Article already exists.");
        }
      } else {
        console.log("Not saved to DB, missing data");
      }
    });
    res.redirect("/articles");
  });
});

router.get("/articles", function(req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render("index", artcl); //index.handlebars
      }
    });
});


router.get("/clearAll", function(req, res) {
  Article.remove({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
    //  console.log("removed all articles");
    }
  });
  res.redirect("/articles");
});


module.exports = router;
