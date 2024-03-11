const express = require("express");
const expressHandlebars = require("express-handlebars");

const handlers = require("./libs/handlers");

const app = express();

app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

app.get("/", handlers.home);

app.get("/about", handlers.about);

// pagina 404 personalizada
app.use(handlers.notFound);

// pagina 500 personalizada
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
  });
} else {
  module.exports = app;
}
