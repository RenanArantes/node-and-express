const express = require("express");
const expressHandlebars = require("express-handlebars");
const multiparty = require("multiparty");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

const handlers = require("./libs/handlers");
const weatherMiddleware = require("./libs/middleware/weather");
const flashMiddleware = require("./libs/middleware/flash");
const { credentials } = require("./config");

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
app.use(bodyParser.json());

app.use(cookieParser(credentials.cookieSecret));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
  })
);

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

app.use(weatherMiddleware);
app.use(flashMiddleware);

app.get("/", handlers.home);
app.get("/about", handlers.about);

app.get("/newsletter-signup", handlers.newsletterSignup);
app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);
app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);

// handlers for fetch/JSON form submission
app.get("/newsletter", handlers.newsletter);
app.post("/api/newsletter-signup", handlers.api.newsletterSignup);

app.post("/contest/vacation-photo/:year/:month", (req, res) => {
  console.log("req.body");
  console.log(req.body);
  console.log("req.query");
  console.log(req.query);
  console.log("req.params");
  console.log(req.params);
  const form = new multiparty.Form();
  form.parse(req, (error, fields, files) => {
    if (error) return res.status(500).send({ error: error.message });
    handlers.vacationPhotoContestProcess(req, res, fields, files);
  });
});

app.post("/api/vacation-photo-contest/:year/:month", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (error, fields, files) => {
    if (error) return res.status(500).send({ error: error.message });
    handlers.api.vacationPhotoContest(req, res, fields, files);
  });
});

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
