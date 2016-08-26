// //引入gulp（构建模块）
 var gulp = require('gulp');

// //引入服务模块
 var webserver = require('gulp-webserver');

//引入压缩js模块
var uglify = require('gulp-uglify');


//引入编译scss模块
var sass = require('gulp-sass');

//引入压缩css模块
var minify = require('gulp-minify-css');

//引入模块开发
var webpack = require('gulp-webpack');

//引入获取文件名模块
var named = require('vinyl-named');//获取文件名称后，通过loader（把变量引入模块化编程）把文件引入webpack

//引入加密模块
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

//引入node.js的url,fileSystem文件操作
var url = require('url');
var fs = require('fs');

//引入把变量引入模块化编程
var loader = require('imports-loader');

//压缩js
gulp.task('uglifyJs',function(){
  gulp.src('./js/*.js')//js接口地址
      .pipe(named())//获取所有的文件名称
      .pipe(webpack({
        output:{
          filename:'[name].js'
        },
        module:{
          loaders:[{
            test:/\.js$/,//正则匹配js文件
            loader:'imports?define=>false'
          }]
        }
      }))
      .pipe(uglify().on('error',function(e){//压缩文件
        console.log('\X07',e.lineNumber,e.message)//出错时打印报错的行数和信息
        return this.end()
      }))
      .pipe(gulp.dest('./App/js'))
})

//开启服务
gulp.task('webserver',function(){//开启服务
  gulp.src('./')
      .pipe(webserver({
        port:80,//端口设为80
        livereload:true,//重新加载
        directoryListing:{//显示目录
          enable:true,
          path:'./'//默认从同目录启动服务
        },
        middleware:function(req,res,next){
          var urlObj=url.parse(req.url,true);
          switch(urlObj.pathname){
            case './api/getLiveList.php':
            res.setHeader('Content-type','application/json');
            fs.readFile('./mock/detailList.json','utf-8',function(err,data){
              res.end(data);
              return;
            })
          }
          next();
        }
      }))
})
//创建任务
gulp.task('copy', function(){
  // 将你的默认的任务代码放在这
  gulp.src('index.html')
    .pipe(gulp.dest('./App'));
});
//设置监听
gulp.task('watch',function(){
  gulp.watch('./index.html',['copy']);
  gulp.watch('./js/*.js',['uglifyJs']);
})
// //设置默认
gulp.task('default',['watch','webserver']);