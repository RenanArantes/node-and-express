module.exports = (req, res, next) => {
  // se houver uma mensagem flash, transfira-a para o contexto, depois remova-a
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
};
