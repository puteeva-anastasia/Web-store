var gulp         = require('gulp'),
		sass         = require('gulp-sass')(require('sass')),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify-es').default,
		cleanCSS     = require('gulp-clean-css'),
		rename       = require('gulp-rename'),
		del          = require('del'),
		imagecomp    = require("compress-images"),
		cache        = require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer'),
		ftp          = require('vinyl-ftp'),
		notify       = require("gulp-notify"),
		rsync        = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done() };

gulp.task('sass', function() {
	return gulp.src('app/assets/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({
		// grid: true, // Optional. Enable CSS Grid
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/assets/css'))
	.pipe(browserSync.stream())
});

// Пользовательские скрипты проекта

gulp.task('js', function() {
	return gulp.src([
		'app/assets/libs/jquery/dist/jquery.min.js',
		'app/assets/libs/owl.carousel/dist/owl.carousel.min.js',
		'app/assets/libs/ion.rangeSlider/js/ion.rangeSlider.min.js',
		'app/assets/js/common.js', // Всегда в конце
		])
	.pipe(concat('app.min.js'))
	.pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/assets/js'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('imagemin', async function() {
	imagecomp(
		"app/assets/img/**/*",
		"dist/assets/img/",
		{ compress_force: false, statistic: true, autoupdate: true }, false,
		{ jpg: { engine: "mozjpeg", command: ["-quality", "75"] } },
		{ png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
		{ svg: { engine: "svgo", command: "--multipass" } },
		{ gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
		function (err, completed) {
			if (completed === true) {
				// browserSync.reload()
			}
		}
	)
});

gulp.task('removedist', function() { return del(['dist'], { force: true }) });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('buildFiles', function() { return gulp.src(['app/*.html', 'app/.htaccess']).pipe(gulp.dest('dist')) });
gulp.task('buildVideo', function() { return gulp.src(['app/assets/video/**/*']).pipe(gulp.dest('dist/assets/video')) });
gulp.task('buildPages', function() { return gulp.src(['app/pages/*.html']).pipe(gulp.dest('dist/pages')) });
gulp.task('buildCss', function() { return gulp.src(['app/assets/css/main.min.css']).pipe(gulp.dest('dist/assets/css')) });
gulp.task('buildJs', function() { return gulp.src(['app/assets/js/app.min.js']).pipe(gulp.dest('dist/assets/js')) });
gulp.task('buildFonts', function() { return gulp.src(['app/assets/fonts/**/*']).pipe(gulp.dest('dist/assets/fonts')) });

gulp.task('build', gulp.series('removedist', 'imagemin', 'sass', 'js', 'buildFiles', 'buildVideo', 'buildPages', 'buildCss', 'buildJs', 'buildFonts'));

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('app/')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
	gulp.watch('app/assets/sass/**/*.sass', gulp.parallel('sass'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'));
	gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'js', 'browser-sync', 'watch'));