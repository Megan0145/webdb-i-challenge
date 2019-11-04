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
    res
      .status(500)
      .json({
        message: `Cannot get post with id of ${req.params.id} : ${error.message}`
      });
  }
});

module.exports = router;
