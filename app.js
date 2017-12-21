let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let session = require('express-session');
let flash = require('connect-flash');//消息提示模块，提示后就消失了。
let MongoStore = require('connect-mongo')(session);
let app = express();
let config = require("./config");

//使用bodyParser中间件
app.use(bodyParser.urlencoded({extended: true}));
//把会话数据保存在数据库中；

//设置模板引擎
app.set('view engine', 'html');
//设置模板的存放目录
app.set('views', path.resolve('client/container'));

//如果模板后缀是HTML的话，使用EJS模板引擎的方法来进行渲染
app.engine('html', require('ejs').__express);
//使用会话中间件；
app.use(session({
    secret: 'shan',
    resave: true,
    saveUninitialized: true,//保存未初始化的session，
    store: new MongoStore({
        url: config.dbUrl
    })
}));
//req.flash
app.use(flash());//必须放在session和模板赋值的中间；
app.use(function (req, res, next) {
    //给res.locals赋值，意味着所有模板都可以用；
    // res.locals.success = req.session.success;
    // res.locals.error = req.session.error;

    res.locals.success = req.flash("success").toString();
    res.locals.error = req.flash("error").toString();
    next();
});
//静态文件中间件的参数是静态文件根目录
app.use(express.static(path.resolve('node_modules')));
app.use(express.static(path.resolve('client/static')));

//返回一个路由中间件
let index = require('./routes/index');
let user = require('./routes/user');
let article = require('./routes/article');
let category = require('./routes/category');
//如果客户端请求的路径是以/开头的话，才会交由index路由中间件来处理
// /user/signup/s/s/s/s
// /xxx
app.use('/', index);
//如果请求的URL地址是以/user开头的话
app.use('/user', user);
app.use('/article', article);
app.use('/category', category);

app.listen(8080, function () {
    console.log("Server start success Port:8080");
});