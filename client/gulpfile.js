'use strict';

const autoprefixer = require('gulp-autoprefixer');
const babel = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const del = require('del');
const eslint = require('gulp-eslint');
const gutil = require('gulp-util');
const gulp = require('gulp');
const minimist = require('minimist');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const reporter = require('postcss-reporter');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const source = require('vinyl-source-stream');
const stylelint = require('stylelint');
const syntaxScss = require('postcss-scss');

const optionsSetAtInvocation = minimist(process.argv);
const environment = optionsSetAtInvocation.environment || 'development';


const config = {
  sources: {
    directories: {
      scss: 'src/scss',
      js: 'src/js'
    }
  },
  outputPaths: {
    css: `build/css`,
    js: 'build/js'
  }
};

config.sources.files = {
  scss: `${config.sources.directories.scss}/**/*.scss`,
  js: `${config.sources.directories.js}/**/*.js`
};

gulp.task('css', ['sass:lint'], () => {
  const options = environment === 'production' ? { outputStyle: 'compressed' } : null;
  return gulp.src([`${config.sources.directories.scss}/build.scss`])
             .pipe(sourcemaps.init())
             .pipe(sassGlob())
             .pipe(sass(options).on('error', sass.logError))
             .pipe(autoprefixer())
             .pipe(rename('all.css'))
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest(config.outputPaths.css))
             .pipe(browserSync.stream());
});

gulp.task('sass:lint', ['sass:clean'], () => {
  const processors = [
    stylelint(),
    reporter({ clearMessages: true, throwError: true  })
  ];

  return gulp.src([config.sources.files.scss])
             .pipe(postcss(processors, { syntax: syntaxScss }));
});

gulp.task('sass:clean', () => {
  del(config.outputPaths.css);
});

gulp.task('js', ['js:transpile']);

gulp.task('js:transpile', ['js:clean', 'js:lint'], () => {
  return browserify(`./${config.sources.directories.js}/main.js`, {
    debug: true /* !(environment === 'production') */
  })
    .transform(babel)
    .bundle()
    .on('error', (err) => { console.error(err.message); })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(environment === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.outputPaths.js));
});

gulp.task('js:clean', () => {
  del(config.outputPaths.js);
});

gulp.task('js:lint', () => {
  return gulp.src([config.sources.files.js])
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
});

gulp.task('build', ['css', 'js']);
gulp.task('default', ['build']);
