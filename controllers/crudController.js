var headerController = require('../controllers/headerController');
var userController   = require('../controllers/userController');
var self             = require('../controllers/crudController');
var mongoose         = require('mongoose');
var User             = require('../models/user');
var Belt             = require('jsbelt');

module.exports = {
    postObject : function(model, req, res) {
        var jsonObject = headerController.makeJsonObject(req);
        if(jsonObject.success == false) {
            res.json({ success: false, message: jsonObject.message });
            return;
        }
        var object = new model(jsonObject);
        object.save(function(err) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
            }
            res.status(201);
            res.json({ success: true, id: jsonObject.header_db.uid });
        });
    },

    getAllObjects : function(model, req, res) {
        model.find({'header_db.statut' : 'current'}, function(err, objects) {
            if (err){
                res.status(400);
                res.json({ success: false, message: err });
            }
            res.status(200);
            res.json(objects);
        });
    },

    getObjectById : function(model, req, res) {
        var uid = req.params.uid;
        model.find({'header_db.uid' : uid, 'header_db.statut' : 'current'}, function(err, object) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
                return;
            }
            if(!object || object.length == 0) {
                res.status(404);
                res.json({ success: false, message: 'Object not found' });   
                return;
            }
            if (object.length > 1) {
                res.status(400);
                res.json({ success: false, message: 'One object expected, but many was found' });   
                return;
            }
            res.status(200);
            res.json(object[0]);
        });
    },

    getObjectSubDoc : function(model, subDoc, req, res) {
        var uid = req.params.uid;
        model.find({'header_db.uid' : uid, 'header_db.statut' : 'current'}, function(err, object) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
            }
            if(!object || object.length == 0) {
                res.status(404);
                res.json({ success: false, message: 'Object not found' });   
                return;
            }
            if (object.length > 1) {
                res.status(400);
                res.json({ success: false, message: 'One object expected, but many was found' });   
            }
            if (object[0][subDoc]) {
                res.status(200);
                res.json(object[0][subDoc]);    
            } else {
                res.status(404);
                res.json({ success: false, message: 'No sub-document found' });
            }            
        });
    },

    getObjectChild : function(model, child, req, res) {
        var uid = req.params.uid;
        model.find({'header_db.uid' : uid, 'header_db.statut' : 'current'}, function(err, object) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
            }
            if (object.length > 1) {
                res.status(400);
                res.json({ success: false, message: 'One object expected, but many was found' });   
            }
            if(!object || object.length == 0) {
                res.status(404);
                res.json({ success: false, message: 'Object not found' });   
                return;
            }
            var child = self.getProperty(object[0], child);
            if (child) {
                res.status(200);
                res.json(child);
            } else {
                res.status(404);
                res.json({ success: false, message: 'No sub-document found' });
            }            
        });
    },

    putObject : function(model, req, res) {
        var uid = req.params.uid;
        var self = require('../controllers/crudController');
        //find the object to update without _id
        model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' }, '-_id' ).lean().exec(function (err, object) {
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
            var jsonObject = self.createJsonObject(object, req.body);
            var newObject = new model(jsonObject);
            //update emeteur ID and timestamp
            var emeteurId = headerController.getUserIdFromToken(req, res);
            if (!emeteurId) {
                res.status(400);
                res.json({ success: false, message: 'Invalid token' });
                return;
            }
            newObject.header_db.emeteur_id = emeteurId;
            newObject = headerController.updateTimeStamp(newObject);
            //validate the new object
            newObject.validate(function(err) {
                if (err) {
                    // console.log(newObject);
                    res.status(400);
                    res.json({ success: false, message: err });
                    return;       
                }

                model.collection.insert(newObject, function(err){
                    if (err) {
                        res.status(400);
                        res.json({ success: false, message: err });
                        return;       
                    }
                    // new object has been added to DB,
                    // now change statut to old object :
                    // first : need to find again the old object...
                    model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' },function (err, object) {
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

    putObjectChild : function(model, childPath, req, res) {
        var uid = req.params.uid;
        var self = require('../controllers/crudController');
        //find the object to update without _id
        model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' }, '-_id' ).lean().exec(function (err, object) {
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
            var child = Belt._get(object, childPath);
            for (var key in child) {
                if(req.body[key]){
                    child[key] = req.body[key];
                }
            }
            var object = Belt._set(object, childPath, child);
            //create new object and change data
            var jsonObject = self.createJsonObject(object, req.body);
            var newObject = new model(object);
            var emeteurId = headerController.getUserIdFromToken(req, res);
            if (!emeteurId) {
                res.status(400);
                res.json({ success: false, message: 'Invalid token' });
                return;
            }
            newObject.header_db.emeteur_id = emeteurId;
            newObject = headerController.updateTimeStamp(newObject);
            //validate the new object
            newObject.validate(function(err) {
                if (err) {
                    res.status(400);
                    res.json({ success: false, message: err });
                    return;       
                }

                model.collection.insert(newObject, function(err){
                    if (err) {
                        res.status(400);
                        res.json({ success: false, message: err });
                        return;       
                    }
                    // new object has been added to DB,
                    // now change statut to old object :
                    // first : need to find again the old object...
                    model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' },function (err, object) {
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

    putObjectChildCurrentUser : function(model, childPath, req, res, relationField) {
        var emeteurId = headerController.getUserIdFromToken(req, res);
        if (!emeteurId) {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }
        var self = require('../controllers/crudController');
        User.findOne({ 'header_db.uid': emeteurId , 'header_db.statut' : 'current' }, '-_id' ).lean().exec(function (err, user) {
            var relationId = Belt._get(user, relationField);
            //find the object to update without _id
            model.findOne({ 'header_db.uid': relationId , 'header_db.statut' : 'current' }, '-_id' ).lean().exec(function (err, object) {
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
                var child = Belt._get(object, childPath);
                for (var key in child) {
                    if(req.body[key]){
                        child[key] = req.body[key];
                    }
                }
                var object = Belt._set(object, childPath, child);
                //create new object and change data
                var jsonObject = self.createJsonObject(object, req.body);
                var newObject = new model(object);
                newObject.header_db.emeteur_id = emeteurId;
                newObject = headerController.updateTimeStamp(newObject);
                //validate the new object
                newObject.validate(function(err) {
                    if (err) {
                        res.status(400);
                        res.json({ success: false, message: err });
                        return;       
                    }

                    model.collection.insert(newObject, function(err){
                        if (err) {
                            res.status(400);
                            res.json({ success: false, message: err });
                            return;       
                        }
                        // new object has been added to DB,
                        // now change statut to old object :
                        // first : need to find again the old object...
                        model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' },function (err, object) {
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
        });
    },

    putObjectSubDoc : function(model, subDoc, req, res) {
        var uid = req.params.uid;
        model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' }, function (err, object) {
            if (err  || !object) {
                res.status(400);
                res.json({ success: false, message: err });
                return;
            }
            object = headerController.changeToOldStatut(object);
            object.save(function(err) {
                if (err){
                    res.status(400);
                    res.json({ success: false, message: err });
                    return;
                }
                object = headerController.changeToCurrentStatut(object);
                object = headerController.updateTimeStamp(object);
                object._id = mongoose.Types.ObjectId();
                    
                for (var field in req.body) {
                    object[subDoc][field] = req.body[field];
                }
                
                model.collection.insert(object, function(err) {
                    if (err){
                        res.status(400);
                        res.json({ success: false, message: err });
                    }
                    res.status(202);
                    res.json({ success: true, message: 'Modifications successful' });
                });
            });
        });     
    },

    deleteObject : function(model, req, res) {
        var uid = req.params.uid;
        model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' }, function (err, object) {
            if (err  || !object) {
                res.status(400);
                res.json({ success: false, message: err });
                return;
            }
            object = headerController.changeToDeleteStatut(object);
            object = headerController.updateTimeStamp(object);
            object.save(function(err) {
                if (err){
                    res.status(400);
                    res.json({ success: false, message: err });
                }
                res.status(200);
                res.json({ success: true, message: 'Delete successful' });
            });
        });         
    },

    getProperty : function(object, path) {
        var props = path.split(".");
        var obj = object;
        for (var i = 0; i < props.length; i++) {
            obj = obj[props[i]];
        }
        return obj;
    },

    createJsonObject: function(object, newDatas) {
        var jsonArray = new Array();
        for (var key in object) {
            if(newDatas[key]){
                jsonArray[key] = newDatas[key];
            } else {
                jsonArray[key] = object[key];
            }
        }
        var jsonObject = Object.assign({}, jsonArray);
        jsonObject['_id'] = mongoose.Types.ObjectId();
        return jsonObject;
    }

}
