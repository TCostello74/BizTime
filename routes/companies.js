const express = require("express");
const db = require("../db"); 
const ExpressError = require("../expressError");
const router = express.Router();

//get all companies
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query("SELECT code, name FROM companies");
        return res.json({companies: results.rows});
    } catch (e) {
        return next(e);
    }
});


//Return obj of company
router.get("/:code", async function (req, res, next) {
    const compResult = await db.query("SELECT code, name, description FROM companies WHERE code = $1", [req.params.code]);
    if (compResult.rows.length === 0) {
        return next(new ExpressError(`No such company: ${req.params.code}`, 404));
    }
    const invResult = await db.query("SELECT id FROM invoices WHERE comp_code = $1", [req.params.code]);
    const company = compResult.rows[0];
    company.invoices = invResult.rows;
    return res.json({company: company});
});


//create new company
router.post("/", async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const result = await db.query("INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description", [code, name, description]);
        return res.status(201).json({company: result.rows[0]});
    } catch (e) {
        return next(e);
    }
});

// using company code update comapny name/description
router.put("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const result = await db.query("UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description", [name, description, code]);
        
        //if no matching code, throw error
        if (result.rows.length === 0) {
            throw new ExpressError(`No company with code: ${code}`, 404);
        }

        return res.json({company: result.rows[0]});
    } catch (e) {
        return next(e);
    }
});

//used to delete company by specific code
router.delete("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query("DELETE FROM companies WHERE code=$1 RETURNING code", [code]);

        //if doesnt exist, throw error
        if (result.rows.length === 0) {
            throw new ExpressError(`No company with code: ${code}`, 404);
        }

        return res.json({status: "deleted"});
    } catch (e) {
        return next(e);
    }
});


module.exports = router;


