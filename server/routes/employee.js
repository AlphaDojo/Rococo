const express = require('express');
const db = require('../models');
const employee = require('../models/employee');
const router = express.Router();

router.get('/', async (req, res, next) => {
    db.employee.findAll().then(employee => res.send(employee)).catch((e) => {console.log(e)});
});

router.post("/", (req, res) => {
    db.employee.create({
        emp_fname: req.body.emp_fname,
        emp_lname: req.body.emp_lname
    })
    .then(submittedEmployee => res.send(submittedEmployee))
    .catch((e) => {console.log(e)});
  });

router.delete("/:id", (req, res) => {
    db.employee.destroy({
    where: {
        id: req.params.id
    }
    })
    .then(() => res.send("Deleted Successfully"))
    .catch((e) => {console.log(e)});
});

router.put("/", (req, res) => {
    db.employee.update(
      {
        emp_fname: req.body.emp_fname,
        emp_lname: req.body.emp_lname
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(() => res.send("Updated Successfully"))
    .catch((e) => {console.log(e)});
});

module.exports=router;