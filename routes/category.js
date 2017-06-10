let express = require('express');
let router = express.Router();
router.get('/add',function (req,res) {
    res.send('增加分类功能')
});
module.exports = router;