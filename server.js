// Configuration
const dotenv = require("dotenv");
dotenv.config();

// Required Packages
const express = require("express");
const mongoose = require("mongoose");

// App Initialization
const app = express();
app.use(express.urlencoded({ extended: false }));

// Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Imports
const Fruit = require("./models/fruits.js")

// Routes
app.get("/", async (req, res) =>{
    res.render("index.ejs")
});

app.get("/fruits/new", (req, res) =>{
    res.render("fruits/new.ejs")
});

app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect("/fruits");
});

app.get("/fruits", async (req, res) =>{
    //  Get all the fruits from the database.
    const allFruits = await Fruit.find();
    
    // Render the page that shows all the fruits.
    res.render("fruits/index.ejs", { fruits: allFruits });
});

// Listen
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
