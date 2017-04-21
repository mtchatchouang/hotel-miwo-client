'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  ngAnnotate = require('gulp-ng-annotate'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  connect = require('gulp-connect'),
  proxy = require('http-proxy-middleware'),
  del = require('del'),
  jshint = require('gulp-jshint'),
  watch = require('gulp-watch'),
  es = require('event-stream'),
  jsbeautifier = require('gulp-jsbeautifier'),
  less = require('gulp-less'),
  plumber = require('gulp-plumber'),
  gutil = require('gulp-util');

var argv = require('yargs').argv;

var extJsGlob = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/angular/angular.js',
  './node_modules/angular-route/angular-route.js',
  './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
  './node_modules/angular-translate/dist/angular-translate.js',
  './node_modules/angular-ui-validate/dist/validate.js',
  './node_modules/angular-i18n/angular-locale_de-de.js',
  './node_modules/angular-input-masks/releases/angular-input-masks-standalone.js',
  './node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
  './node_modules/angular-cookies/angular-cookies.js'
];

var extFontsGlob = [
  './node_modules/bootstrap/dist/fonts/*'
];

// app.js must be first!
var jsGlob = ['./src/app.js', './src/**/*.js'];
var lessFile = './src/less/app.less';
var lessGlob = './src/less/**/*.less';
var htmlGlob = './src/**/*.html';
var distFolder = './dist/';

gulp.task('default', ['dev']);
gulp.task('dist', ['lintDist', 'jsDist', 'assets']);
gulp.task('dev', ['lintDev', 'jsDev', 'assets']);
gulp.task('assets', ['less', 'html', 'static']);

gulp.task('lintDist', function() {
  return gulp.src(jsGlob)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lintDev', function() {
  return gulp.src(jsGlob)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('jsDev', function() {
  var s1 = gulp.src(jsGlob)
    .pipe(concat('app.js'));

  var s2 = gulp.src(extJsGlob)
    .pipe(concat('libs.js'));

  return es.merge(s1, s2).pipe(gulp.dest(distFolder));
});

gulp.task('jsDist', function() {
  var s1 = gulp.src(jsGlob)
    .pipe(ngAnnotate())
    .pipe(concat('app.js'));

  var s2 = gulp.src(extJsGlob)
    .pipe(concat('libs.js'));

  return es.merge(s1, s2).pipe(uglify()).pipe(gulp.dest(distFolder));
});

gulp.task('less', function() {
  return gulp.src(lessFile)
    .pipe(plumber({
      errorHandler: function(err) {
        var marker = '\n################################################################################\n'
        gutil.log(
          gutil.colors.red('!! Error in task'),
          gutil.colors.cyan("'less'\n"),
          gutil.colors.red(marker),
          err.toString(),
          gutil.colors.red(marker)
        );
        this.emit('end');
      }
    }))
    .pipe(less())
    .pipe(rename('app.css'))
    .pipe(gulp.dest(distFolder));
});

gulp.task('html', function() {
  return gulp.src(htmlGlob)
    .pipe(gulp.dest(distFolder));
});

gulp.task('static', function() {
  var s1 = gulp.src("./assets/**")
    .pipe(gulp.dest(distFolder));
  var s2 = gulp.src(extFontsGlob)
    .pipe(gulp.dest(distFolder + 'fonts'));
  return es.merge(s1, s2);
});

gulp.task('http', function() {
  return connect.server({
    port: 9001,
    root: 'dist',
    middleware: function(connect, opt) {
      return [
        proxy('/api', {
          target: 'http://docker:8080',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/api/hello' : '/hello'
          }
        })
      ]
    }
  });
});

gulp.task('watch', function() {
  return watch([jsGlob[1], lessGlob, htmlGlob], function() {
    gulp.start('dev');
  });
});

gulp.task('serve', ['dev', 'http', 'watch']);

gulp.task('clean', function() {
  return del(distFolder);
});

gulp.task('fmt', function() {
  return gulp.src(jsGlob, {
      base: './'
    })
    .pipe(jsbeautifier({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest('.'));
});
