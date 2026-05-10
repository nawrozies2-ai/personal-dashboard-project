const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// SIMPLE LOGGING MIDDLEWARE
app.use((req, res, next) => {

    console.log(`${req.method} request to ${req.url}`);

    next();
});


// SERVE FRONTEND FILES
app.use(express.static(path.join(__dirname)));


// SAMPLE DATABASE
let items = [
    {
        id: 1,
        text: "Finish project",
        completed: false
    },
    {
        id: 2,
        text: "Deploy app",
        completed: true
    }
];


// GET ROUTE
app.get("/api/items", (req, res) => {

    res.json(items);
});


// POST ROUTE
app.post("/api/items", (req, res) => {

    const newItem = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };

    items.push(newItem);

    res.status(201).json(newItem);
});


// START SERVER
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});