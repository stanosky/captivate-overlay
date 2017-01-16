const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const _ = require('lodash');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const del =require('del');
const slugify =require('slug');

var config = {
  appFile: ['./src/index.js'],
  includeFiles: ['src/css/*.*','src/img/*.*','src/index.html'],
  outputDir: './test/',
  outputFile: './mn/overlay.js',
  distDir: './dist/'
};

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = browserify(config.appFile, _.extend({ debug: true }, watchify.args));
    bundler.plugin(watchify);
  }
  return bundler;
};

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({ stream: true }));
}


// clean the output directory
/*gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});*/
gulp.task('clean', function() {
  return del([config.outputDir]);
});

gulp.task('dist', function() {
    gulp.src(config.includeFiles)
    .pipe(gulp.dest(config.distDir))
});

gulp.task('build-persistent', [/*'clean',*/'dist'], function() {
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    open: false,
    server: {
      baseDir: config.outputDir
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
  gulp.watch(['./src/*.html','./src/css/*.css','./src/js/*.js'], ['build-persistent']);
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: config.outputDir
    }
  });
});
