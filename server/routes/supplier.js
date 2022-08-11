const express = require('express');
const db = require('../models');
const supplier = require('../models/supplier');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', async (req, res, next) => {
    db.supplier.findAll().then(supplier => res.send(supplier)).catch((e) => {console.log(e)});
});

router.get('/recent', async (req, res, next) => {
  db.supplier.findAll({
    limit: 1,
    order: [['createdAt', 'DESC']]
  })
  .then(supplier => res.send(supplier))
  .catch((e) => {console.log(e)});
});

router.post("/", checkAuth, (req, res) => {
    db.supplier.create({
        supplier_name: req.body.supplier_name
    })
    .then(submittedSupplier => res.send(submittedSupplier))
    .catch((e) => {console.log(e)});
});

router.post('/findorcreate', checkAuth, async (req, res, next) => {
  db.supplier.findOrCreate({
    where: {
      supplier_name: req.body.supplier_name
    }
  })
  .then(submittedSupplier => res.send(submittedSupplier))
  .catch((e) => {console.log(e)});
});

router.delete("/:id", checkAuth, (req, res) => {
    db.supplier.destroy({
    where: {
        id: req.params.id
    }
  })
  .then(() => res.send("Deleted Successfully"))
  .catch((e) => {console.log(e)});
});

router.put("/", checkAuth, (req, res) => {
  db.supplier.update(
    {
      supplier_name: req.body.supplier_name
    },
    {
      where: { id: req.body.id }
    }
  )
  .then(() => res.send("Updated Successfully"))
  .catch((e) => {console.log(e)});
});

module.exports=router;