//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { rearg } = require("lodash");

const homeStartingContent = "Create a unique and beautiful blog easily.";
const aboutContent = "Share Your Story with the world. Create a difference";
const contactContent = "Contatc details.";
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});
// app.post("/posts", function(req, res){;
//   Post.deleteOne({ _id : req.body._id }).then(function(){
//     console.log(req);
//     console.log("Data deleted");
//     res.redirect("/"); // Success
// }).catch(function(error){
//     console.log(error); // Failure
// });
// });
app.post("/posts", async (req, res) => {
  try {
    let model = await Post.find({ id: req.id });
    model[0].remove();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});
app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      id: post.id,
      title: post.title,
      content: post.content,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
