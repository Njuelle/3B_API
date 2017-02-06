var header = require('../models/header');
var mongoose = require('mongoose');

module.exports = {

    /**
     * Take req.body json and return a jsonObject 
     * with all header fields (only for post request)
     * 
     * @param  req.body Request.body
     * @return Json
     */
    makeJsonObject : function(req) {
        var uid = mongoose.Types.ObjectId();
        if (req.headers['owner']) {
            var ownerName = req.headers['owner'];
        } else {
            var err = { success: false, message: 'no owner provided' };
            return err;
        }
        var header_db = {
            uid         : uid,
            timestamp   : Date.now(),
            owner       : ownerName,
            app         : '3B',
            statut      : 'current',
            emetteur_id : '1'
        }

        var jsonArray = new Array();
        jsonArray['header_db'] = header_db;

        for (var value in req.body) {
            jsonArray[value] =req.body[value];
        }
        var json = Object.assign({}, jsonArray);
        return json;
    },

    getUid : function(object) {
        return object.header_db.uid;
    },

    getUidFromRequest : function(req) {
        return req.body.header_db.uid;
    },

    changeToDeleteStatut : function(object){
        object.header_db.statut = "delete";
        return object;
    },

    changeToOldStatut : function(object){
        object.header_db.statut = "old";
        return object;
    },

    changeToCurrentStatut : function(object){
        object.header_db.statut = "current";
        return object;
    },

    updateTimeStamp : function(object){
        object.header_db.timestamp = Date.now();
        return object;
    },

    changeOwner : function(object, owner) {
        object.header_db.owner = owner;
        return object;
    }


}

