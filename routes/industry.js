const express = require("express");
const router = new express.Router();
const db = require("../db");

// Add an industry
router.post("/", async (req, res, next) => {
  const { code, industry } = req.body;
  const result = await db.query(
    `INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`,
    [code, industry]
  );

  return res.status(201).json({ industry: result.rows[0] });
});

// List all industries
router.get("/", async (req, res, next) => {
  const result = await db.query(`SELECT * FROM industries`);
  return res.json({ industries: result.rows });
});

// Associate an industry with a company
router.post("/:comp_code/industries/:ind_code", async (req, res, next) => {
  const { comp_code, ind_code } = req.params;
  const result = await db.query(
    `INSERT INTO companies_industries (comp_code, ind_code) VALUES ($1, $2) RETURNING comp_code, ind_code`,
    [comp_code, ind_code]
  );

  return res.status(201).json({ association: result.rows[0] });
});

module.exports = router;
