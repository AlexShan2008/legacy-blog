# Alex Shan blog

## 安装依赖模块

```
npm install express ejs body-parser debug express-session connect-mongo mongoose connect-flash multer bootstrap -S
```

## 配置路由

```
/ 首页
/user/signup 用户注册
/user/signin 登录
/user/signout 退出登录
/article/add 发表文章
/category/add 增加分类功能
```

##在 mongodb 安装目录下-bin 文件夹下面用 cmd 运行如下命令
###mongod --dbpath=C:\Mongodb\data 启动数据库服务端

###powershell :
./mongod --dbpath=c:\Mongodb\data

##mongo 数据库客户端

##mongoVUE 数据库客户端

##md5 彩虹表 反解密 md5

- wd

* dhiuih \*

# Develop a blog with React/Webpack/material-ui

Develop a blog with React, Webpack, Babel, Eslint, documentation.js and material-ui.

And I will record all resources and process through the entire development of the project.

## Run

1. `git clone https://github.com/codingplayboy/react-blog.git`
2. `cd react-blog`
3. `npm install yarn -g`
4. `yarn install`
5. `yarn start` for develop
6. `yarn build` for production
7. `yarn doc` for create API doc

## API

1. [API](https://github.com/codingplayboy/react-blog/blob/master/API.md)

## Development Process

1. [Webpack 自动化构建实践指南](https://github.com/codingplayboy/react-blog/blob/master/docs/initWebpack.md)
2. [刷新页面 react-router 路由访问失败问题解决方案](https://github.com/codingplayboy/react-blog/blob/master/docs/webpack-dev-server-reflush-404.md)
3. [React 应用架构设计](https://github.com/codingplayboy/react-blog/blob/master/docs/react-app-structure.md)

## Structure introduction

1. `webpack`: 为 webpack 配置目录；
2. `webpack.config.js`: 为 webpack 配置入口文件；
3. `package.json`: 为项目依赖管理文件；
4. `yarn.lock`: 为项目依赖版本锁文件；
5. `.babelrc`: babel 的配置文件，使用 babel 编译 React 和 JavaScript 代码；
6. `eslintrc, eslintignore`: 分别为 eslint 语法检测配置及需要忽略检查的内容或文件；
7. `postcss.config.js`: CSS 后编译器 postcss 的配置文件；
8. `API.md`: API 文档入口；
9. `docs`: 文档目录；
10. `README.md`: 项目说明文档；
11. `src`: 开发代码目录
12. ├──`api` 请求 API
13. ├──`styles` 样式
14. ├──`components` 展示型组件
15. ├──`config` 全局配置
16. ├──`constants` 常量
17. ├──`containers` 容器组件
18. ├──`helper` 辅助／工具函数
19. ├──`store` redux store 相关
20. ├──`middlewares` 中间件
21. ├──`routes` 应用路由模块
22. ├──`services` 应用服务模块
23. ├──`index.html` 应用入口 html
24. ├──`app.js` 项目根组件文件

## Development Log

1. 项目基础布局（使用[material-ui](https://material-ui-next.com/）)
1. 搭建首页基本结构
1. 响应式布局(兼容 PC、iPad、Mobile)
1. 首页文章列表：
1. 初始加载及翻页
1. 列表自适应排布展示
1. 侧滑导航栏切换
1. 底部版权及联系方式声明组件
1. add airbnb eslint eslint-config-airbnb

```
npm i history
```
