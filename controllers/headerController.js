var header  = require('../models/header');
var mongoose = require('mongoose');
var jwt      = require('jsonwebtoken');
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
        var header_db = {
            uid         : uid,
            timestamp   : Date.now(),
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

    getUserIdFromToken : function(req,res){
        try {
            var verifiedToken = jwt.verify(req.headers['x-access-token'], 'secret');
            return verifiedToken._doc.header_db.uid;
        } catch(err) {
            return false;
        }
    },


}

