var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  imageSource: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  profileLink: {
    type: String,
    required: true
  },
  authorImage: {
    type: String,
    required: true
  }
  
});
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
