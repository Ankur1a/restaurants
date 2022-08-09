const path = require("path");                           //To define absolute path that works in every interface. Ex : path.join()
const fs = require("fs");                               //To read & write json file. Example : fs.readFile
const uuid = require("uuid");                           //To create random unique ids for restaurants. Ex : uuid.v4()

const express = require("express");                     //To setup express

const defaultPage = require("./views/defaultFile");
const restaurantPage = require("./views/restaurantFile");

const app = express();

app.set("views", path.join(__dirname, "views"));        //To set the folder name & folder path where we wanna implement engine like EJS
app.set("view engine", "ejs");                          //It should be written as it is if we wanna setup the EJS engine

app.use(express.static("public"));                      //To read static files like styling css files for every incoming request
app.use(express.urlencoded({extended: false}));         //To fetch all the data when a form is submitted. EX : req.body

app.use("/", defaultPage);
app.use("/", restaurantPage);

app.get("/confirm", function(req, res) {
    res.render("confirm");
});

app.get("/recommend", function(req, res) {
    res.render("recommend");
});

app.post("/recommend", function(req, res) {
    const restaurant = req.body;
    restaurant.id = uuid.v4();
    const filePath = path.join(__dirname, "data", "restaurants.json");
    const fileData = fs.readFileSync(filePath);
    const storedRestaurant = JSON.parse(fileData);
    storedRestaurant.push(restaurant);
    fs.writeFileSync(filePath, JSON.stringify(storedRestaurant));

    res.redirect("/confirm");

});

app.use(function(req, res) {                            //If there is any kind of grammatical error in url then we will show "pageNotFound" page
    res.render("pageNotFound");
});

app.use(function(error, req, res, next) {               //If there is any kind of interal server error then we will show "500" page
    res.render("500");
});

app.listen(3000);