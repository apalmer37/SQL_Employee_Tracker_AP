const express = require('express');
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const figlet = require("figlet");

const PORT = process.env.PORT || 3004;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'Password37$',
    database: 'movies_db'
  },
  console.log(`Connected to the movies_db database.`)
);

db.connect((err) => {
  if (err) {
    console.log(err);
  }
  startPrompt();
});

const startPrompt = () => {
  figlet.text("Welcome to my employee directory", {
    font: "Slant",
    horizontalLayout: 'default',
    verticalLayout: "default",
    width: 150,
    whitespaceBreak: true
  }, (err, data) => {
    if (err) {
      console.log("Something went wrong...")
    }
    console.log(data);
    init();
  })
};

// view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

const init = () => {
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role"
    ]
  })
    .then(response => {
      switch(response) {
        case "View all departments":
        //viewAllDepartments()
        break;
        case "View all roles":
          //viewAllRoles()
        break;
        case "View all employees":
        break;
        case "Add a department":
        break;
        case "Add a role":
        break;
        case "Add an employee":
        break;
        case "Update an employee role":
          break;
      }
    });

    const viewAllDepartments = () => {
      
    }







};

