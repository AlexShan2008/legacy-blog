let express = require('express');
let router = express.Router();
router.get('/list',function (req,res) {
    // res.send('增加分类功能')
    res.render('category/list',{title:'增加分类功能'})
});
module.exports = router;