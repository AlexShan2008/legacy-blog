let express = require('express');
let router = express.Router();
//客户端访问/article/add路径
router.get('/add',function (req,res) {
    res.send('发表文章')
});


module.exports = router;