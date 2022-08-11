const express = require('express');
const db = require('../models');
const item = require('../models/item');
const inventory = require('../models/inventory');
const { sequelize } = require('../models');
const router = express.Router();
const { Op } = require("sequelize");
const checkAuth = require('../middleware/check-auth');

router.get('/', async (req, res, next) => {
    db.item.findAll().then(item => res.send(item)).catch((e) => {console.log(e)});
});

router.get('/find', async (req, res, next) => {
  db.item.findOne({
    where: { 
      item_name: req.body.item_name
    }
  })
  .then(item => res.send(item))
  .catch((e) => {console.log(e)});
});

router.get('/finditem', async (req, res, next) => {
  db.item.findAll({
    include:[{
      model: db.supplier,
      as: "supplierDetails",
      required: false
    }],
    where: {
        item_name: req.body.item_name,
        supplierId: req.body.supplierId
    }
  })
  .then(item => res.send(item))
  .catch((e) => {console.log(e)});
});

router.post('/findorcreate', async (req, res, next) => {
  db.item.findOrCreate({
    where: {
      item_name: req.body.item_name
    }
  })
  .then(item => res.send(item))
  .catch((e) => {console.log(e)});
});

router.get('/archived', async (req, res, next) => {
  db.item.findAll({
    include: [
      {
        model: db.inventory,
        as: "inventoryDetails",
        required: true,
        where: {
          inv_availability: {
            [Op.like]: '%archived%'
          }
        }
      },
      {
        model: db.supplier,
        as: "supplierDetails",
        required: false
      }
    ]
  })
  .then(item => res.send(item))
  .catch((e) => {console.log(e)});
});

router.get('/main', async (req, res, next) => {
  db.item.findAll({
    include: [
      {
        model: db.inventory,
        as: "inventoryDetails",
        required: true,
        where: {
          inv_availability: {
            [Op.notLike]: '%archived%'
          }
        }
      },
      {
        model: db.supplier,
        as: "supplierDetails",
        required: false
      }
    ]
  })
  .then(item => res.send(item))
  .catch((e) => {console.log(e)});
});

router.get('/available', async (req, res, next) => {
  db.item.findAll({
    include: [
      {
        model: db.inventory,
        as: "inventoryDetails",
        required: true,
        where: {
          inv_quantity: {
            [Op.gt]: 0
          }
        }
      },
      {
        model: db.supplier,
        as: "supplierDetails",
        required: false
      }
    ]
  })
  .then(item => res.send(item))
  .catch((e) => {console.log(e)});
});

router.post("/", checkAuth, (req, res) => {
    db.item.create({
        item_name: req.body.item_name,
        item_description: req.body.item_description,
        inventoryId: req.body.inventoryId,
        supplierId: req.body.supplierId
    }).then(submittedItem => res.send(submittedItem));
  });

router.post("/create", checkAuth, (req, res) => {
  db.item.findOrCreate({
    where: {
      item_name: req.body.item_name,
      supplierId: req.body.supplierId
    },
    defaults:{
      item_description: req.body.item_description,
      inventoryId: req.body.inventoryId
    }
  }).then(submittedItem => res.send(submittedItem));
});

router.delete("/:id", checkAuth, (req, res) => {
    db.item.destroy({
    where: {
        id: req.params.id
    }
    })
    .then(() => res.send("Deleted Successfully"))
    .catch((e) => {console.log(e)});
});

router.put("/", checkAuth, (req, res) => {
    db.item.update(
      {
        item_name: req.body.item_name,
        item_description: req.body.item_description,
        inventoryId: req.body.inventoryId,
        supplierId: req.body.supplierId
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(() => res.send("Updated Successfully"))
    .catch((e) => {console.log(e)});
});

module.exports=router;