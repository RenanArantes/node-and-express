const fortune = require("./fortune");

exports.home = (req, res) => res.render("home");

exports.about = (req, res) => res.render("about", { fortune: fortune.getFortune(), layout: "secondOption" });

exports.notFound = (req, res) => res.render("404");

exports.serverError = (err, req, res, next) => {
  console.error(err.message);
  console.log(err.stack);
  res.status(500).render("500");
};

exports.newsletterSignup = (req, res) => {
  res.render("newsletter-signup", { csrf: "CSRF token goes here" });
};

exports.newsletterSignupProcess = (req, res) => {
  console.log(`Form (from querystring): ${req.query.form}`);
  console.log(`CSRF token (from hidden form field): ${req.body._csrf}`);
  console.log(`Name (from visible form field): ${req.body.name}`);
  console.log(`Email (from visible form field): ${req.body.email}`);
  res.redirect(303, "/newsletter-signup/thank-you");
};

exports.newsletterSignupThankYou = (req, res) => res.render("newsletter-signup-thank-you");

exports.newsletter = (req, res) => {
  res.render("newsletter", { csrf: "CSRF token goes here" });
};

exports.api = {
  newsletterSignup: (req, res) => {
    console.log(`Form (from querystring): `);
    console.log(req.query);
    console.log("body");
    console.log(req.body);
    console.log(`CSRF token (from hidden form field): ${req.body._csrf}`);
    console.log(`Name (from visible form field): ${req.body.name}`);
    console.log(`Email (from visible form field): ${req.body.email}`);
    res.send({ result: "success" });
  },
};

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log("received fields:");
  console.log(fields);
  console.log("received files:");
  console.log(files);
  res.redirect(303, "/contest/vacation-photo-thank-you");
};

exports.api.vacationPhotoContest = (req, res, fields, files) => {
  console.log("req.params");
  console.log(req.params);
  console.log("received fields:");
  console.log(fields);
  console.log("received files:");
  console.log(files);
  res.send({ result: "success" });
};
