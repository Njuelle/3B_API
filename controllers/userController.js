// Load required packages
var User             = require('../models/user');
var headerController = require('../controllers/headerController');
var crudController   = require('../controllers/crudController');
var bcrypt           = require('bcrypt-nodejs');
var mongoose         = require('mongoose');
var jwt              = require('jsonwebtoken');

module.exports = {
    
    postUser : function(req, res) {
        var self = require('../controllers/userController');
        //first, hash password
        if (req.body.password){
            req.body.password = self.hashPassword(req.body.password);
        }
        // create user from json object with db header        
        var jsonObject = headerController.makeJsonObject(req, res);
        var user = new User(jsonObject);
        user.save(function(err) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
            }
            res.status(201);
            res.json({ success: true, id: jsonObject.header_db.uid });
        });
    },
    
    getUserById : function(req, res) {
        crudController.getObjectById(User, req, res);
    },

    getUser : function(req, res) {
        crudController.getAllObjects(User, req, res);
    },

    getCurrentUser : function(req, res) {
        var self = require('../controllers/userController');
        var userId = self.getUserIdFromToken(req);
        if (userId) {
            User.findOne({'header_db.uid' : userId, 'header_db.statut' : 'current'}, function(err, user) {
                if (err){
                    res.status(404);
                    res.json({ success: false, message: err });
                }
                user.password = undefined;
                res.status(200);
                res.json(user);
                return;
            });    
        } else {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }
    },

    putUser : function(req, res) {
        crudController.putObject(User, req, res);
    },


    putUserCurrentUser : function(model, req, res) {
        var emetteurId = headerController.getUserIdFromToken(req, res);
        if (!emetteurId) {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }
        var self = require('../controllers/crudController');
        //find the object to update without _id
        User.findOne({ 'header_db.uid': emetteur_id , 'header_db.statut' : 'current' }, '-_id' ).lean().exec(function (err, object) {
            if (err) {
                res.status(400);
                res.json({ success: false, message: err });
                return;
            }
            if (!object) {
                res.status(404);
                res.json({ success: false, message: 'Object not found' });
                return;
            }
            //create new object and change data
            var jsonObject = self.createJsonObject(User, object, req.body);
            var newObject = new User(jsonObject);
            //update emeteur ID and timestamp
            var emetteurId = headerController.getUserIdFromToken(req, res);
            if (!emetteurId) {
                res.status(400);
                res.json({ success: false, message: 'Invalid token' });
                return;
            }
            newObject.header_db.emetteur_id = emetteurId;
            newObject = headerController.updateTimeStamp(newObject);
            //validate the new object
            newObject.validate(function(err) {
                if (err) {
                    // console.log(newObject);
                    res.status(400);
                    res.json({ success: false, message: err });
                    return;       
                }

                User.collection.insert(newObject, function(err){
                    if (err) {
                        res.status(400);
                        res.json({ success: false, message: err });
                        return;       
                    }
                    // new object has been added to DB,
                    // now change statut to old object :
                    // first : need to find again the old object...
                    User.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' },function (err, object) {
                        if (err) {
                            res.status(400);
                            res.json({ success: false, message: err });
                            return;
                        }
                        if (!object) {
                            res.status(404);
                            res.json({ success: false, message: 'Object not found' });
                            return;
                        }
                        object = headerController.changeToOldStatut(object);
                        //finnaly save old object
                        object.save(function(err) {
                            if (err){
                                res.status(400);
                                res.json({ success: false, message: err });
                                return;
                            }
                            res.status(202);
                            res.json({ success: true, message: 'Modifications successful' });
                        });
                    });
                });
            });
        });     
    },

    deleteUser : function(req, res) {
        crudController.deleteObject(User, req, res);
    },

    postProfil : function(req,res) {
        crudController.postObjectChild(Profil, 'profils', req, res);
    },

    getProfil : function(req,res) {
        crudController.getObjectChildRow(Profil, 'profils', req, res);
    },

    deleteProfil : function(req,res) {
        crudController.deleteObjectChildRow(Profil, 'profils', req, res);
    },

    putProfil : function(req,res) {
        crudController.putObjectChildRow(Profil, 'profils', req, res);
    },

    hashPassword : function(password) {
        return bcrypt.hashSync(password);
    },

    getUserIdFromToken : function(req) {
        if (!req.headers['x-access-token']){
            return false;
        }
        try {
            var verifiedToken = jwt.verify(req.headers['x-access-token'], 'secret');   
        }
        catch (e) {
           return false;
        }
        return verifiedToken._doc.header_db.uid;
    }
}

