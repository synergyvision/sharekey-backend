var express = require("express");
var firebase= require("firebase");
var admin = require("firebase-admin");
var bodyParser = require("body-parser");

var api = express.Router();

api.use(bodyParser.urlencoded({ extended: false }));

api.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

api.get('/:userid/requests', function (req, res){
    uid = req.params.userid,
    firebase.auth().onAuthStateChanged(function (user){
        requests = []
        if (user) {
            admin.firestore().collection('Requests').where('id_to', '==', uid).get().then(function (snapshot){
                snapshot.forEach(doc => {
                    request = {
                        [doc.id] : doc.data()
                    }
                    requests.push(request);
                })
                res.status(200).json({
                    status: 200,
                    message: 'This are the users friends requests',
                    data: requests
                })
            }).catch(function (error){
                res.status(400).json({
                    status: error.code,
                    message: error.message
                })
            })
        }else {
            res.status(401).json({
                status: 'unauthorized',
                message: 'you need to log in to access content'
            })

        }
    })

})

api.post('/:userid/requests', function (req, res){
    uid = req.params.userid,
    firebase.auth().onAuthStateChanged(function (user){
        if (user){
            var requestData = {
                id_to: req.body.id_to,
                id_from: uid,
                status: false
            }
            request = admin.firestore().collection('Requests');
            request.add(requestData).then (function (){
                res.status(201).json({
                    status: 201,
                    message: 'The friend request has been sent'
                })
            
            }).catch(function (error){
                res.status(400).json({
                    status: error.code,
                    message: error.message
                })
            })
        }else{
            res.status(401).json({
                status: 'unauthorized',
                message: 'you need to log in to access content'
            })

        }

    })
})

api.put('/:userid/requests/:requestid', function (req,res){
    uid = req.params.userid,
    request_id = req.params.requestid
    firebase.auth().onAuthStateChanged(function (user){
        if (user){
            if (req.body.status == 'true'){
                newRequestData = {
                    status: true
                }
                var request = admin.firestore().collection('Requests').doc(request_id).update(newRequestData);
                request.then(function (){
                    console.log('actualice el request' + request_id)
                    admin.firestore().collection('Requests').doc(request_id).get().then(function (snapshot){
                        sender = snapshot.get('id_from');
                        var update = admin.firestore().collection('Users').doc(uid).collection('contacts').add({userId: sender, status: true})
                        update.then(function (){
                            var act = admin.firestore().collection('Users').doc(sender).collection('contacts').add({userId: uid,status: true})
                            act.then(function (){
                                console.log('User contacts updated');
                                res.status(200).json({
                                    status: 200,
                                    message: 'Contact request accepted'
                                })
                            }).catch(function(){
                                res.json({
                                    status: error.code,
                                    message: error.message
                                })
                            })
                        }).catch (function (error){
                            res.json({
                                status: error.code,
                                message: error.message  
                              })
                        })
                    }).catch(function (error){
                        res.json({
                            status: error.code,
                            message: error.message  
                          })
                    })
                }).catch(function (error){
                    res.json({
                      status: error.code,
                      message: error.message  
                    })
                })
            }else {
                admin.firestore().collection('Requests').doc(request_id).remove();
                res.json({
                    status: 200,
                    message: 'The request has been rejected'
                })
            }
        }else{
            res.status(401).json({
                status: 'unauthorized',
                message: 'you need to log in to access content'
            })
        }
    })

})

api.delete('/:userid', function (req,res){
    uid = req.params.userid
    id_user = req.body.user_id // the user to unfriend
    firebase.auth().onAuthStateChanged(function (user){
        if (user){
            admin.firestore().collection('Users').doc(uid).collection('contacts').where('userId', '==', id_user).get().then(function (snapshot){
            snapshot.forEach(doc => {
                docId = doc.id;
                admin.firestore().collection('Users').doc(uid).collection('contacts').doc(docId).delete();
                console.log('borreo el primero')
                admin.firestore().collection('Users').doc(id_user).collection('contacts').where('userId', '==', uid).get().then(function (snap){
                    snap.forEach( docs => {
                        id = docs.id;
                        admin.firestore().collection('Users').doc(id_user).collection('contacts').doc(id).delete();
                        res.status(200).json({
                            status: 200,
                            message: 'The user has been unfriended'
                        })
                    })
                }).catch (function (error){
                    res.status(400).json({
                        status: error.code,
                        message: error.message
                    })
                })
            })
           }).catch( function(error){
               res.status(400).json({
                   status: error.code,
                   message: error.message
               })
           })
        }else{
            res.json({
                status: 401,
                message: 'you need to log in to access this content'
            }) 
        }
    })     
})    

module.exports = api;