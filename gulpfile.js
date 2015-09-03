var gulp = require('gulp')
  , header = require('gulp-header')
  , browserify = require('gulp-browserify')
  , autoprefixer = require('gulp-autoprefixer')
  , less = require('gulp-less')
  , sourcemaps = require('gulp-sourcemaps')
  , isProduction = process.env.NODE_ENV === 'production'
  , gulpif = require('gulp-if')
  , livereload = require('gulp-livereload')
  , jade = require('gulp-jade')

/*
* This compiles the markup located in markup/ into usable HTML for browser testing / viewing.
*/
gulp.task('markup', function() {
  var LOCALS = {};

  gulp.src('./templates/*.jade')
    .pipe(jade({
      pretty: true
      , locals: LOCALS
      , basedir: __dirname
    }))
    .pipe(gulp.dest('./public/')) 
})

gulp.task('css', function() {
  return gulp.src(['./external-libs/jquery.filer/css/**/*.css'])
    .pipe(gulp.dest('public/assets/css/'));
});

gulp.task('less', function() {
  return gulp.src(['./node_modules/trendy/less/*.less'])
    .pipe(less({
      paths: ['./node_modules/trendy/less/'],
      modifyVars: {
        '@brand-primary': '#A2A2A2',
        '@brand-success': '#006B2F',
        '@brand-info': '#003C61',
        '@brand-warning': '@brand-primary',
        '@brand-danger': '#9A2200',
        '@brand-light': 'darken(#F5F5F5, 3%);',
        '@brand-dark': 'darken(@brand-primary, 40%);',
        '@brand-black': '#333333',
        '@brand-one': '@brand-primary',
        '@brand-two': '#FFF',
        '@brand-three': '#FFF',
        '@brand-four': '#FFF',
        '@brand-five': '#FFF',
        '@input-border-radius': '4px',

        '@navbar-height': '80px',
        '@font-size-base': '16px;'
      },
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/assets/css/'));
})

gulp.task('js', function() {
  return gulp.src(['./node_modules/bootstrap/dist/js/*', './node_modules/jquery/dist/*'])
    .pipe(gulp.dest('public/assets/js/'));
})

gulp.task('fonts', function() {
  return gulp.src(['./node_modules/trendy/fonts/*', './node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest('public/assets/fonts/'));
})

/*
* This is a design task which runs a live server for viewing compiled markup & testing stylesheets
*/
gulp.task('design', ['markup', 'less', 'js'], function () {
  var browserSync = require('browser-sync')
    , reload = browserSync.reload

  browserSync({
    server: {
      baseDir: 'public'
    , index: 'index.html'
    }
    , port: 7777
    , files: [
        'public/**'
      , 'public/assets/**'
      , 'templates/**'
      ]
    , open: false
    , online: false
  })

  gulp.watch("node_modules/trendy/less/*.less", ['less']);
  gulp.watch("public/assets/css/*.css").on('change', reload);
  
  gulp.watch("templates/*.jade", ['markup']);
  gulp.watch("templates/**/*.jade", ['markup']);
  gulp.watch("public/*.html").on('change', reload);
})

gulp.task('default', ['markup', 'less', 'fonts', 'js', 'css'])
