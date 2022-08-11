const express = require('express');
const db = require('../models');
const user = require('../models/user');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', async (req, res, next) => {
    db.user.findAll().then(user => res.send(user)).catch((e) => {console.log(e)});
});

router.post("/", (req, res) => {
    db.user.create({
        usr_fname: req.body.usr_fname,
        usr_lname: req.body.usr_lname
    })
    .then(submittedUser => res.send(submittedUser))
    .catch((e) => {console.log(e)});
  });

router.post('/findorcreate', checkAuth, async (req, res, next) => {
  db.user.findOrCreate({
    where: {
      usr_fname: req.body.usr_fname,
        usr_lname: req.body.usr_lname
    }
  })
  .then(submittedUser => res.send(submittedUser))
  .catch((e) => {console.log(e)});
});

router.delete("/:id", checkAuth, (req, res) => {
    db.user.destroy({
    where: {
        id: req.params.id
    }
    })
    .then(() => res.send("Deleted Successfully"))
    .catch((e) => {console.log(e)});
});

router.put("/", checkAuth, (req, res) => {
    db.user.update(
      {
        usr_fname: req.body.usr_fname,
        usr_lname: req.body.usr_lname
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(() => res.send("Updated Successfully"))
    .catch((e) => {console.log(e)});
});

module.exports=router;