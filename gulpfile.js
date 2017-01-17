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
  appFile: ['./src/js/overlay.js'],
  courseFiles: 'course/**/*',
  assetsDir: ['src/mn/**/*'],
  htmlDir: ['src/index.html','src/navigation.json'],
  testDir: './test',
  distDir: './dist',
  outputFile: './mn/overlay.js'
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
    .pipe(gulp.dest(config.testDir))
    .pipe(gulp.dest(config.distDir))
    .pipe(reload({ stream: true }));
}

gulp.task('clean', function() {
  return del([config.testDir+'/**','!'+config.testDir,config.distDir+'/**','!'+config.distDir]);
});

gulp.task('assets', ['clean'], function() {
    gulp.src(config.assetsDir)
    .pipe(gulp.dest(config.distDir+'/mn'))
    .pipe(gulp.dest(config.testDir+'/mn'))
});

gulp.task('html', ['assets'], function() {
    gulp.src(config.htmlDir)
    .pipe(gulp.dest(config.distDir))
    .pipe(gulp.dest(config.testDir))
});

gulp.task('dist', ['html'], function() {
    gulp.src([config.courseFiles,config.distDir+'**/*'])
    .pipe(gulp.dest(config.testDir))
});

gulp.task('build-persistent', ['dist'], function() {
  return bundle();
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    open: false,
    server: {
      baseDir: config.testDir
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
  gulp.watch(['./src/*.html','./src/css/*.css','./src/js/*.js'], ['build-persistent']);
});
