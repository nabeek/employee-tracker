# Employee Tracker

A Node CLI with SQL integration for tracking your (small business') employees.

## Motivation

This application continues to build on previous weeks' utilization of the Inquirer NPM package and employee management, but necessitates building and querying a SQL database for actual data management. The application, at minimum, allow the user to add departments, roles, employees; view departments, roles, employees; and update employee roles. There are many more features available in this current version.

## Installation and Usage

Clone or fork the repo from [GitHub](https://github.com/nabeek/employee-tracker), navigate to the directory, and then run `npm install`

Be sure to update the SQL connection settings in server.js, but feel free to use the included schema.sql and seed.sql files for testing purposes.

```js
const connection = mysql.createConnection({
  host: "",
  port: ,
  user: "",
  password: "",
  database: "employee_tracker_db",  // Associated db if using included db files
});
```

After installing, run the application with `node server.js` in terminal/bash. The application is completely command line-driven.

## Screenshot

![employee-tracker-screenshot](https://user-images.githubusercontent.com/4752937/82268960-77c1f780-992d-11ea-9b0c-28017c7fd026.png)

## Tech Used

[Node](https://nodejs.org/en/)\
[Inquirer](https://github.com/SBoudrias/Inquirer.js#readme)\
[MySQL](https://www.npmjs.com/package/mysql)\
[console.table](https://www.npmjs.com/package/console.table)

## Contributing

Feel free to open an issue to discuss any bugs or changes you would like to see.

## Roadmap

Currently working on querying payroll by department.

## License

MIT © [nabeek](https://github.com/nabeek)
