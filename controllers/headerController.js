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
    makeJsonObject : function(body) {
        var header_db = {
            uid : mongoose.Types.ObjectId(),
            timestamp : Date.now(),
            owner : '3B',
            app : '3B',
            statut : 'current',
            user_id: '1'
        }

        var jsonArray = new Array();
        jsonArray['header_db'] = header_db;

        for (var value in body) {
            jsonArray[value] = body[value];
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
    }

}

