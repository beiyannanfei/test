
/**
 * Created by huanli<huali@tibco-support.com> on 12/13/14.
 *
 * Variable prefixes' meanings:
 * -------------------------------------------------------------------------
 * --- The prefix of a variable's name reveals the type of data it holds ---
 * -------------------------------------------------------------------------
 *
 * a: Array
 * b: Boolean
 * d: DOM
 * f: Function
 * l: List(an array-like object)
 * n: Number
 * o: Object
 * r: Regular expression
 * s: String
 * x: More than one type
 *  : Special case or NOT my code
 *
 * *** These prefixes can be concatenated to indicate that the variable can
 *         hold the specified types of data ***
 */

(function () {
    'use strict';

    //var gulp = require('gulp'),
    //    minifycss = require('gulp-minify-css'),
    //    concat = require('gulp-concat'),
    //    uglify = require('gulp-uglify'),
    //    rename = require('gulp-rename'),
    //    sass=require('gulp-sass'),
    //    templateCache = require('gulp-angular-templatecache'),
    //    del = require('del');






    var gulp=require('gulp'),
        fs=require('fs'),
    //url=require('url'),
        superagent = require('superagent'),
        cheerio = require('cheerio'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        minifycss = require('gulp-minify-css'),
        rename = require('gulp-rename'),
    //http=require('http'),
        request = require('request'),
        templateCache = require('gulp-angular-templatecache');



    gulp.task('build-dev-header',function(){


        fs.readFile('public/tpl/header_debug.html','utf-8',function(err,data){
            //console.log('data is:',data,err);
            var $=cheerio.load(data);
            var script_arr=[];
            var css_arr=[];
            $('script').each(function(i,elem){
                var src=elem.attribs.src;
                if(typeof(src)!=='undefined'&&src!=='/components/layer/layer.js'){
                    if(src.indexOf('http://')!==0){
                        script_arr.push('public'+src);
                    }else{
                        script_arr.push(src);
                    }

                }

            })
            $('link').each(function(i,elem){
                var src=elem.attribs.href;
                if(typeof(src)!=='undefined'&&typeof(elem.attribs.rel)!=='undefined'&&elem.attribs.rel==='stylesheet'){
                    if(src.indexOf('http://')!==0){
                        css_arr.push('public'+src);
                    }else{
                        css_arr.push(src);
                    }

                }

            })
            var js_str='',script_index= 0,script_len=script_arr.length;
            var css_str='',css_index= 0,css_len=css_arr.length;
            function handleJsFile(resText){
                js_str+=resText+'\n';
                console.log('一共'+script_len+'个js文件,当前第'+script_index+'个文件读取完毕');
                script_index++;
                if(script_index===script_len){
                    console.log('所有js文件读取完毕,开始读取css文件');
                    loop_css();
                }else{
                    loop_js();
                }
            }
            function handleCssFile(resText){
                css_str+=resText+'\n';
                console.log('一共'+css_len+'个css文件,当前第'+css_index+'个文件读取完毕');
                css_index++;
                if(css_index===css_len){
                    console.log('所有css文件读取完毕');



                    fs.writeFile('public/javascripts/main.js',js_str,function(err,data){
                        if(!err){

                            console.log('现在开始压缩js和css文件，可能需要几十秒时间，请稍后');
                            gulp.src(['public/javascripts/main.js']).pipe(concat('main.js'))
                                .pipe(gulp.dest('public/javascripts'))
                                .pipe(rename({suffix: '.min'}))
                                .pipe(uglify())
                                .pipe(gulp.dest('public/javascripts',function(){
                                    console.log('任务完成');
                                }))

                            fs.writeFile('public/stylesheets/main.css',css_str.replace("//@import url('http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&lang=en');"),function(err,data){
                                if(!err){

                                    gulp.src('public/stylesheets/main.css')
                                        .pipe(rename({suffix: '.min'}))
                                        .pipe(minifycss())
                                        .pipe(gulp.dest('public/stylesheets/'));


                                    console.log('ok-----------');
                                }
                            })
                        }
                    })





                }else{
                    loop_css();
                }
            }

            function loop_js(){
                var url=script_arr[script_index];
                console.log('开始读取:'+url);
                if(url.indexOf('http://')===0){
                    request.get({url:url,headers:{'User-Agent': 'request'}}, function (error, response,data) {
                        console.log('response.statusCode:'+response.statusCode);
                        if (!error && response.statusCode == 200) {
                            handleJsFile(data);
                        }
                    });
                }
                else{

                    fs.readFile(url,'utf-8',function(err,data){
                        handleJsFile(data);
                    })
                }
            }
            function loop_css(){
                var url=css_arr[css_index];
                console.log('开始读取:'+url);
                if(url.indexOf('http://')===0){
                    request.get({url:url,headers:{'User-Agent': 'request'}}, function (error, response,data) {
                        console.log('response.statusCode:'+response.statusCode);
                        if (!error && response.statusCode == 200) {
                            handleCssFile(data);
                        }
                    });
                }
                else{

                    fs.readFile(url,'utf-8',function(err,data){
                        handleCssFile(data);
                    })
                }
            }

            loop_js();
            //console.log('script_arr is:',script_arr);
        })
    })






    function doSass(){
        //console.log('hello')
        gulp.src('public/scss/app.scss')
            //.pipe(concat('app.scss'))
            .pipe(sass())
            .pipe(gulp.dest('public/stylesheets'));
    }

    gulp.task('sass',doSass);
    gulp.task('watch',function(){
        return gulp.watch('public/scss/*.scss', [
            'sass'
        ]);
    })

    gulp.task('build-template',function(){
        var fun=function(){
            console.log('i am fun');
        }
        return gulp.src('public/javascripts/baseModule/baseModule.template/**/*.html')
            .pipe(templateCache())
            .pipe(gulp.dest('public/javascripts/baseModule'));
    })
    //gulp.task('mini-js',['build-dev-header'],function(){
    //    gulp.src(['public/javascripts/main.js']).pipe(concat('main.js'))
    //        .pipe(gulp.dest('public'))
    //        .pipe(rename({suffix: '.min'}))
    //        .pipe(uglify())
    //        .pipe(gulp.dest('public'));
    //})
    gulp.task('build',['build-template'], function () {

        fs.readFile('public/javascripts/baseModule/templates.js','utf-8',function(err,data){

            data=data.replace('angular.module("templates")','angular.module("baseModule.templates",[])');
            fs.writeFile('public/javascripts/baseModule/baseModule.templates.js',data,function(){
                fs.unlink('public/javascripts/baseModule/templates.js');
            });
        })


        //var fs=require('fs');
        //
        //fs.readFile('views/index_debug.html','utf-8',function(err,data){
        //    if(!err){
        //        var cheerio=require('cheerio');
        //        var $=cheerio.load(data);
        //        var arr=[];
        //        $('script').each(function(i,elem){
        //            if(typeof(elem.attribs.src)!=='undefined'){
        //                arr.push('public'+elem.attribs.src);
        //                console.log('elem is:',elem.attribs.src);
        //            }
        //
        //        })
        //        console.log('arr is:',arr);
        //
        //        gulp.src(arr).pipe(concat('main.js'))
        //            .pipe(gulp.dest('public/minified/js'))
        //            .pipe(rename({suffix: '.min'}))
        //            .pipe(uglify())
        //            .pipe(gulp.dest('public/minified/js'));
        //
        //
        //    }
        //})



        //return
    });

}());
