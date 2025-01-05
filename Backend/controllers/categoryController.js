const Category = require("../models/category");
const express = require("express");
const router = express.Router();

// POST: Add a new category
router.post("/category", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).send({ message: "Category already exists" });
    }

    //const newCategory = new Category({ name, description });
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    await newCategory.save();

    res.status(201).send({
      message: "Category added successfully!",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET: Retrieve all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET: Retrieve a category by ID
router.get("/category/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.status(200).send(category);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// PUT: Update a category by ID
router.put("/category/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Update fields if provided
    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.status(200).send({
      message: "Category updated successfully!",
      category,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
module.exports = router;
