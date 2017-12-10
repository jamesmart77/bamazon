var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

module.exports = {
    lowInventory: function () {
        connection.connect(function (err) {
            if (err) throw err;

            //sql for all products
            let productAllQuery = "SELECT * FROM products WHERE stock < '5'";

            //query DB and once results returned call print fx
            mySqlQuery(productAllQuery, function (result) {
                console.log("\n\nLOW INVENTORY LOG");
                printProducts(result);

            });
        });

    },
    addInventory: function () {
        connection.connect(function (err) {
            if (err) throw err;

            //sql for all products
            let productQuery = "SELECT id, product_name, stock FROM products";

            //query DB and once results returned call print fx
            mySqlQuery(productQuery, function (result) {
                var choiceArr = [];
                //console.log(result);

                result.forEach(element => {
                    //iterate through key/value pairs per array index
                    let productInfo = element.id + ":" + element.product_name.toUpperCase() + ": " + element.stock + " in stock";

                    choiceArr.push(productInfo);

                });

                console.log("\n\nPRODUCT LIST");
                inquirer
                    .prompt({
                        name: "productChoice",
                        type: "list",
                        choices: choiceArr,
                        message: "What product would you like to stock up on?"
                    })
                    .then(function (answer) {
                        let productArr = answer.productChoice.split(":")

                        let productID = productArr[0];
                        let productName = productArr[1];
                        let productStock = productArr[2].slice(1, productArr[2].length - 9)

                        inquirer
                            .prompt({
                                name: "productQty",
                                type: "input",
                                message: "How many units of " + productName + " do you wish to add to the product inventory?",
                                validate: function (value) {
                                    if (isNaN(value) === false) {
                                        return true;
                                    }
                                    return false;
                                }
                            })
                            .then(function (answer) {
                                //sql for all products
                                let newQty = parseInt(productStock.trim()) + parseInt(answer.productQty);

                                let queryStatement = "UPDATE products SET stock = '" + newQty + "' WHERE id = '" + productID + "'";

                                //query DB and once results returned call print fx
                                mySqlQuery(queryStatement, function (result) {
                                    if (result.serverStatus === 2) {
                                        console.log("=============================");
                                        console.log("INVENTORY UPDATES SUCCESSFUL");
                                        console.log("Product: " + productName + " -- Current Inventory: " + newQty)
                                        console.log("=============================");
                                    }
                                    connection.end();
                                });
                            });
                    });

            });
        });

    },
    addNewProduct: function () {
        connection.connect(function (err) {
            if (err) throw err;

            console.log("\n\nNEW PRODUCT ENTRY\nPlease provide the following information...");

            addNewProduct(function (response) {

                let productName = response[0];
                let productDept = response[1];
                let productPrice = response[2];
                let productStock = response[3];

                let newProductQuery = "insert into products (product_name, department_name, price, stock) VALUES ('" + productName + "','" + productDept + "','" + productPrice + "','" + productStock + "')";

                //query DB and once results returned call print fx
                mySqlQuery(newProductQuery, function (result) {
                    if (result.serverStatus === 2) {
                        console.log("=============================");
                        console.log("NEW PRODUCT ENTRY SUCCESSFUL");
                        console.log("Product: " + productName + " -- Current Inventory: " + productStock)
                        console.log("=============================");
                    }
                    connection.end();
                });
            });
        });
    }
}

function mySqlQuery(queryStatement, callback) {
    //query passed statement
    connection.query(queryStatement, function (err, result) {

        if (err) {
            throw err
        }
        //results acquired, send to callback
        callback(result);
    });
}

function printProducts(result) {
    //iterate thru array of results
    result.forEach(element => {
        //console.log(element.RowDataPacket.song)
        console.log("============================");
        //iterate through key/value pairs per array index
        for (var key in element) {
            if (element.hasOwnProperty(key)) {
                //add $ for PRICE key for readability
                if (key.toUpperCase() === "PRICE") {
                    console.log(key.toUpperCase() + ": $" + element[key]);
                } else {
                    console.log(key.toUpperCase() + ": " + element[key]);
                }

            }
        }
        console.log("============================");
    });
    connection.end();
}

function addNewProduct(callback) {
    var productArr = []

    inquirer
        .prompt({
            name: "userInput",
            type: "input",
            message: "What's the PRODUCT NAME?"
        })
        .then(function (answer) {

            //Next Question ==========================
            productArr.push(answer.userInput);

            inquirer
                .prompt({
                    name: "userInput",
                    type: "input",
                    message: "What's the PRODUCT DEPARTMENT?"
                })
                .then(function (answer) {

                    //Next Question ==========================
                    productArr.push(answer.userInput);

                    inquirer
                        .prompt({
                            name: "userInput",
                            type: "input",
                            message: "What's the PRODUCT PRICE?"
                        })
                        .then(function (answer) {

                            //Next Question ==========================
                            productArr.push(answer.userInput);

                            inquirer
                                .prompt({
                                    name: "userInput",
                                    type: "input",
                                    message: "How many units do you want to add to inventory?"
                                })
                                .then(function (answer) {

                                    productArr.push(answer.userInput);

                                    callback(productArr);
                                });
                        });
                });
        });
}