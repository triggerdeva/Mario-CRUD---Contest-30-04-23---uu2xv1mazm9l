const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const marioModel = require("./models/marioChar");

// Middlewares
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// GET all Mario characters
app.get("/mario", async (req, res) => {
  try {
    const marios = await marioModel.find();
    res.json(marios);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET a single Mario character by ID
app.get("/mario/:id", getMario, (req, res) => {
  try {
    res.json(res.mario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST a new Mario character
app.post("/mario", async (req, res) => {
  const { name, weight } = req.body;
  if (!name || !weight) {
    res.status(400).json({ message: "either name or weight is missing" });
    return;
  }

  const mario = new marioModel({ name, weight });

  try {
    const newMario = await mario.save();
    res.status(201).json(newMario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH an existing Mario character by ID
app.patch("/mario/:id", getMario, async (req, res) => {
  const { name, weight } = req.body;
  if (name) {
    res.mario.name = name;
  }
  if (weight) {
    res.mario.weight = weight;
  }

  try {
    const updatedMario = await res.mario.save();
    res.json(updatedMario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an existing Mario character by ID
app.delete("/mario/:id", getMario, async (req, res) => {
  try {
    await res.mario.remove();
    res.json({ message: "character deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware function to get a single Mario character by ID
async function getMario(req, res, next) {
  try {
    const mario = await marioModel.findById(req.params.id);
    if (mario == null) {
      res.status(400).json({ message: "Cannot find Mario character" });
      return;
    }
    res.mario = mario;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = app;
