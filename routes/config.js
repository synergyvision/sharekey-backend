//var credentials = require('../keys.json');
var express = require("express");
var admin = require("firebase-admin");
var api = express.Router();

api.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    next();
  });

  var publicKey = process.env.server_public_key.replace(/\\n/g,'\n');
  var facebookId = process.env.facebook_id_app;

api.get('/serverKeys', function (req,res){
    //publickey = credentials.server_public_key;

    
    res.status(200).json({
        status:200,
        message: 'got server public key',
        publickey: publicKey
    })
    
})

api.post('/facebookId', function (req,res){
    var encoded = req.headers.authorization.split(' ')[1]
    admin.auth().verifyIdToken(encoded).then(function(decodedToken) {
        if (decodedToken.uid == uid){
            res.status(200).json({
                status:200,
                message: 'got app fb id',
                id: facebookId
            })
        }else{
            res.status(401).json({
                message: 'token missmatch'
            })
        }
    }).catch(function (error){
        res.status(401).json({
            status: error.code,
            message: error.message
        })
    })        
    
})

module.exports = api;