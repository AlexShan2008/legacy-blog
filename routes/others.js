let express = require('express');
let router = express.Router();

router.get(`/case/${fileName}`, function (req, res) {
    res.render(`/case/${fileName}`);
});



module.exports = router;
