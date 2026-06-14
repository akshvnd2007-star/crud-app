const express = require("express");
const fs = require("fs");

const app = express();
const FILE = "data.json";

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serves style.css

// HOME
app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.render("index", { students: data });
});

// ADD
app.post("/add", (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE));

  const student = {
    id: Date.now().toString(),
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    phone: req.body.phone,
    course: req.body.course,
    city: req.body.city
  };

  data.push(student);
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.redirect("/");
});

// DELETE
app.get("/delete/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE));

  data = data.filter(s => s.id !== req.params.id);

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.redirect("/");
});

// EDIT PAGE
app.get("/edit/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));

  const student = data.find(s => s.id === req.params.id);

  res.render("edit", { student });
});

// UPDATE
app.post("/update/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE));

  data = data.map(s => {
    if (s.id === req.params.id) {
      return {
        id: s.id,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        phone: req.body.phone,
        course: req.body.course,
        city: req.body.city
      };
    }
    return s;
  });

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});