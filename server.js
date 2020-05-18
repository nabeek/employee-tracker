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

// Employee-specific functions

function viewAllEmployees() {
  let query =
    "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name,' ',m.last_name) AS manager ";
  query +=
    "FROM (employee e, role, department) LEFT JOIN employee m ON e.manager_id = m.id ";
  query += "WHERE e.role_id = role.id AND role.department_id = department.id";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(" ");
    console.table(res);
    runTracker();
  });
}

function addEmployee() {
  connection.query("SELECT title FROM role", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "newEmpFirstName",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "newEmpLastName",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "newEmpRole",
          type: "list",
          message: "Which role does the new employee have?",
          choices: function () {
            let roleArray = [];
            for (var i = 0; i < res.length; i++) {
              roleArray.push(res[i].title);
            }
            return roleArray;
          },
        },
      ])
      .then(answer => {
        connection.query(
          "SELECT id FROM role WHERE ?",
          { name: answer.newEmpRole },
          function (err, res) {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.newEmpFirstName,
                last_name: answer.newEmpLastName,
                role_id: res[0].id,
                // manager_id: ,
              },
              function (err, res) {
                if (err) throw err;
                console.log(`${answer.newEmpFirstName} has been added`);
                console.log(" ");
                runTracker();
              }
            );
          }
        );
      });
  });
}

// Department-specific functions

function addDepartment() {
  inquirer
    .prompt({
      name: "newDeptName",
      type: "input",
      message: "What department would you like to add?",
    })
    .then(answer => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.newDeptName,
        },
        function (err, res) {
          if (err) throw err;
          console.log(`${answer.newDeptName} has been added`);
          console.log(" ");
          runTracker();
        }
      );
    });
}

function viewAllDepartments() {
  const deptQuery = "SELECT name AS department FROM department";

  connection.query(deptQuery, function (err, res) {
    if (err) throw err;
    console.log(" ");
    console.table(res);
    runTracker();
  });
}

// Role-specific functions

function addRole() {
  connection.query("SELECT name FROM department", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "newRoleTitle",
          type: "input",
          message: "What role would you like to add?",
        },
        {
          name: "newRoleSalary",
          type: "input",
          message: "What salary should the role carry?",
        },
        {
          name: "newRoleDept",
          type: "list",
          message: "Which department should the role fall under?",
          choices: function () {
            var deptArray = [];
            for (var i = 0; i < res.length; i++) {
              deptArray.push(res[i].name);
            }
            return deptArray;
          },
        },
      ])
      .then(answer => {
        connection.query(
          "SELECT id FROM department WHERE ?",
          { name: answer.newRoleDept },
          function (err, res) {
            connection.query(
              "INSERT INTO role SET ?",
              {
                title: answer.newRoleTitle,
                salary: answer.newRoleSalary,
                department_id: res[0].id,
              },
              function (err, res) {
                if (err) throw err;
                console.log(`${answer.newRoleTitle} has been added`);
                console.log(" ");
                runTracker();
              }
            );
          }
        );
      });
  });
}

function viewAllRoles() {
  let query =
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role, department WHERE role.department_id = department.id";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(" ");
    console.table(res);
    runTracker();
  });
}
