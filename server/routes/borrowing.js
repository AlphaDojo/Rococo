const express = require('express');
const db = require('../models');
const borrowing = require('../models/borrowing');
const router = express.Router();
const { Op } = require("sequelize");
const checkAuth = require('../middleware/check-auth');

router.get('/', async (req, res, next) => {
    db.borrowing.findAll().then(borrowing => res.send(borrowing)).catch((e) => {console.log(e)});
});

router.get('/main', async (req, res, next) => {
  db.borrowing.findAll({
    include: [
      {
        model: db.user,
        as: "userDetails",
        required: false
      },
      {
        model: db.employee,
        as: "employeeDetails",
        required: false
      },
      {
        model: db.item,
        as: "itemDetails",
        required: false
      }
    ],
    where: {
      borrow_status: {
        [Op.notLike]: '%archived%'
      }
    }
  })
  .then(borrowing => res.send(borrowing))
  .catch((e) => {console.log(e)});
});

router.get('/pending', async (req, res, next) => {
  db.borrowing.findAll({
    include: [
      {
        model: db.user,
        as: "userDetails",
        required: false
      },
      {
        model: db.employee,
        as: "employeeDetails",
        required: false
      },
      {
        model: db.item,
        as: "itemDetails",
        required: false
      }
    ],
    where: {
      borrow_status: {
        [Op.like]: '%pending%'
      }
    }
  })
  .then(borrowing => res.send(borrowing))
  .catch((e) => {console.log(e)});
});

router.get('/archived', async (req, res, next) => {
  db.borrowing.findAll({
    include: [
      {
        model: db.user,
        as: "userDetails",
        required: false
      },
      {
        model: db.employee,
        as: "employeeDetails",
        required: false
      },
      {
        model: db.item,
        as: "itemDetails",
        required: false
      }
    ],
    where: {
      borrow_status: {
        [Op.like]: '%archived%'
      }
    }
  })
  .then(borrowing => res.send(borrowing))
  .catch((e) => {console.log(e)});
});

router.post("/", checkAuth, (req, res) => {
  db.borrowing.create({
      borrow_date: req.body.borrow_date,
      return_date: req.body.return_date,
      borrow_status: req.body.borrow_status,
      employeeId: req.body.employeeId,
      itemId: req.body.itemId,
      userId: req.body.userId
  }).then(submittedBorrowing => res.send(submittedBorrowing));
});

router.delete("/:id", checkAuth, (req, res) => {
    db.borrowing.destroy({
    where: {
        id: req.params.id
    }
    })
    .then(() => res.send("Deleted Successfully"))
    .catch((e) => {console.log(e)});
});

router.delete("/item/:itemId", checkAuth, (req, res) => {
  db.borrowing.destroy({
  where: {
      itemId: req.params.itemId
  }
  })
  .then(() => res.send("Deleted Successfully"))
  .catch((e) => {console.log(e)});
});

router.put("/", checkAuth, (req, res) => {
    db.borrowing.update(
      {
        borrow_date: req.body.borrow_date,
        return_date: req.body.return_date,
        borrow_status: req.body.borrow_status,
        employeeId: req.body.employeeId,
        itemId: req.body.itemId,
        userId: req.body.userId
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(() => res.send("Updated Successfully"))
    .catch((e) => {console.log(e)});
});

router.put("/", checkAuth, (req, res) => {
  db.borrowing.update(
    {
      borrow_date: req.body.borrow_date,
      return_date: req.body.return_date,
      itemId: req.body.itemId,
      userId: req.body.userId
    },
    {
      where: { id: req.body.id }
    }
  )
  .then(() => res.send("Updated Successfully"))
  .catch((e) => {console.log(e)});
});

router.put("/availability", checkAuth, (req, res) => {
  db.borrowing.update(
    {
      borrow_status: req.body.borrow_status
    },
    {
      where: { id: req.body.id }
    }
  )
  .then(() => res.send("Updated Successfully"))
  .catch((e) => {console.log(e)});
});
module.exports=router;