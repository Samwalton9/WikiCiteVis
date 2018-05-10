'use strict';

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const del = require('del');
const gulp = require('gulp');
const minimist = require('minimist');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const reporter = require('postcss-reporter');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
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
  scss: `${config.sources.directories.scss}/**/*.scss`
};

gulp.task('generateAllStyles', ['sass:lint'], () => {
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

gulp.task('build', ['generateAllStyles']);
gulp.task('default', ['build']);
