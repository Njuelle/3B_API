module.exports = {
    
    postTest : function(req, res) {
        res.json({ message: 'this is POST test route 1' });
    },

    getTest : function(req, res) {
        res.json({ message: 'this is GET test route 1' });
    },

    putTest : function(req, res) {
        res.json({ message: 'this is PUT test route 1' });
    },

    deleteTest : function(req, res) {
        res.json({ message: 'this is DELETE test route 1' });
    },

    postTest2 : function(req, res) {
        res.json({ message: 'this is POST test route 2' });
    },

    getTest2 : function(req, res) {
        res.json({ message: 'this is GET test route 2' });
    },

    putTest2 : function(req, res) {
        res.json({ message: 'this is PUT test route 2' });
    },

    deleteTest2 : function(req, res) {
        res.json({ message: 'this is DELETE test route 2' });
    },
}

