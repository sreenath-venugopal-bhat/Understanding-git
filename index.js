import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
let posts = [];
app.use(express.static("static"));

app.use(bodyParser.urlencoded({ extended: true }));

//Render home page
app.get("/", (req, res) => {
  res.render("index.ejs",{year:new Date().getFullYear()});
});

//Display form
app.get("/post", (req, res) => {
  res.render("writeblog.ejs", {
    id: "",
    title: "",
    author: "",
    content: "",
    btnValue: "Submit Post",
  });
});

//Submit blog details
app.post("/submit", (req, res) => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  req.body.date = `${day}-${month}-${year}`;

  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  req.body.time = `${hours}:${minutes}`;

  if (req.body.id) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === Number(req.body.id)) {
        posts[i].title = req.body.title;
        posts[i].author = req.body.author;
        posts[i].content = req.body.content;
        posts[i].date = req.body.date;
        posts[i].time = req.body.time;
        break;
      }
    }
  } else {
    req.body.id = Date.now();
    posts.push(req.body);
  }

  res.redirect("/posts");
});

//Display all posts
app.get("/posts", (req, res) => {
  res.render("blogPosts.ejs", { posts: posts });
});

//View a single post
app.get("/posts/:id", (req, res) => {
  const identifier = req.params.id;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === Number(identifier)) {
      return res.render("blogDetails.ejs", posts[i]);
    }
  }
  res.status(404).send("Post not found.");
});

//Delete post
app.get("/delete/:id", (req, res) => {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === Number(req.params.id)) {
      posts.splice(i, 1);
      break;
    }
  }
  res.redirect("/posts");
});

//Edit post
app.get("/editpost/:id", (req, res) => {
  let postToEdit = posts.find((post) => post.id === Number(req.params.id));
  postToEdit.btnValue = `Save Changes`;
  res.render("writeblog.ejs", postToEdit);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
