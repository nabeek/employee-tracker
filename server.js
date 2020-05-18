const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_tracker_db",
});

connection.connect(err => {
  if (err) throw err;
  runTracker();
});

function runTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Add Department",
        "View All Departments",
        "Add Role",
        "View All Roles",
      ],
    })
    .then(answer => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Employees by Department":
          viewAllEmployeesDepartment();
          break;

        case "View All Employees by Manager":
          viewAllEmployeesManager();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Update Employee Manager":
          updateEmployeeManager();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "Add Role":
          addRole();
          break;

        case "View All Roles":
          viewAllRoles();
          break;
      }
    });
}

function viewAllDepartments() {
  let query = "SELECT department.name FROM department";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(" ");
    console.table(res);
    runTracker();
  });
}

function viewAllRoles() {
  let query = "SELECT role.title FROM role";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(" ");
    console.table(res);
    runTracker();
  });
}
