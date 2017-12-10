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

connection.connect(function (err) {
    if (err) throw err;
    //print connection id
    console.log("connected as id " + connection.threadId + "\n");

    //sql for all products
    let productAllQuery = "SELECT * FROM products";

    //query DB and once results returned call print fx
    mySqlQuery(productAllQuery, function (result) {
        console.log("callback successful");
        printProducts(result);
    });
});

function mySqlQuery(queryStatement, callback) {
    //query passed statement
    connection.query(queryStatement, function (err, result) {

        if (err) {
            throw err
        }
        //results acquired, send to callback
        //console.log(result);
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

    getProductID();
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
            let queryStatement = "SELECT stock, price FROM products WHERE id = '" + productID + "'"
            mySqlQuery(queryStatement, function (results) {
                //console.log(results[0].stock + "\n" + answe);
                if(results[0].stock < answer.productQty){
                    console.log("============================");
                    console.log("INSUFFICIENT STOCK to complete this order.\nCurrent stock volume is " + results[0].stock + ".\nTry again please.");
                    console.log("============================");
                } else {
                    var total = results[0].price * answer.productQty;
                    console.log("============================");
                    console.log("ORDER COMPLETE");
                    console.log("INVOICE TOTAL: $" + total);
                    console.log("============================");
                }
            });
            
        });
    //});
}