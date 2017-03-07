var headerController = require('../controllers/headerController');
var self             = require('../controllers/crudController');
var mongoose         = require('mongoose');
var User             = require('../models/user');
var Belt             = require('jsbelt');

module.exports = {

    postObject : function(model, req, res) {
        var jsonObject = headerController.makeJsonObject(req, res);
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

    postObjectChild : function(model, childPath, req, res) {
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
            var arrayTemp = req.body;
            arrayTemp['uid'] = mongoose.Types.ObjectId();
            var fullArray = child.concat(arrayTemp);
            var object = Belt._set(object, childPath, fullArray);
            //create new object and change data
            var jsonObject = self.createJsonObject(model, object, req.body);
            var newObject = new model(object);
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

    getObjectChild : function(model, child, req, res) {
        var self = require('../controllers/crudController');
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
            var childValue = self.getProperty(object[0], child);
            if (childValue) {
                res.status(200);
                res.json(childValue);
            } else {
                res.status(404);
                res.json({ success: false, message: 'No sub-document found' });
            }            
        });
    },

    getObjectChildRow : function(model, childPath, req, res) {
        var self = require('../controllers/crudController');
        var uid = req.params.uid;
        var rowId = req.params.rowId;
        model.find({'header_db.uid' : uid, 'header_db.statut' : 'current'}).lean().exec(function(err, object) {
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
            var child = Belt._get(object[0], childPath);
            for (var key in child) {
                if(child[key].uid == rowId) {
                    var row = child[key];
                }
            }
            if (row) {
                res.status(200);
                res.json(row);
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
            var jsonObject = self.createJsonObjectForPut(model, object, req.body);
            var newObject = new model(jsonObject);
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

    putObjectFile : function(model, childPath, fileInfos, req, res) {
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
            if (Array.isArray(child)){
                child.push(fileInfos);
                var object = Belt._set(object, childPath, child);
            } else {
                var object = Belt._set(object, childPath, fileInfos);
            }
            //create new object and change data
            var jsonObject = self.createJsonObject(model, object, req.body);
            var newObject = new model(object);
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
            var jsonObject = self.createJsonObject(model, object, req.body);
            var newObject = new model(object);
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

    putObjectChildRow : function(model, childPath, req, res) {
        var uid = req.params.uid;
        var rowId = req.params.rowId;
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
            var newValues = child;
            for (var key in child) {
                if(!isNaN(key) && child[key].uid == rowId) {
                    for (var i in child[key]) {
                        if(req.body[i]) {
                            newValues[key][i] = req.body[i];
                        } 
                    }
                    break;
                }
            }
            var object = Belt._set(object, childPath, newValues);
            //create new object and change data
            var jsonObject = self.createJsonObject(model, object, req.body);
            var newObject = new model(object);
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

    putObjectFileCurrentUser : function(model, childPath, fileInfos, req, res, relationField) {
        var emetteurId = headerController.getUserIdFromToken(req, res);
        if (!emetteurId) {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }
        var self = require('../controllers/crudController');
        User.findOne({ 'header_db.uid': emetteurId , 'header_db.statut' : 'current' }, '-_id' ).lean().exec(function (err, user) {
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
                if (Array.isArray(child)){
                    child.push(fileInfos);
                    var object = Belt._set(object, childPath, child);
                } else {
                    var object = Belt._set(object, childPath, fileInfos);
                }
                //create new object and change data
                var jsonObject = self.createJsonObject(model, object, req.body);
                var newObject = new model(object);
                newObject.header_db.emetteur_id = emetteurId;
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

    putObjectChildCurrentUser : function(model, childPath, req, res, relationField) {
        var emetteurId = headerController.getUserIdFromToken(req, res);
        if (!emetteurId) {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }
        var self = require('../controllers/crudController');
        User.findOne({ 'header_db.uid': emetteurId , 'header_db.statut' : 'current' }, '-_id' ).lean().exec(function (err, user) {
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
                var jsonObject = self.createJsonObject(model, object, req.body);
                var newObject = new model(object);
                newObject.header_db.emetteur_id = emetteurId;
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

    deleteObject : function(model, req, res) {
        var uid = req.params.uid;
        model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' }, function (err, object) {
            if (err) {
                res.status(400);
                res.json({ success: false, message: err });
                return;
            }
            if(!object) {
                res.status(400);
                res.json({ success: false, message: 'Object not found'});
                return;   
            }
            // console.log(object);
            object = headerController.changeToDeleteStatut(object);
            object = headerController.updateTimeStamp(object);
            object = headerController.updateEmetteur(req,res, object);
            if(object) {
                object.save(function(err) {
                    if (err){
                        res.status(400);
                        res.json({ success: false, message: err });
                    }
                    res.status(200);
                    res.json({ success: true, message: 'Delete successful' });
                });    
            } else {
                res.status(400);
                res.json({ success: true, message: 'Delete failed' });
            }
            
            
        });         
    },

    deleteObjectChildRow : function(model, childPath, req, res) {
        var emetteurId = headerController.getUserIdFromToken(req, res);
        if (!emetteurId) {
            res.status(400);
            res.json({ success: false, message: 'Invalid token' });
            return;
        }

        var self = require('../controllers/crudController');
        var uid = req.params.uid;
        var rowId = req.params.rowId;

        model.find({'header_db.uid' : uid, 'header_db.statut' : 'current'}, '-_id' ).lean().exec( function(err, object) {
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
            var child = Belt._get(object[0], childPath);
            var newValues = new Array();
            for (var key in child) {
                if(!isNaN(key)) {
                    if(child[key].uid != rowId) {
                        newValues.push(child[key]);
                    }    
                }
            }
            var object = Belt._set(object[0], childPath, newValues);
            var jsonObject = self.createJsonObject(model, object, req.body);
            var newObject = new model(object);
            newObject.header_db.emetteur_id = emetteurId;
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
                            res.json({ success: true, message: 'Delete row successful' });
                        });
                    });
                });
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

    createJsonObject: function(schema, object, newDatas) {
        var jsonArray = new Array();
        for (var key in schema.schema.obj) {
            if(newDatas[key]){
                jsonArray[key] = newDatas[key];
            } else {
                jsonArray[key] = object[key];
            }    
        }
        var jsonObject = Object.assign({}, jsonArray);
        jsonObject['_id'] = mongoose.Types.ObjectId();
        return jsonObject;
    },

    createJsonObjectForPut: function(schema, object, newDatas) {
        var jsonArray = new Array();
        for (var key in schema.schema.obj) {
            if(newDatas[key]){
                if(!Array.isArray(newDatas[key])){
                    jsonArray[key] = newDatas[key];
                } else {
                    jsonArray[key] = object[key];    
                }
            } else {
                jsonArray[key] = object[key];
            }    
        }
        var jsonObject = Object.assign({}, jsonArray);
        jsonObject['_id'] = mongoose.Types.ObjectId();
        return jsonObject;
    }

}
