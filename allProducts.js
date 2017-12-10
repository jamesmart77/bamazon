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
    allProducts: function () {
        connection.connect(function (err) {
            if (err) throw err;

            //sql for all products
            let productAllQuery = "SELECT * FROM products";

            //query DB and once results returned call print fx
            mySqlQuery(productAllQuery, function (result) {
                console.log("callback successful");
                printProducts(result)
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

    inquirer
        .prompt({
            name: "nextSteps",
            type: "list",
            choices: ["Yes", "No"],
            message: "Would you like to make a purchase?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        })
        .then(function (answer) {
            if (answer.nextSteps === "Yes") {
                getProductID();
            }
        });

}

function getProductID() {

    inquirer
        .prompt({
            name: "productID",
            type: "input",
            message: "Please enter the Product ID you wish to purchase...",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        })
        .then(function (answer) {
            getProductQty(answer.productID);
        });
}

function getProductQty(productID) {

    //let queryStatement = "SELECT product_name, stock FROM products WHERE id='" + productID + "'";

    // mySqlQuery(queryStatement, function (results) {
    //     console.log("callback successful!\n" + results);


    inquirer
        .prompt({
            name: "productQty",
            type: "input",
            message: "How many of Product#" + productID + " would you like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        })
        .then(function (answer) {
            let queryStatement = "SELECT stock, price, product_name FROM products WHERE id = '" + productID + "'"
            mySqlQuery(queryStatement, function (results) {
                //console.log(results[0].stock + "\n" + answe);
                if (results[0].stock < answer.productQty) {
                    console.log("============================");
                    console.log("INSUFFICIENT STOCK to complete this order.\nCurrent stock volume is " + results[0].stock + ".\nTry again please.");
                    console.log("============================");
                } else {

                    updateAfterPurchase(answer.productQty, results[0].stock, productID, results[0].price, results[0].product_name);

                }
            });

        });
}

function updateAfterPurchase(purchasedAmt, currentStock, productID, price, product_name) {
    let newQty = currentStock - purchasedAmt;

    let queryStatement = "UPDATE products SET stock = '" + newQty + "' WHERE id = '" + productID + "'";
    mySqlQuery(queryStatement, function (results) {
        if (results.serverStatus === 2) {

            let total = purchasedAmt * price;

            console.log("PRODUCT INVENTORY UPDATED SUCCESSFULLY");
            console.log("\n============================");
            console.log(product_name.toUpperCase() + " ORDER COMPLETE");
            console.log("INVOICE TOTAL: $" + total.toFixed(2));
            console.log("Pay within 30 days or we'll come take your " + product_name);
            console.log("\n============================");
            connection.end();


        } else {
            console.log("ERROR OCCURRED");
            console.log("A processing error occurred while updating the inventory...please try again.");

        }

    });
}