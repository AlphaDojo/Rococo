const express = require('express');
const db = require('../models');
const inventory = require('../models/inventory');
const item = require('../models/item')
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', async (req, res, next) => {
    db.inventory.findAll().then(inventory => res.send(inventory)).catch((e) => {console.log(e)});
});

router.get('/recent', async (req, res, next) => {
  db.inventory.findAll({
    limit: 1,
    order: [['createdAt', 'DESC']]
  }).then(inventory => res.send(inventory));
});

router.post("/", checkAuth, (req, res) => {
    db.inventory.create({
        inv_quantity: req.body.inv_quantity,
        inv_availability: req.body.inv_availability
    })
    .then(submittedInventory => res.send(submittedInventory))
    .catch((e) => {console.log(e)});
  });

router.delete("/:id", checkAuth, (req, res) => {
    db.inventory.destroy({
    where: {
        id: req.params.id
    }
    })
    .then(() => res.send("Deleted Successfully"))
    .catch((e) => {console.log(e)});
});

router.put("/", checkAuth, (req, res) => {
    db.inventory.update(
      {
        inv_quantity: req.body.inv_quantity,
        inv_availability: req.body.inv_availability
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(() => res.send("Updated Successfully"))
    .catch((e) => {console.log(e)});
});

router.put("/availability", checkAuth, (req, res) => {
  db.inventory.update(
    {
      inv_availability: req.body.inv_availability
    },
    {
      where: { id: req.body.id }
    }
  )
  .then(() => res.send("Updated Successfully"))
  .catch((e) => {console.log(e)});
});

router.put("/increment", checkAuth, (req, res) => {
  db.inventory.increment(
    {inv_quantity:1},
    {where: { id: req.body.id }}
  )
  .then(() => res.send("Updated Successfully"))
  .catch((e) => {console.log(e)});
});

router.put("/decrement", checkAuth, (req, res) => {
  db.inventory.decrement(
    {inv_quantity:1},
    {where: { id: req.body.id }}
  )
  .then(() => res.send("Updated Successfully"))
  .catch((e) => {console.log(e)});
});

module.exports=router;