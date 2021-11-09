const inquirer = require('inquirer');
const mysql = require('mysql');
const figlet = require("figlet");

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'absurdFancyTrain656!',
    database: 'employeeDB'
  },
  console.log(`Connected to the employee database.`)
);

connection.connect((err) => {
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
      switch(response.menu) {
        case "View all departments":
        viewAllDepartments()
        break;
        case "View all employees":
          viewAllEmployees()
        break;
        case "View all roles":
          viewAllRoles()
        break;
        case "Add a department":
          //addADepartment()
        break;
        case "Add a role":
          addARole()
        break;
        case "Add an employee":
          //addAnEmployee()
        break;
        case "Update an employee role":
          //updateEmployee()
          break;
      }
    });

    const viewAllDepartments = () => {
      connection.query("SELECT * FROM department", (err, results) => {
        if (err) {
          console.log(err)
        }
        console.table(results)
        init();
      })
    }

    const viewAllEmployees = () => {
      connection.query("SELECT * FROM employee", (err, results) => {
        if (err) {
          console.log(err)
        }
        console.table(results)
        init();
      })
    }
   const viewAllRoles = () => {
      connection.query("SELECT * FROM roles", (err, results) => {
        if (err) {
          console.log(err)
        }
        console.table(results)
        init();
      })
    }
 

    const addARole = (x) => {
      let departments = connection.query("SELECT * FROM department")
      inquirer
        .prompt([
          {
            name: 'title',
            message: 'What is the title of the new role',
            type: 'input',
          },
          {
            name: 'salary',
            message: 'What is the salary of the new role',
            type: 'input',
          },
          {
            name: 'department_id',
            message: 'What is the department ID of the new role',
            type: 'list',
            choices: departments((departmentId) => {
              return {
                name: departmentId.department_name,
                value: departmentId.id
              }
            }),
            message: 'What deparment ID does this role belong to?',
          },
        ])
        .then(
          connection.query(
            'INSERT INTO roles SET ?',
            { title: x.title },
            { salary: x.salary },
            { department_id: x.departmentId},
            (err, results) => {
              if (err) {
                console.log(err);
              }
              console.table(results);
              init();
            }
          )
        );}


      // find all employees
      // update role 
};

