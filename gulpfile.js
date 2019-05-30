// Load Gulp...of course
const gulp         = require( 'gulp' );
const watch        = require('gulp-watch');

// CSS related plugins
const sass         = require( 'gulp-sass' );
const autoprefixer = require( 'gulp-autoprefixer' );
const minifycss    = require( 'gulp-uglifycss' );
const cssnano = require('gulp-cssnano');

// JS related plugins
const concat       = require( 'gulp-concat' );
const uglify       = require( 'gulp-uglify' );
const babelify     = require( 'babelify' );
const browserify   = require( 'browserify' );
const source       = require( 'vinyl-source-stream' );
const buffer       = require( 'vinyl-buffer' );
const stripDebug   = require( 'gulp-strip-debug' );
const webpack = require("webpack");
const webpackconfig = require("./webpack.config.js");
const webpackstream = require("webpack-stream");
const through = require('through2');

// Utility plugins
const rename       = require( 'gulp-rename' );
const sourcemaps   = require( 'gulp-sourcemaps' );
const notify       = require( 'gulp-notify' );
const plumber      = require( 'gulp-plumber' );
const options      = require( 'gulp-options' );
const gulpif       = require( 'gulp-if' );
const imagemin     = require("gulp-imagemin");
const del = require("del");
// const clean = require('gulp-clean');

const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const newer = require('gulp-newer');
// Browers related plugins
const browsersync  = require( 'browser-sync' ).create();
// const reload       = browsersync.reload;

const paths = {
	projectURL: 'http://localhost',
	input: 'src/',
	output: 'dist/',
	scripts: {
		input: 'src/js/',
		output: 'dist/js/',
		jsModules: 'src/js/modules/*.js',
		jsMain: 'src/js/main.js',
		jsFront: 'main.js',
		mapURL: './'
	},
	styles: {
		input: 'src/scss/**/*.{scss,sass}',
		output: 'dist/css/',
		mapURL: './'
	},
	images: {
		input: 'src/images/**/*',
		output: 'dist/images/'
	},
	fonts: {
		input: 'src/fonts/**/*',
		output: 'dist/fonts/'
	},
	watchfiles: {
		styleWatch : 'src/scss/**/*.*',
		jsWatch : 'src/js/**/*.js',
		imgWatch : 'src/images/**/*.*',
		fontsWatch : 'src/fonts/**/*.*',
		phpWatch : '**/*.php'
	}
};
function plumbError() {
	return plumber({
		errorHandler: function(err) {
			notify.onError({
				templateOptions: {
					date: new Date()
				},
				title: "Gulp error in " + err.plugin,
				message:  err.formatted
			})(err);
			this.emit('end');
		}
	})
}
// BrowserSync
function browserSync(done) {
	browsersync.init({
		open: false,
		cors: true,
		injectChanges: true,
		notify: false,
		scrollProportionally: false,
		proxy: paths.projectURL
	});
	done();
}
function browserSyncReload(done) {
	browsersync.reload();
	done();
}

// Clean assets
function clean() {
  return del(paths.output);
}

// Styles
function styles(done) {
	return gulp
		.src(paths.styles.input)
		.pipe( sourcemaps.init() )
		.pipe(plumbError())
		.pipe( sass() )
		// .on('error', function (err) {
		// 	console.log(err.toString());
		// 	this.emit('end');
		// })
		.pipe( autoprefixer({ browsers: [ 'last 2 versions', '> 5%', 'Firefox ESR' ] }) )
		// .pipe(cssnano())
		.pipe( sourcemaps.write( paths.styles.mapURL ) )
		.pipe( gulp.dest( paths.styles.output ) )
		.pipe( browsersync.stream() );
	done();
}

// scripts
function scripts (done) {
	// const files = [
	// 		paths.scripts.jsFront
	// 	];
	// files.map( function( entry ) {
	// 	return browserify({
	// 		entries: [paths.scripts.input + entry]
	// 	})
	// 	.transform( babelify, { presets: [ '@babel/preset-env' ] } )
	// 	.bundle()
	// 	.pipe( source( entry ) )
	// 	.pipe( buffer() )
	// 	.pipe( gulpif( options.has( 'production' ), stripDebug() ) )
	// 	.pipe( sourcemaps.init() )
	// 	.pipe( uglify() )
	// 	.pipe( sourcemaps.write( paths.scripts.mapURL ) )
	// 	.pipe( gulp.dest( paths.scripts.output ) )
	// 	.pipe( browsersync.stream() );
	// });
	return gulp.src(paths.scripts.jsMain)
		.pipe(plumber())
		.pipe(webpackstream({
			config : webpackconfig,
			devtool: 'source-map'
		}, webpack))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(through.obj(function (file, enc, cb) {
			// Dont pipe through any source map files as it will be handled
			// by gulp-sourcemaps
			const isSourceMap = /\.map$/.test(file.path);
			if (!isSourceMap) this.push(file);
			cb();
		}))
		.pipe( sourcemaps.write( paths.scripts.mapURL ) )
		.pipe( gulp.dest( paths.scripts.output ) )
		.pipe(browsersync.stream());
	done();
}

// images
function images (done) {
	return gulp.src(paths.images.input)
	.pipe(newer(paths.images.output))
	.pipe(
		imagemin([
			pngquant({
				quality: [0.6, 0.8],
				speed: 1,
			}),
			mozjpeg({
				quality: 75,
				progressive: true,
			}),
			imagemin.svgo({
				plugins: [
				{
					cleanupIDs: true,
					removeViewBox: false,
					collapseGroups: true
				}
				]
			})
		])
	)
	.pipe(gulp.dest(paths.images.output));
	// .pipe( browsersync.stream() );
	// done();
}

// move files
// function images (done) {
// 	return gulp.src(paths.images.input)
// 		.pipe(gulp.dest(paths.images.output));
// }
function fonts (done) {
	return gulp.src(paths.fonts.input)
		.pipe(gulp.dest(paths.fonts.output));
}

function triggerPlumber( src, url ) {
	return gulp.src( src )
	.pipe( plumber() )
	.pipe( gulp.dest( url ) )
	.pipe( browsersync.stream() );
}

function watchFiles() {
	gulp.watch( paths.watchfiles.phpWatch, browserSyncReload);
	gulp.watch( paths.watchfiles.styleWatch, gulp.series(styles, browserSyncReload));
	gulp.watch( paths.watchfiles.jsWatch, gulp.series(scripts, browserSyncReload));
	gulp.watch( paths.watchfiles.imgWatch, gulp.series(images, browserSyncReload));
	gulp.watch( paths.watchfiles.fontsWatch, gulp.series(fonts, browserSyncReload));
	gulp.src( paths.scripts.output + 'main.js' )
		.pipe( notify({ message: 'Gulp is Watching, Happy Coding!' }) );
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(styles, scripts, images, fonts));
const watching = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.fonts = fonts;
exports.images = images;
exports.css = styles;
exports.js = scripts;
exports.clean = clean;
exports.build = build;
exports.watching = watching;
// exports.default = build;
exports.default = watching;
