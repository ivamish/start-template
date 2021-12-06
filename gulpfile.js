const {src, dest, watch, series } = require('gulp');
const scss               = require('gulp-sass')(require('sass'));
const prefix             = require('gulp-autoprefixer');
const concat             = require('gulp-concat');
const uglify             = require('gulp-uglify-es').default;
const inject             = require('gulp-inject');
const strip              = require('gulp-strip-comments');
const del                = require('del');
const browserSync        = require('browser-sync').create();
const imagemin           = require('gulp-imagemin');

function image(){
    return del(['dist/images/**/*',
                'dist/icons/**/*']), 
    src(['src/images/**/*',
          'src/icons/**/*'], {base:'src'})
    .pipe(imagemin())
    .pipe(dest('dist'));
}

function fonts(){
    return del(['dist/fonts/**/*']),
    src([
        'src/fonts/**/*'
    ], {base:'src'})
    .pipe(dest('dist'));
}

function styles(){
    return src([
        'src/scss/style.scss'
    ]) 
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(prefix({
        cascade: false
    }))
    .pipe(concat('style.min.css'))
    .pipe(strip())
    .pipe(dest('dist/css'));
}

function scripts(){
    return src([
        //'node_modules/jquery/dist/jquery.js',
        'src/js/main.js'
    ])
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(strip())
    .pipe(dest('dist/js'));
}

function Html(){
    return src('src/**/*.html')
    .pipe(inject(src([
        'dist/css/**/*.css',
        'dist/js/**/*.js'
    ]), {transform: function (filepath) {
        filepath = filepath.replace('/dist/', '');
        if(filepath.slice(-3) === 'css'){
            return `<link rel="stylesheet" href="${filepath}">`;
        }else{
            return `<script src="${filepath}"></script>`;
        }
        
    }}))
    .pipe(strip())
    .pipe(dest('dist'));
}

function deleted(){
    return del(['dist']);
}

function watchhing(){
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    watch(['src/scss/**/*.+(scss|sass)'], styles).on('change', browserSync.reload);
    watch(['src/js/**/*.js'], scripts).on('change', browserSync.reload);
    watch(['src/**/*.html'], Html).on('change', browserSync.reload);
    watch(['src/fonts'], fonts).on('change', browserSync.reload);
    watch(['src/images/**/*', 'src/icons/**/*'], image).on('change', browserSync.reload);
}

exports.style = styles;
exports.script = scripts;
exports.html = Html;
exports.build = series(deleted, styles, scripts, fonts, image, Html, watchhing);