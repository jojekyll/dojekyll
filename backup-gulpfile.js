const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rucksack = require('rucksack-css');
const uncss = require('gulp-uncss');

gulp.task('optim-css', function() {
    var stream1 = gulp.src(['dev/css/bootstrap.min.css','dev/css/custom.css'])
        .pipe(postcss([ rucksack() ]))
        .pipe(postcss(uncss({
                html:   ['http://localhost/olssonseder/','http://localhost/olssonseder/lyssna/','http://localhost/olssonseder/repertoar/','http://localhost/olssonseder/kontakta/','http://localhost/olssonseder/kontakta/','http://localhost/olssonseder/om-gitarren/'],
                ignore: [new RegExp('.b-lazy*'),
                         new RegExp('.stickyFooter')]
            }))
        );

    var stream2 = gulp.src(['dev/css/responsive-nav.css','dev/css/lity.css','dev/css/mp3-player-button.css'])

    return merge(stream1, stream2)
        .pipe(concat('styles.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(''))
        .pipe(browserSync.stream());
});

postcss([ require('postcss-uncss') ])




var gulp = require('gulp');
var less = require('gulp-less');
var csscomb = require('gulp-csscomb');
var uncss = require('gulp-uncss');
var cleanCSS = require('gulp-clean-css');
var critical = require('critical');

// Compiling the CSS from less
gulp.task('less', function () {
  return gulp.src('./_less/style.less')
	.pipe(less())
	.pipe(gulp.dest('./assets/css/big'));
});

// Sorting the CSS
gulp.task('styles', ['less'], function() {
  return gulp.src('./assets/css/big/style.css')
  .pipe(csscomb())
  .pipe(gulp.dest('./assets/css/combed'));
});

// Removing unused classes in CSS
gulp.task('uncss', ['styles'], function() {
  return gulp.src('./assets/css/combed/style.css')
    .pipe(uncss({
    html: ['./_site/**/*.html'],
    ignore: [/fp/],
    timeout: 1000
  }))
  .pipe(gulp.dest('./assets/css/uncss/'));
});

// Removing tabs and spaces in CSS
gulp.task('minify-css', ['uncss'], function() {
  return gulp.src('assets/css/uncss/style.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('assets/css/'));
});

// Extracting the critical path CSS
gulp.task('critical', ['minify-css'], function() {
  critical.generate({
    base: '_site/',
    src: 'index.html',  // Extract critical path CSS for index.html
    css: ['assets/css/style.css'],
    dest: './_includes/critical.css',
    minify: true,
    include: [/cc_/],
    ignore: ['@font-face']
  });
});


// Run all the tasks above in the following fixed sequence
gulp.task('css', ['less','styles', 'uncss', 'minify-css', 'critical']);


var gulp = require('gulp');
var postcss require('gulp-postcss');
var uncss = require('postcss-uncss');
var cssvars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var cssImport = require('postcss-import');
var autoprefixer = require('autoprefixer');

gulp.task('css', function () {
    return gulp.src('./src/*.css')
        .pipe(postcss())
        .pipe(gulp.dest('./dest'));
});