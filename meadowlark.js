const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");

const handlers = require("./libs/handlers");
const weatherMiddleware = require("./libs/middleware/weather");

const app = express();

app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "main",
    helpers: {
      section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        console.log("this._sections");
        console.log(this._sections);
        return null;
      },
    },
  })
);

app.set("view engine", "handlebars");
// app.set("trust proxy", true);
app.disable("x-powered-by");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

app.use(weatherMiddleware);

app.get("/", handlers.home);
app.get("/about", handlers.about);

app.get("/newsletter-signup", handlers.newsletterSignup);
app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);
app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);

// pagina 404 personalizada
app.use(handlers.notFound);

// pagina 500 personalizada
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, (error) => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
  });
} else {
  module.exports = app;
}
