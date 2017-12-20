let express = require('express');
let router = express.Router();
//客户端访问/article/add路径
router.get('/list',function (req,res) {
    // res.send('发表文章')
    res.render('article/list',{title:'Latest Stories'})
});

router.get('/post',function (req,res) {
    // res.send('发表文章')
    res.render('article/post',{title:'Latest Stories'})
});

module.exports = router;