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

function readEmp() {
  let empArray = [];
  for (var i = 0; i < res.length; i++) {
    empArray.push(res[i].first_name + res[i].last_name);
  }
  return empArray;
}

function readRoles() {
  let roleArray = [];
  for (var i = 0; i < res.length; i++) {
    roleArray.push(res[i].title);
  }
  return roleArray;
}

function readDept() {
  connection.query("SELECT name FROM department", function (err, res) {
    if (err) throw err;

    function inner() {
      let deptArray = [];
      for (var i = 0; i < res.length; i++) {
        deptArray.push(res[i].name);
      }
      return deptArray;
    }
  });
}

module.exports = { readEmp, readRoles, readDept };
