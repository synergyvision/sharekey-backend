var express = require("express");
var admin = require("firebase-admin");
var firebase= require("firebase");
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");

var api = express.Router();

api.use(bodyParser.urlencoded({ extended: false }));

api.post("/", function (req, res){

    var db = admin.database();
    var au = firebase.auth();    

       au.signInWithEmailAndPassword(req.body.email, req.body.password).then ( (response) => {
            return res.json({
                status: 200,
                message: 'User has logged in'
            })
       }).
       catch(function(error) {
            var code = error.code;
            var message = error.message;
            return res.json({
                status: code,
                message: message
            })
      })

});

api.post("/sendEmail", function (req , res){

    var au = firebase.auth();   
    au.sendPasswordResetEmail(req.body.email).then(function(){
        res.json({
            status: 200,
            message: 'An email has been sent check your inbox'

        })
    }).catch(function (error){
        var code = error.code;
        var message = error.message;
        return res.json({
            status: code,
            message: message
        })
    });

});

api.post("/resetPassword" , function (req,res){
    var au = firebase.auth();
    var user = firebase.auth().currentUser;
    user.updatePassword(req.body.password).then(function(){
        res.json({
            status:200,
            message: 'the password has been update'
        })
    }).catch(function(error){
        var code = error.code;
        var message = error.message;
        return res.json({
            status: code,
            message: message
        })
    })

});

api.get("/activeUser", function (req,res) {
    var au = firebase.auth();
    au.onAuthStateChanged(function(user) {
        if (user) {
          res.json({
              user: user.email,
              uid: user.uid
          })
        } else {
          res.json({
              message: 'no user is logged in'
          })
        }
      });

})

module.exports = api;