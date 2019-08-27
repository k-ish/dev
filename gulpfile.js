const gulp = require('gulp'),
			sass = require('gulp-sass'),
			postcss = require('gulp-postcss'),
			autoprefixer = require('autoprefixer'),	// postcssの一部
			mqpacker = require('css-mqpacker'),	// postcssの一部
			cssdeclsort = require('css-declaration-sorter'),	// postcssの一部(並び替え)
			pug = require('gulp-pug'),
			plumber = require("gulp-plumber"),	// 監視継続
			notify  = require('gulp-notify'),	// 通知
			imagemin = require("gulp-imagemin"),
			imageminJpg = require("imagemin-mozjpeg"),
			imageminPng = require("imagemin-pngquant"),
			imageminGif = require("imagemin-gifsicle");



// path 設定
var rootdir = './dest';
var destdir = rootdir;
var srcdir = {
	scss: './src/**/*.scss',
	pug: ['./src/**/*.pug', '!src/**/_*.pug', '!./src/_*/**/*'],
	image: './src/**/*.+(jpg|jpeg|png|gif)',
	copy: ['./src/**/*','!./src/**/*.+(pug|scss|jpg|jpeg|png|gif)']
}



// sass コンパイル
gulp.task('sass', function () {
	// post-css プラグインの設定
	var plugins = [
		cssdeclsort({
			// smacss 沿ってソート
			order:'smacss'
		}),
		autoprefixer({
			// IEは11以上、Androidは4.4以上
			// その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
			browsers: ['last 2 versions', 'ie >= 10', 'Android >= 4'],
			cascade: false
		}),
		// media-query をまとめる
		mqpacker()
	];

	return gulp.src(srcdir.scss)
	// return gulp.src(srcdir.scss, { sourcemaps: true })
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))	// watch　エラー時間師継続+DP通知
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(postcss(plugins))	// 設定したpost-cssを実行
		.pipe(gulp.dest(destdir))
		// .pipe(gulp.dest(destdir,{ sourcemaps: './maps' }))
});



// pug コンパイル
gulp.task('pug', function () {
	return gulp.src(srcdir.pug)
		.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))	// watch　エラー時間師継続+DP通知
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(destdir))
});



// 画像圧縮
gulp.task('imagemin', function () {
	return gulp.src(srcdir.image, {	// 差分更新ができない
		since: gulp.lastRun(imagemin)
	})
	.pipe(imagemin([
		imageminPng(),
		imageminJpg({
			quality: 85,
			progressive: true
		}),
		imageminGif({
			interlaced: false,
			optimizationLevel: 3,
			colors: 180
		})
	]
	))
	.pipe(gulp.dest(destdir))
});



// ファイルコピー
gulp.task('copy', function () {
	return gulp.src(srcdir.copy)
		.pipe(gulp.dest(destdir));
});



// 監視
gulp.task('default', function () {
	gulp.watch(srcdir.scss, gulp.task('sass'));
	gulp.watch(srcdir.pug, gulp.task('pug'));
	gulp.watch(srcdir.image, gulp.task('imagemin'));
	// gulp.watch(srcdir.copy, gulp.task('copy'));
});



//　ビルド
gulp.task('build', gulp.series(gulp.parallel('sass', 'pug', 'imagemin', 'copy')));



// gulp-sass gulp-postcss autoprefixer css-mqpacker gulp-pug gulp-plumber gulp-notify

// gulp.task(“タスク名”,function() {  anytask  });でタスクの登録をおこないます。
// return gulp.src(“MiniMatchパターン”)で読み出したいファイルを指定します。
// pipe(行いたい処理)でsrcで取得したファイルに処理を施します
// gulp.dest(“出力先”)で出力先に処理を施したファイルを出力します。
// “sass/style.scss” sass/style.scssだけヒット
// “sass/*.scss” sassディレクトリ直下にあるscssがヒット
// “sass/**/*.scss” sassディレクトリ以下にあるすべてのscssがヒット
// [“sass/**/.scss”,"!sass/sample/**/*.scss] sass/sample以下にあるscssを除くsassディレクトリ以下のscssがヒット

// では新機能を確認します。
// 1. タスクを直列処理するseries()と並列処理するparallel()メソッドが追加。run-sequenceプラグインはもう必要ない
// 2. watch()タスクはchokidarを使用したものに変更。gulp-watchプラグインはもう必要ない
// 3. lastRun()を使用して差分ビルドが簡単に。gulp-changedプラグインはもう必要ない
// 4. symlink()でシンボリックリンクを作成しpackage.jsonとnode_modulesを使いまわすことが可能に
// 5. ソースマップ組み込みサポートが追加。gulp-sourcemapsプラグインはもう必要ない
// 6. エクスポートされたfunctionのtask登録
// 7. カスタム・レジストリ（タスクの分割）がもっと簡単にできるようになった
// 8. 条件付きビルドと段階的ビルドがいろいろとアップデートされた
