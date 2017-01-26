var headerController = require('../controllers/headerController');
var mongoose         = require('mongoose');

module.exports = {
    
    postObject : function(model, req, res) {
        var jsonObject = headerController.makeJsonObject(req);
        if(jsonObject.success == false) {
            res.json({ success: false, message: jsonObject.message });
            return;
        }
        model.collection.insert(jsonObject,function(err) {
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
            }
            if (object.length > 1) {
                res.status(400);
                res.json({ success: false, message: 'One object expected to find, but many was found' });   
            }
            res.status(200);
            res.json(object);
        });
    },

    getObjectSubDoc : function(model, subDoc, req, res) {
        var uid = req.params.uid;
        model.find({'header_db.uid' : uid, 'header_db.statut' : 'current'}, function(err, object) {
            if (err){
                res.status(404);
                res.json({ success: false, message: err });
            }
            if (object.length > 1) {
                res.status(400);
                res.json({ success: false, message: 'One object expected to find, but many was found' });   
            }
            if (object[subDoc]) {
                res.status(200);
                res.json(object[subDoc]);    
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
                object = headerController.changeToCurrentStatut(object);
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
                }
                object = headerController.changeToCurrentStatut(object);
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
            object.save(function(err) {
                if (err){
                    res.status(400);
                    res.json({ success: false, message: err });
                }
                res.status(200);
                res.json({ success: true, message: 'Delete successful' });
            });
        });         
    }



   
}