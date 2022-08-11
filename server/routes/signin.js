const express = require('express');
const db = require('../models');
const signin = require('../models/signin');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
            return res.status(500).json({
                error: err
            });
        }
        else{
            db.signin.findOrCreate({
                where:{
                    username: req.body.username
                },
                defaults:{
                    password: hash
                }
            })
            .then(result => {
                console.log(result)
                if(result[1] == false){
                    return res.status(409).json({
                        message: 'Username exists'
                    })
                }
                else{
                    return res.status(201).json({
                        message: 'User created'
                    })
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: err
                });
            });
        }
    });
})

router.post('/login', async (req, res, next) => {
    db.signin.findOne({
      where: { 
        username: {
            [Op.eq]: req.body.username
        }
      }
    })
    .then(login => {
        if(login == null){//If username doesn't exist, it fails
            return res.status(401).json({
                message: "Auth fails"
            })
        }
        bcrypt.compare(req.body.password, login.password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: "Auth fails"
                })
            }
            if(result){
                const accessToken = jwt.sign(
                    {
                      username: login.username,
                      id: login.id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                  );
                res.cookie('token', accessToken, { httpOnly: true });
                return res.status(200).json({
                    message: 'Auth successful',
                    accessToken: accessToken
                })
            }
            return res.status(401).json({//If password is wrong, it fails
                message: "Auth fails"
            })
        })
    })
    .catch((e) => {console.log(e)});
});

router.delete("/:id", (req, res) => {
    db.signin.destroy({
    where: {
        id: req.params.id
    }
  })
  .then(() => res.send("Deleted Successfully"))
  .catch((e) => {console.log(e)});
});

module.exports=router;