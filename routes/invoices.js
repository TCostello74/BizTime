const express = require("express");
const router = new express.Router();
const db = require("../db");

//Return info on invoices
router.get("/", async function (req, res, next) {
    const result = await db.query(`SELECT id, comp_code FROM invoices`);
    return res.json({invoices: result.rows});
});

//Returns obj on given invoice
router.get("/:id", async function (req, res, next) {
    const result = await db.query(`SELECT invoices.id, invoices.amt, invoices.paid, invoices.add_date, invoices.paid_date, companies.code, companies.name, companies.description FROM invoices INNER JOIN companies ON invoices.comp_code = companies.code WHERE invoices.id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
        return next(new ExpressError(`No such invoice: ${req.params.id}`, 404));
    }
    const invoiceData = result.rows[0];
    invoiceData.company = {
        code: invoiceData.code,
        name: invoiceData.name,
        description: invoiceData.description,
    };
    delete invoiceData.code;
    delete invoiceData.name;
    delete invoiceData.description;
    return res.json({invoice: invoiceData});
});

//Adds an invoice
router.post("/", async function (req, res, next) {
    const result = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [req.body.comp_code, req.body.amt]);
    return res.status(201).json({invoice: result.rows[0]});
});

//Updates an invoice
router.put("/:id", async function (req, res, next) {
    const result = await db.query(`UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [req.body.amt, req.params.id]);
    if (result.rows.length === 0) {
        return next(new ExpressError(`No such invoice: ${req.params.id}`, 404));
    }
    return res.json({invoice: result.rows[0]});
});

//Deletes an invoice
router.delete("/:id", async function (req, res, next) {
    const result = await db.query(`DELETE FROM invoices WHERE id = $1 RETURNING id`, [req.params.id]);
    if (result.rows.length === 0) {
        return next(new ExpressError(`No such invoice: ${req.params.id}`, 404));
    }
    return res.json({status: "deleted"});
});

module.exports = router;
