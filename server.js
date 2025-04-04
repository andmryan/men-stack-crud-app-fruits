// Configuration
const dotenv = require("dotenv");
dotenv.config();

// Required Packages
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

// Express
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Imports
const Fruit = require("./models/fruits.js")

// Routing below
app.get("/", async (req, res) =>{
    res.render("index.ejs")
});

// Fruit Addition Form Route
app.get("/fruits/new", (req, res) =>{
    res.render("fruits/new.ejs")
});

// Fruit Edit Form Route
app.get("/fruits/:fruitId/edit", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    // console.log(foundFruit);
    res.render("fruits/edit.ejs", { fruit : foundFruit });
});

// Fruit Show Route
app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    //     res.send(
    //         `This route renders the show page for fruit id: ${req.params.fruitId}!`
    //     );
    // console.log(foundFruit);
    res.render("fruits/show.ejs", { fruit : foundFruit });
});

// Fruit Delete Route
app.delete("/fruits/:fruitId", async (req, res) => {
    // res.send("This is the delete route");
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
});

// Fruit Edit Post Route
app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    
    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
});

// Fruit Creation Route
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect("/fruits");
});

// Index Route
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
