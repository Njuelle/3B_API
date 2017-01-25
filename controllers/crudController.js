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
                res.json({ success: false, message: err });
            }
            res.json({ success: true, id: jsonObject.header_db.uid });
        });
    },

    getAllObjects : function(model, req, res) {
        model.find({'header_db.statut' : 'current'}, function(err, objects) {
            if (err){
                res.send(err);
            }
            res.json(objects);
        });
    },

    getObjectById : function(model, req, res) {
        var uid = req.params.uid;
        model.find({'header_db.uid' : uid, 'header_db.statut' : 'current'}, function(err, object) {
            if (err){
                res.json({ success: false, message: err });
            }
            if (object.length > 1) {
                res.json({ success: false, message: 'One object expected to find, but many was found' });   
            }
            res.json(object);
        });
    },

    putObject : function(model, req, res) {
        var uid = req.params.uid;
        model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' }, function (err, object) {
            if (err  || !object) {
                res.json({ success: false, message: err });
                return;
            }
            object = headerController.changeToOldStatut(object);
            object.save(function(err) {
                if (err){
                    res.json({ success: false, message: err });
                }
                object = headerController.changeToCurrentStatut(object);
                object._id = mongoose.Types.ObjectId();

                for (var field in req.body) {
                    object[field] = req.body[field];
                }
                
                model.collection.insert(object, function(err) {
                    if (err){
                        res.json({ success: false, message: err });
                    }
                    res.json({ success: true, message: 'Modifications successful' });
                });
            });
        });     
    },

    deleteObject : function(model, req, res) {
        var uid = req.params.uid;
        model.findOne({ 'header_db.uid': uid , 'header_db.statut' : 'current' }, function (err, object) {
            if (err  || !object) {
                res.json({ success: false, message: err });
                return;
            }
            object = headerController.changeToDeleteStatut(object);
            object.save(function(err) {
                if (err){
                    res.json({ success: false, message: err });
                }
                res.json({ success: true, message: 'Delete successful' });
            });
        });         
    }



   
}