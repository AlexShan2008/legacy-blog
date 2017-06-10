let express = require('express');
let router = express.Router();
let User=require('../model').User;
let utils =require('./utils');
//当客户端访问呢/user/signup路径的时候
router.get('/signup',function (req,res) {
    res.render('user/signup',{title:"用户注册"})
});
//提交表单
router.post('/signup',function (req,res) {
    let user=req.body;
    user.password =utils.md5(user.password);//16进制
    User.create(user,function (err,doc) {
       if(err){
           res.redirect('back');//如果报错，就返回上一级，返回注册页面继续填写；
       } else{
           res.redirect('/user/signin');//跳转登录页面；
       }
    });
});
//当客户端访问/user/signin路径
router.get('/signin',function (req,res) {
    res.render('user/signin',{title:"用户登录"})
});

//用户登录
router.post('/signin',function (req,res) {
    let user =req.body;
    user.password =utils.md5(user.password);//16进制
    User.findOne(user,function (err,doc) {
        if(err){
            res.redirect('back');
        }else{
            if(doc){
                req.flash("success","登录成功");
                req.session.user=doc;//把当前登录成功后的session对象中
                // req.session.success="登录成功"; //消息不会取消。用于显示
                res.redirect('/')

            }else{
            //   失败
                req.flash("error","登录失败");
                // req.session.success="登录失败";
                res.redirect('back');

            }
        }
    })
});
//当客户端访问/user/signout路径
router.get('/signout',function (req,res) {
    res.send('退出登录')
});

module.exports = router;
