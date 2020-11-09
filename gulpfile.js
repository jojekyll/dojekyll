// Links https://github.com/seaneking/rucksack#javascript-api https://gist.github.com/OleVik/73f714177fef8c71c62eb56552e2135d

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var uncss = require('postcss-uncss');

// Removing unused classes in CSS
gulp.task('uncss', function() {
    return gulp.src('./css/dojekyll.min.css')
      .pipe(uncss({
      html: ['./_site/**/*.html'],
      ignore: [/fp/],
      timeout: 1000
    }))
    .pipe(gulp.dest('./assets/css/uncss/'));
  });


const gulp = require('gulp'),
      sass = require('gulp-sass'),
      gutil = require('gulp-util'),
      plumber = require('gulp-plumber'),
      rename = require('gulp-rename'),
      minifyCSS = require('gulp-minify-css'),
      prefixer = require('gulp-autoprefixer'),
      connect = require('gulp-connect'),
          modRewrite = require('connect-modrewrite'),
          uncss = require('gulp-uncss');
      cp = require('child_process');

// Path variables
const base_path = '',
      src = base_path + './',
      dist = base_path + '_site',
      paths = {
          js: src + '/js/*.js',
          scss: src +'/css/*.scss',
          jekyll: ['index.html', '_posts/*', '_layouts/*', '_includes/*' , 'assets/*', 'assets/**/*']
      };

// Build Jekyll
gulp.task('jekyll', (code) => {
  return cp.spawn('C:\\Ruby22\\bin\\jekyll.bat', ['build', '--incremental'], {stdio: 'inherit'})
    .on('error', (error) => gutil.log(gutil.colors.red(error.message)))
    .on('close', code)
})

// Compile SASS to CSS
gulp.task('sass', ['jekyll'], () => {  
  return gulp.src(paths.scss)
    .pipe(plumber((error) => {
        gutil.log(gutil.colors.red(error.message));
        gulp.task('sass').emit('end');
    }))
    .pipe(sass())
    .pipe(prefixer('last 3 versions', 'ie 9'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('_site/css'));
});

// Reload on changed Markdown
gulp.task('md', ['sass'], function () {
  gulp.src('*.md')
    .pipe(connect.reload());
});

// Remove unused CSS
gulp.task('uncss', ['md'], function () {
    return gulp.src('_site/css/app.css')
        .pipe(uncss({
            html: ['_site/**/*.html']
        }))
        .pipe(gulp.dest('_site/css'));
});

// Watch files
gulp.task('watch', () => {
  gulp.watch(paths.jekyll, ['uncss']);
  gulp.watch('*.md', ['uncss']);
  gulp.watch(paths.scss, ['uncss']);
});

// Setup Server
gulp.task('server', ['uncss'], () => {
  connect.server({
    root: ['_site'],
    livereload: true,
    port: 4000,
	middleware: function() {
		return [
		modRewrite([
			'^.([^\\.]+)$ /$1.html [L]'
			])
		]
	}
  });
})

// Run server and watch tasks
gulp.task('default', ['server', 'watch']);