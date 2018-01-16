'use sctrict';
const gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    concat = require('gulp-concat'),
    rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
    qcmq = require('gulp-group-css-media-queries'),
    smartgrid = require('smart-grid'),
    plumber = require('gulp-plumber'),
    includer = require('gulp-file-include'),
    settings = {
        outputStyle: 'sass',
        // Выбор препроцессора
        /* less || scss || sass || styl */
        columns: 12,
        /* number of grid columns */
        offset: "30px",
        /* gutter width px || % */
        container: {
            maxWidth: '1200px',
            /* max-width оn very large screen */
            fields: '30px' /* side fields */
        },
        breakPoints: {
            lg: {
                'width': '1100px',
                /* -> @media (max-width: 1100px) */
                'fields': '30px' /* side fields */
            },
            md: {
                'width': '960px',
                'fields': '15px'
            },
            sm: {
                'width': '780px',
                'fields': '15px'
            },
            xs: {
                'width': '560px',
                'fields': '15px'
            }
        }
    };

gulp.task('smartgrid', function () {
    smartgrid('src/css', settings);
});


gulp.task('sass', function () { // Создаем таск Sass
    return gulp.src('src/css/**/*.sass') // Берем источник
        .pipe(plumber())
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .on('error', function(error){
            console.log(error.message);
            this.end();
        })
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
        })) // Создаем префиксы
        .pipe(qcmq())
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        })) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'src' // Директория для сервера - src
        },
        notify: true // Отключаем уведомления
    });
});

gulp.task('scripts', function () {
    return gulp.src([ // Берем все необходимые файлы
            'src/js/developments/main.js',
            'src/js/developments/preloader.js',
            // 'src/js/developments/timer.js',
            'src/js/developments/atomic.js',
            'src/js/developments/todo-list.js'
        ])
        .pipe(concat('app.min.js')) // Собираем их в кучу в новом файле vendors.min.js
        // .pipe(uglify()) // Сжимаем JS файл
        // .on('error', function (error) {
        //     console.log(error);
        // })
        .pipe(gulp.dest('src/js')) // Выгружаем в папку src/js
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browser-sync', 'includer', 'scripts'], function () {
    gulp.watch('src/css/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    // gulp.watch('src/css/**/*.scss', ['scss']); // Наблюдение за sass файлами в папке sass
    gulp.watch('src/**/*.html', ['includer']); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('src/js/**/*.js',['scripts']); // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function () {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('includer', function () {
    gulp.src('src/components/blocks/*.html')
        .pipe(includer({
            prefix: '@@',
            basepath: '@file'
        }).on('error', function (error) {
            console.log(error);
        }))
        .pipe(gulp.dest('src/components'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('build', ['clean', 'img', 'sass'], function () {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'src/css/*'
    ]).pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('src/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});

gulp.task('default', ['watch']);