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

let readEmployees;
let readRoles;
let readDepartments;

connection.connect(err => {
  if (err) throw err;

  connection.query("SELECT * FROM employee", function (error, res) {
    readEmployees = res.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  });

  connection.query("SELECT * FROM role", function (error, res) {
    readRoles = res.map(role => ({ name: role.title, value: role.id }));
  });

  connection.query("SELECT * FROM department", function (error, res) {
    readDepartments = res.map(department => ({
      name: department.name,
      value: department.id,
    }));
  });

  console.log(" ");
  console.log("Welcome to Employee Tracker");
  console.log(" ");
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
        "View All Roles",
        "View All Departments",
        "View Annual Payroll",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Remove Employee",
        "Remove Role",
        "Remove Department",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit",
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

        case "Remove Department":
          removeDept();
          break;

        case "Add Role":
          addRole();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "View Annual Payroll":
          viewPayroll();
          break;

        case "Exit":
          exitApp();
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

function viewAllEmployeesManager() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "manager",
          type: "list",
          message: "Which manager's employees would you like to view?",
          choices: readEmployees,
        },
      ])
      .then(answer => {
        connection.query(
          `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title FROM (employee, role) WHERE manager_id = ${answer.manager} AND employee.role_id = role.id`,
          function (err, res) {
            if (err) throw err;
            console.log(" ");

            if (res === undefined || res.length == 0) {
              console.log("This person is not a manager");
              console.log(" ");
            } else {
              console.table(res);
            }

            runTracker();
          }
        );
      });
  });
}

function viewAllEmployeesDepartment() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department",
          type: "list",
          message: "Which department would you like to view?",
          choices: readDepartments,
        },
      ])
      .then(answer => {
        let query =
          "SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title FROM employee ";
        query += `JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = ${answer.department}`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(" ");

          if (res === undefined || res.length == 0) {
            console.log("There are no employees in that department");
            console.log(" ");
          } else {
            console.table(res);
          }

          runTracker();
        });
      });
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
          choices: readRoles,
        },
        {
          name: "newEmpManager",
          type: "list",
          message: "Who will the new employee report to?",
          choices: readEmployees,
        },
      ])
      .then(answer => {
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.newEmpFirstName,
            last_name: answer.newEmpLastName,
            role_id: answer.newEmpRole,
            manager_id: answer.newEmpManager,
          },
          function (err, res) {
            if (err) throw err;
            console.log(" ");
            console.log(`${answer.newEmpFirstName} has been added`);
            console.log(" ");
            runTracker();
          }
        );
      });
  });
}

function removeEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt({
        name: "removedEmp",
        type: "list",
        message: "Which employee would you like to remove?",
        choices: readEmployees,
      })
      .then(answer => {
        connection.query(
          "DELETE FROM employee WHERE ?",
          { id: answer.removedEmp },
          function (err, res) {
            if (err) throw err;
            console.log(" ");
            console.log("An employee has been removed");
            console.log(" ");
            runTracker();
          }
        );
      });
  });
}

function updateEmployeeRole() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee's role would you like to reassign?",
          choices: readEmployees,
        },
        {
          name: "newRole",
          type: "list",
          message: "What will be their new role?",
          choices: readRoles,
        },
      ])
      .then(answer => {
        connection.query(
          "UPDATE employee SET ? WHERE ?",
          [{ role_id: answer.newRole }, { id: answer.employee }],
          function (err, res) {
            if (err) throw err;
            console.log(" ");
            console.log("An employee has been assigned a new role");
            console.log(" ");
            runTracker();
          }
        );
      });
  });
}

function updateEmployeeManager() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to reassign?",
          choices: readEmployees,
        },
        {
          name: "manager",
          type: "list",
          message: "Who will be their new manager?",
          choices: readEmployees,
        },
      ])
      .then(answer => {
        connection.query(
          "UPDATE employee SET ? WHERE ?",
          [{ manager_id: answer.manager }, { id: answer.employee }],
          function (err, res) {
            if (err) throw err;
            console.log(" ");
            console.log("An employee has been reassigned to a new manager");
            console.log(" ");
            runTracker();
          }
        );
      });
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
          choices: readDepartments,
        },
      ])
      .then(answer => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.newRoleTitle,
            salary: answer.newRoleSalary,
            department_id: answer.newRoleDept,
          },
          function (err, res) {
            if (err) throw err;
            console.log(" ");
            console.log(`${answer.newRoleTitle} has been added`);
            console.log(" ");
            runTracker();
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

function removeRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt({
        name: "removedRole",
        type: "list",
        message: "Which role would you like to remove?",
        choices: readRoles,
      })
      .then(answer => {
        connection.query(
          "DELETE FROM role WHERE ?",
          { id: answer.removedRole },
          function (err, res) {
            if (err) throw err;
            console.log(" ");
            console.log("A role has been removed");
            console.log(" ");
            runTracker();
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
          console.log(" ");
          console.log(`${answer.newDeptName} has been added`);
          console.log(" ");
          runTracker();
        }
      );
    });
}

function viewAllDepartments() {
  connection.query("SELECT name AS departments FROM department", function (
    err,
    res
  ) {
    if (err) throw err;
    console.log(" ");
    console.table(res);
    runTracker();
  });
}

function removeDept() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt({
        name: "removedDept",
        type: "list",
        message: "Which department would you like to remove?",
        choices: readDepartments,
      })
      .then(answer => {
        connection.query(
          "DELETE FROM department WHERE ?",
          { id: answer.removedDept },
          function (err, res) {
            if (err) throw err;
            console.log(" ");
            console.log("A department has been removed");
            console.log(" ");
            runTracker();
          }
        );
      });
  });
}

function viewPayroll() {
  let query =
    "SELECT SUM(role.salary) AS 'annual payroll' FROM (employee, role) WHERE employee.role_id = role.id";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log(" ");
    console.table(res);
    runTracker();
  });
}

// Exit function

function exitApp() {
  console.log(" ");
  console.log("Thank you for logging in");
  console.log(" ");
  process.exit();
}
