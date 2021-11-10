const inquirer = require("inquirer");
const mysql = require("mysql");
const figlet = require("figlet");

// Connect to database
const connection = mysql.createConnection(
  {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "absurdFancyTrain656!",
    database: "employeeDB",
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
  figlet.text(
    "Welcome to my employee directory",
    {
      font: "Slant",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 150,
      whitespaceBreak: true,
    },
    (err, data) => {
      if (err) {
        console.log("Something went wrong...");
      }
      console.log(data);
      init();
    }
  );
};

const init = () => {
  inquirer
    .prompt({
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
        "Update an employee role",
      ],
    })
    .then((response) => {
      switch (response.menu) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "Add a department":
          addADepartment();
          break;
        case "Add a role":
          addARole();
          break;
        case "Add an employee":
          addAnEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
      }
    });
};

const viewAllDepartments = () => {
  connection.query("SELECT * FROM departments", (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    init();
  });
};

const viewAllEmployees = () => {
  connection.query("SELECT * FROM employees", (err, results) => {
    if (err) {
      console.log(err);
    }
    console.table(results);
    init();
  });
};
const viewAllRoles = () => {
  connection.query("SELECT * FROM roles", (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
};

const addARole = () => {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role?",
        },
        {
          name: "departmentName",
          type: "list",
          choices: function () {
            return results.map((result) => result.department_name);
          },
          message: "Select the Department for this new Title:",
        },
      ])
      .then((answer) => {
        connection.query("INSERT INTO roles SET ?", {
          title: answer.title,
          salary: answer.salary,
          department_id: results.find(
            (result) => result.department_name === answer.departmentName
          ).id,
        });
        console.log(`\n ${answer.title} role added! \n`);
        init();
      });
  });
};

const addADepartment = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the department",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.name,
        },
        (err) => {
          if (err) throw err;
          console.log(`\n ${answer.name} department added! \n`);
          init();
        }
      );
    });
};

const addAnEmployee = () => {
  const query =
    "SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Name,roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employees e INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.manager_id";

  connection.query(query, (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the employees first name?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the employees last name?",
          name: "lastName",
        },
        {
          type: "list",
          message: "What is the role of the employee?",
          name: "role",
          choices: function () {
            return results.map((result) => result.Title);
          },
        },
        {
          type: "list",
          message: "Who is the employee's manager?",
          name: "manager",
          choices: function () {
            return results.map((result) => result.Name);
          },
        },
      ])
      .then((answers) => {
        let roleId = 0;
        let managerId = 0;

        connection.query("SELECT * FROM roles", (err, results) => {
          if (err) throw err;

          console.log(results);

          results.forEach((result) => {
            if (answers.role === result.title) {
              roleId = result.id;
            }

            connection.query("SELECT * FROM employees", (err, results) => {
              if (err) throw err;
              results.forEach((result) => {
                if (answers.manager === result.Name) {
                  managerId = result.id;
                }
              });
            });
          });
        });

        connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: roleId,
            manager_id: managerId,
          },
          (err) => {
            if (err) throw err;
            console.log(`${answers.firstName} ${answers.lastName} added!`);
          }
        );
      });
  });
};

const updateEmployeeRole = () => {
  const query =
    "SELECT e.id, m.id AS managerID, roles.id AS RoleID, CONCAT(e.first_name, ' ', e.last_name) AS Name,roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employees e INNER JOIN roles ON e.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON e.manager_id = m.id ORDER BY departments.department_name;";

  connection.query(query, function (err, results) {
    console.log(results);

    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: function () {
            return results.map((result) => result.Name);
          },
        },
        {
          type: "list",
          name: "roleTitle",
          message: "What is the employee's new role?",
          choices: function () {
            return results.map((result) => result.Title);
          },
        },
      ])
      .then((answers) => {
        connection.query(
          "SELECT id FROM roles WHERE ?",
          {
            title: answers.roleTitle,
          },
          (err, results) => {

            console.log(results);
            if (err) throw err;

            connection.query(
              "UPDATE employees SET ? WHERE ? ",
              [
                {
                  role_id: results[0].id,
                },
                {
                  first_name: answers.name.split(" ")[0],
                },
              ],
              function (err) {
                if (err) throw err;
                console.log(`${answers.name}'s role has been updated!'`);
              }
            );
          }
        );
      });
  });
};
