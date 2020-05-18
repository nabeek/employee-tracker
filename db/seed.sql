INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ("John", "Doe", 7, 3),
  ("Mike", "Chan", 8, 1),
  ("Ashley", "Rodriguez", 1, null),
  ("Kevin", "Tupik", 2, 3),
  ("Malia", "Brown", 4, null),
  ("Tom", "Allen", 6, 7),
  ("Sarah", "Lourd", 5, null),
  ("Christian", "Eckenrode", 1, 1);

INSERT INTO role
  (title, salary, department_id)
VALUES
  ("Lead Engineer", "150000", 1),
  ("Software Engineer", "120000", 1),
  ("Account Manager", "150000", 2),
  ("Accountant", "125000", 2),
  ("Legal Team Lead", "250000", 3),
  ("Lawyer", "190000", 3),
  ("Sales Lead", "100000", 4),
  ("Salesperson", "80000", 4);

INSERT INTO department
  (name)
VALUES
  ("Engineering"),
  ("Finance"),
  ("Legal"),
  ("Sales");