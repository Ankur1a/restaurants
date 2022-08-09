const path = require("path");                           //To define absolute path that works in every interface. Ex : path.join()
const fs = require("fs");                               //To read & write json file. Example : fs.readFile

const express = require("express");

const router = express.Router();

router.get("/restaurants", function(req, res) {
    const filePath = path.join(__dirname, "..", "data", "restaurants.json");
    const fileData = fs.readFileSync(filePath);
    const storedRestaurant = JSON.parse(fileData);

    let order = req.query.order;
    let changeOrder = "desc";
    
    if(order != "asc" && order != "desc") {
        order = "asc";
    };

    if(order === "desc") {
        changeOrder = "asc";
    };

    storedRestaurant.sort(function(resA, resB) {
        if((order === "asc" && resA.name > resB.name) || (order === "desc" && resA.name < resB.name)) {
            return 1;
        } else {
            return -1;
        }
    });

    res.render("restaurants", {numberOfRestaurants: storedRestaurant.length, restaurant: storedRestaurant, nextOrder: changeOrder});

});

router.get("/restaurants/:rid", function(req, res){
    const restaurantId = req.params.rid;

    const filePath = path.join(__dirname, "..", "data", "restaurants.json");
    const fileData = fs.readFileSync(filePath);
    const storedRestaurant = JSON.parse(fileData);

    for(const restaurantData of storedRestaurant) {
        if(restaurantData.id === restaurantId) {
            return res.render("restaurants-detail", {particularRestaurant: restaurantData});
        }
    }

    return res.render("404");                           //If restaurant id doesnot exist then we will show "404" page
});

module.exports = router;