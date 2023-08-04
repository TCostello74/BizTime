/** BizTime express application. */


const express = require("express"); //import express library

const app = express(); //intialize instance of express
const ExpressError = require("./expressError") //import custom ExpressError class
const companyRoutes = require("./routes/companies"); //import routes from companies.js
const invoiceRoutes = require("./routes/invoices"); //import routes from invoices.js

app.use(express.json()); //middleware-- allows use of req.body (json)
app.use("/companies", companyRoutes); //telling app to use companyRoutes router for any path starting with /companies
app.use("/invoices", invoiceRoutes); //telling app to use invoiceRoutes router

/** 404 handler */

app.use(function(req, res, next) { //defines middleware function
  const err = new ExpressError("Not Found", 404); //catches any request not handled by other routes
  return next(err); //passed to next function in middleware stack
});

/** general error handler */

app.use((err, req, res, next) => { //general error handling middleware
  res.status(err.status || 500); //called when preceding middleware function calls 'next'

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
