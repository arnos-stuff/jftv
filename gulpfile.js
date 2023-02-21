const pkg = require('./package.json')
const glob = require('glob')
const yargs = require('yargs')
const colors = require('colors')
const through = require('through2');

const {rollup} = require('rollup')
const {terser} = require('rollup-plugin-terser')
const babel = require('@rollup/plugin-babel').default
const commonjs = require('@rollup/plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve').default

const gulp = require('gulp')
const tap = require('gulp-tap')
const zip = require('gulp-zip')

let cache = {};

gulp.task('package', gulp.series(() =>

    gulp.src(
        [
            './**/*.js',
            './**/*.json',
            
        ],
        { base: './' }
    )
    .pipe(zip('reveal-js-presentation.zip')).pipe(gulp.dest('./'))

))

gulp.task('reload', () => gulp.src(['**/*.html', '**/*.md'])
    .pipe(connect.reload()));

gulp.task('serve', () => {

    connect.server({
        root: root,
        port: port,
        host: host,
        livereload: true
    })

    gulp.watch(['**/*.html', '**/*.md'], gulp.series('reload'))

    gulp.watch(['js/**'], gulp.series('js', 'reload', 'eslint'))

    gulp.watch(['plugin/**/plugin.js', 'plugin/**/*.html'], gulp.series('plugins', 'reload'))

    gulp.watch([
        'css/theme/source/*.{sass,scss}',
        'css/theme/template/*.{sass,scss}',
    ], gulp.series('css-themes', 'reload'))

    gulp.watch([
        'css/*.scss',
        'css/print/*.{sass,scss,css}'
    ], gulp.series('css-core', 'reload'))

    gulp.watch(['test/*.html'], gulp.series('test'))

})
