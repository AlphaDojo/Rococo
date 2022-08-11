const express = require('express');
const db = require('../models');
const returns = require('../models/returns');
const router = express.Router();
const { Op } = require("sequelize");
const checkAuth = require('../middleware/check-auth');

router.get('/', async (req, res, next) => {
    db.returns.findAll().then(returns => res.send(returns)).catch((e) => {console.log(e)});
});

router.get('/main', async (req, res, next) => {
  db.returns.findAll({
    include: [
      {
        model: db.borrowing,
        as: "borrowingDetails",
        required: false,
        include: [{
          model: db.item,
          as: "itemDetails",
          required: false
        },
        {
          model: db.user, 
          as:"userDetails", 
          required: false
        }
        ]
      }
    ],
    where: {
      return_status: {
        [Op.notLike]: '%archived%'
      }
    }
  })
  .then(borrowing => res.send(borrowing))
  .catch((e) => {console.log(e)});
});

router.get('/archived', async (req, res, next) => {
  db.returns.findAll({
    include: [
      {
        model: db.borrowing,
        as: "borrowingDetails",
        required: false,
        include: [{
          model: db.item,
          as: "itemDetails",
          required: false
        },
        {
          model: db.user, 
          as:"userDetails", 
          required: false
        }]
      }
    ],
    where: {
      return_status: {
        [Op.like]: '%archived%'
      }
    }
  })
  .then(borrowing => res.send(borrowing))
  .catch((e) => {console.log(e)});
});

router.post("/", checkAuth, (req, res) => {
    db.returns.create({
      return_date_real: req.body.return_date_real,
      return_dmgstatus: req.body.return_dmgstatus,
      return_status: req.body.return_status,
      borrowingId: req.body.borrowingId
    })
    .then(submittedReturns => res.send(submittedReturns))
    .catch((e) => {console.log(e)});
  });

router.delete("/:id", checkAuth, (req, res) => {
    db.returns.destroy({
    where: {
        id: req.params.id
    }
    })
    .then(() => res.send("Deleted Successfully"))
    .catch((e) => {console.log(e)});
});

router.put("/", checkAuth, (req, res) => {
    db.returns.update(
      {
        return_date_real: req.body.return_date_real,
        return_dmgstatus: req.body.return_dmgstatus,
        return_status: req.body.return_status,
        borrowingId: req.body.borrowingId
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(() => res.send("Updated Successfully"))
    .catch((e) => {console.log(e)});
});

router.put("/availability", checkAuth, (req, res) => {
    db.returns.update(
      {
        return_status: req.body.return_status
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(() => res.send("Updated Successfully"))
    .catch((e) => {console.log(e)});
});

module.exports=router;