var inquirer = require("inquirer");

var baMGR = require("./bamazonManager");
var allProducts = require("./allProducts.js");


console.log("WELCOME TO BAMAZON!\nWE'VE GOT WHAT YOU NEED")

start();

function start() {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add New Product"],
            name: "userAction",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        })
        .then(function (answer) {

            switch (answer.userAction) {

                case "View Products for Sale":
                    allProducts.allProducts();
                    break;

                case "View Low Inventory":
                    baMGR.lowInventory();
                    break;
                    // return openPage(filePath, req, res)

                case "Add Inventory":
                    baMGR.addInventory();
                    break;
                    // return openPage(filePath, req, res)

                case "Add New Product":
                    baMGR.addNewProduct();
                    break;
                    // return openPage(filePath, req, res)

                default:
                    console.log("ERROR: Please one of the options in the menu to proceed.")
                    start();
            }


        });
}