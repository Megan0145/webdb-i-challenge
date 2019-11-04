const express = require("express");

const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (req, res) => {
  db("accounts")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      res.status(500).json({ message: "Cannot get posts: " + err.message });
    });
});

router.get("/:id", async (req, res) => {
  try {
    const result = await db("accounts").where({ id: req.params.id });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({
      message: `Cannot get post with id of ${req.params.id} : ${error.message}`
    });
  }
});

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", (req, res) => {
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
      res
        .status(500)
        .json({
          message: `Cannot delete account with id of ${req.params.id}: ${error.message}`
        });
    });
});

module.exports = router;
