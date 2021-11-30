const {src, dest, watch, series } = require('gulp');
const scss               = require('gulp-sass')(require('sass'));
const concat             = require('gulp-concat');
const uglify             = require('gulp-uglify-es').default;
const inject             = require('gulp-inject');
const strip              = require('gulp-strip-comments');
const del                = require('del');

function copy2dist(){
    return src([
        'src/fonts/**/*',
        'src/images/**/*',
        'src/icons/**/*'
    ], {base:'src'})
    .pipe(dest('dist'));
}

function styles(){
    return src([
        'src/scss/style.scss'
    ]) 
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(strip())
    .pipe(dest('dist/css'));
}

function scripts(){
    return src([
        'node_modules/jquery/dist/jquery.js',
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
    watch(['src/scss/**/*.+(scss|sass)'], styles);
    watch(['src/js/**/*.js'], scripts);
    watch(['src/**/*.html'], Html);
    watch(['src/fonts', 'src/images/', 'src/icons/'], build);
}

function build(){
    
}

exports.copy = copy2dist;
exports.style = styles;
exports.script = scripts;
exports.html = Html;
exports.build = series(deleted, copy2dist, styles, scripts, Html, watchhing);