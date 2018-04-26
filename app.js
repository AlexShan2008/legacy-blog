const express = require('express');
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const flash = require('connect-flash');//消息提示模块，提示后就消失了。配合express-session使用
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const config = require('./config');
let isDev = process.env.NODE_ENV === 'develop'; // 是否是开发环境;

//使用bodyParser中间件
app.use(bodyParser.urlencoded({extended: true}));

//设置模板引擎的文件格式；
app.set('view engine', 'html');
//设置模板的存放目录
app.set('views', path.resolve('dist'));

//如果模板后缀是HTML的话，使用EJS模板引擎的方法来进行渲染
app.engine('html', require('ejs').__express);

//把会话数据保存在数据库中；
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
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
//静态文件中间件的参数是静态文件根目录
app.use(express.static(path.resolve('node_modules')));
app.use(express.static(path.resolve('dist')));//打包文件的加载；
app.use(express.static(path.resolve('static')));//图片等静态资源的加载；

//返回一个路由中间件
let index = require('./router/index');
let user = require('./router/user');
let article = require('./router/article');
let category = require('./router/category');

app.use('/', index);
app.use('/user', user);
app.use('/article', article);
app.use('/category', category);

 // 404
app.use(function (req, res, next) {
    res.render('404', { title: '你的页面走丢了' });
});

app.listen(port, function () {
    console.log(`Server start success Port:${port}`);
});