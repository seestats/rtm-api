var gulp = require('gulp');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');

var allSources = ['**/*.js', '!node_modules/**', '!gulpfile.js', '!build/**'];

gulp.task('default', function lint() {
  console.log('Possible commands:');
  console.log('\tgulp lint - checks code with eslint');
  console.log('\tgulp build - compiles es6 JavaScript code to es5 standard,');
});

gulp.task('build', function build() {
  return gulp.src(allSources)
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('lint', function lint() {
  return gulp.src(allSources)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
