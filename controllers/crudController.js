var headerController = require('../controllers/headerController');
var self             = require('../controllers/crudController');
var mongoose         = require('mongoose');

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
                }
                if (req.headers['owner']) {
                    object = headerController.changeOwner(object, req.headers['owner']);
                } else {
                    res.status(400);
                    res.json({ success: false, message: 'no owner provided' });
                      return ;
                }
                console.log('object: ' + object);
                object = headerController.changeToCurrentStatut(object);
                object = headerController.updateTimeStamp(object);
                object._id = mongoose.Types.ObjectId();
                    
                for (var field in req.body) {
                    object[field] = req.body[field]; 
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
                if (req.headers['owner']) {
                    object = headerController.changeOwner(object, req.headers['owner']);
                } else {
                    res.status(400);
                    res.json({ success: false, message: 'no owner provided' });
                    return ;
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
            if (req.headers['owner']) {
                object = headerController.changeOwner(object, req.headers['owner']);
            } else {
                res.status(400);
                res.json({ success: false, message: 'no owner provided' });
                return ;
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
    }



   
}