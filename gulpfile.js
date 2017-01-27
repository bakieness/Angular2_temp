var gulp = require("gulp");
var del = require("del");
var tsc = require("gulp-typescript");
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var sass = require('gulp-sass');
var tsProject = tsc.createProject("tsconfig.json");

/**
 * Remove build directory.
 */
gulp.task('clean', (cb) => {
    return del(["build"], cb);
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task("compile", () => {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));
    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build"));
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", () => {
    return gulp.src(["src/**/*", "!**/*.ts", "!src/{scss,scss/**}"])
        .pipe(gulp.dest("build"))
});

/**
 * Copy all required libraries into build directory.
 */
gulp.task("libs", () => {
    return gulp.src([
            'es6-shim/es6-shim.min.js',
            'systemjs/dist/system-polyfills.js',
            'angular2/bundles/angular2-polyfills.js',
            'systemjs/dist/system.src.js',
            'rxjs/bundles/Rx.js',
            'angular2/bundles/angular2.dev.js',
            'angular2/bundles/router.dev.js'
        ], {cwd: "node_modules/**"}) /* Glob required here. */
        .pipe(gulp.dest("build/lib"));
});

/**
 * Enables live reload
 */
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build/'
    },
  })
});

gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

/**
 * Watch for any changes to files in src folder
*/
gulp.task('watch', function() {
  gulp.watch(['src/**/*.*', "!src/scss/*"], ['compile', 'resources', reload]);
  gulp.watch(['src/scss/**/*.*'], ['sass', reload]);
});

/**
 * Build the project.
 */
gulp.task("build", ['compile', 'resources', 'libs', 'sass'], () => {
    console.log("Building the project ...")
});

/**
 * Default task.
 */
gulp.task('default', ['build', 'browserSync', 'watch']);