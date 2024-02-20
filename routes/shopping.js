const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const shoppingList = require("../fakeDb");

router.get("/", (req, res) => {
  res.json({ shoppingList });
});

router.post("/", (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      throw new ExpressError("Name and price are required!", 400);
    }
    const newItem = { name, price };
    shoppingList.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", (req, res) => {
  const foundItem = shoppingList.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  res.json({ item: foundItem });
});

router.patch("/:name", (req, res) => {
  const foundItem = shoppingList.find((item) => item.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  foundItem.name = req.body.name;
  foundItem.price = req.body.price;
  res.json({ updated: foundItem });
});

router.delete("/:name", (req, res) => {
  const foundItem = shoppingList.findIndex(
    (item) => item.name === req.params.name
  );
  if (foundItem === -1) {
    throw new ExpressError("Item not found", 404);
  }
  shoppingList.splice(foundItem, 1);
  res.json({ message: "Deleted" });
});

module.exports = router;
