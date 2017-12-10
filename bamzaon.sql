DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price decimal(10, 2) NULL,
  stock int(100) null,
  PRIMARY KEY (id)
);

insert into products (product_name, department_name, price, stock)
values ("toy duck", "toys", 5.75, 10);

insert into products (product_name, department_name, price, stock)
values ("little pony", "toys", 25.75, 4);

insert into products (product_name, department_name, price, stock)
values ("pillow", "home", 21, 6);

insert into products (product_name, department_name, price, stock)
values ("silk sheets", "home", 55.75, 6);

insert into products (product_name, department_name, price, stock)
values ("lawn mower", "garden", 798.95, 2);

insert into products (product_name, department_name, price, stock)
values ("shovel", "garden", 15.75, 10);

insert into products (product_name, department_name, price, stock)
values ("lumber", "home", 4.56, 11);

insert into products (product_name, department_name, price, stock)
values ("plywood", "home", 22.95, 13);

insert into products (product_name, department_name, price, stock)
values ("bread", "grocery", 0.89, 20);

insert into products (product_name, department_name, price, stock)
values ("raisins", "grocery", 0.99, 15);
