const express = require("express");

const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (req, res) => {
  db("accounts")
    .limit(req.query.limit ? req.query.limit : null)
    .orderBy(req.query.orderby ? req.query.orderby : "id")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      res.status(500).json({ message: "Cannot get posts: " + err.message });
    });
});

router.get("/:id", validateAccountId, (req, res) => {
  res.status(200).json(req.account[0]);
});

router.post("/", validateAccount, async (req, res) => {
  try {
    const result = await db("accounts").insert({
      name: req.body.name,
      budget: req.body.budget
    });
    res.status(201).json({
      message: "Account created successfully",
      account: { id: result[0], name: req.body.name, budget: req.body.budget }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cannot create account: " + error.message });
  }
});

router.put("/:id", validateAccountId, validateAccount, async (req, res) => {
  try {
    const result = await db("accounts")
      .where({ id: req.params.id })
      .update({ name: req.body.name, budget: req.body.budget });
    res.status(200).json({
      message: `Account with id of ${req.params.id} got updated`,
      account: {
        id: req.params.id,
        name: req.body.name,
        budget: req.body.budget
      }
    });
  } catch (error) {
    res.status(500).json({
      message: `Cannot update account with id of ${req.params.id}: ${error.message}`
    });
  }
});

router.delete("/:id", validateAccountId, (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then(result => {
      res.status(200).json({
        message: "Account deleted successfully",
        id: Number(req.params.id)
      });
    })
    .catch(error => {
      res.status(500).json({
        message: `Cannot delete account with id of ${req.params.id}: ${error.message}`
      });
    });
});

//custom middleware
function validateAccountId(req, res, next) {
  db("accounts")
    .where({ id: req.params.id })
    .then(account => {
      if (account.length) {
        req.account = account;
        next();
      } else {
        res
          .status(404)
          .json({ message: `No account with id of ${req.params.id} exists` });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Something went terribly wrong trying to get account with id of ${req.params.id} : ${err.message}`
      });
    });
}

function validateAccount(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "Missing account data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing required name field" });
  } else if (!req.body.budget) {
    res.status(400).json({ message: "Missing required budget field" });
  } else {
    next();
  }
}

module.exports = router;
