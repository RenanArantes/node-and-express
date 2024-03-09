const express = require("express");
const expressHandlebars = require("express-handlebars");

const app = express();

app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.render("home"));

app.get("/about", (req, res) => res.render("about"));

// pagina 404 personalizada
app.use((req, res) => {
  res.status(404);
  res.render("404");
});

// pagina 500 personalizada
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500);
  res.render("500");
});

app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
});
