const path = require("path");   // パス取得（標準モジュール）
const fs = require("fs");   // ファイル操作（標準モジュール）
const gulp = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");	// postcssの一部
const mqpacker = require("css-mqpacker");	// postcssの一部
const pug = require("gulp-pug");
const plumber = require("gulp-plumber");    // errorでも監視継続
const rename = require("gulp-rename");

// https://qiita.com/MikaShirahama/items/ab91624709510c496e53
const imagemin = require("gulp-imagemin");
const imageminJpg = require("imagemin-mozjpeg");
const imageminPng = require("imagemin-pngquant");
const imageminGif = require("imagemin-gifsicle");
const changed = require('gulp-changed');

// npm i -D gulp@3.9.0 gulp-sass gulp-postcss css-mqpacker autoprefixer gulp-pug gulp-plumber gulp-rename gulp-imagemin imagemin-mozjpeg imagemin-pngquant imagemin-gifsicle gulp-changed
// gulp.task(“タスク名”,function() {});でタスクの登録をおこないます。
// gulp.src(“MiniMatchパターン”)で読み出したいファイルを指定します。
// pipe(行いたい処理)でsrcで取得したファイルに処理を施します
// gulp.dest(“出力先”)で出力先に処理を施したファイルを出力します。
// “sass/style.scss” sass/style.scssだけヒット
// “sass/*.scss” sassディレクトリ直下にあるscssがヒット
// “sass/**/*.scss” sassディレクトリ以下にあるすべてのscssがヒット
// [“sass/**/.scss”,"!sass/sample/**/*.scss] sass/sample以下にあるscssを除くsassディレクトリ以下のscssがヒット


var basedir = "DIST/";   // ルートディレクトリを指定
var dir = basedir;

// jpg,png,gif画像の圧縮タスク
var paths = {
	srcDir: 'src',
	dstDir: dir
}
gulp.task('imagemin', function () {
	var srcGlob = paths.srcDir + '/**/*.+(jpg|jpeg|png|gif)';
	var dstGlob = paths.dstDir;
	gulp.src(srcGlob)
		.pipe(changed(dstGlob))
		.pipe(imagemin([
			imageminPng(),
			imageminJpg({
				quality: 80

			}),
			imageminGif({
				interlaced: false,
				optimizationLevel: 3,
				colors: 180
			})
		]
		))
		.pipe(gulp.dest(dstGlob));
});


// sassコンパイル
gulp.task("sass", function () {
	// post-css プラグインの設定
	var plugins = [
		autoprefixer({
			// ☆IEは11以上、Androidは4.4以上
			// その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
			browsers: ["last 2 versions", "ie >= 10", "Android >= 4"],
			cascade: false
		}),
		// media-query をまとめる
		mqpacker()
	];

	gulp.src(["./src/**/*.scss", "!./src/_*/**/*"])
		.pipe(sass({ outputStyle: "expanded" })) // sassコンパイル
		.on("error", sass.logError) // 監視中のエラーによる強制停止を回避
		.pipe(postcss(plugins))	// 設定したpost-cssを実行
		.pipe(gulp.dest(dir));
});


// pug コンパイル
gulp.task("pug", function () {
	gulp.src(["./src/**/*.pug", "!src/**/_*.pug", "!./src/_*/**/*"])
		.pipe(plumber()) // 監視中のエラーによる強制停止を回避
		.pipe(
			pug({
				pretty: true
			})
		)
		.pipe(gulp.dest(dir));
});


// コピー
gulp.task("copy", function () {
	gulp.src(["./src/**/*.+(html|css|js|pdf)", "!./src/_*/**/*"])
		.pipe(gulp.dest(dir));
});




// 監視
gulp.task("default", function () {
	gulp.watch(["./src/**/*.pug", "!src/**/_*.pug", "!./src/_*/**/*"], ["pug"]);
	gulp.watch(["./src/**/*.scss", "!./src/_*/**/*"], ["sass"]);
	gulp.watch(["./src/**/*.+(html|css|js|pdf)", "!./src/_*/**/*"], ["copy"]);
	gulp.watch("srcGlob", ["imagemin"]);
});


// 初回実行
gulp.task("build", ['sass', 'pug', 'copy', 'imagemin']);




// ファイルコピー
// ゼロパディング関数
function zeroPadding(num, length) {
	return ('0000000000' + num).slice(-length);
}
gulp.task("copy2", function () {
	for (i = 1; i <= 20; i++) {     // 条件に生成する回数
		var copyNum = zeroPadding(i, 2);    // ゼロパディングの右値が桁、左値が実際の数
		gulp.src("index.html")      // コピー元
			.pipe(rename({
				dirname: "test2",   // ディレクトリ構造
				basename: "index",  // 基本名
				prefix: "a-",       // 先頭文字
				suffix: copyNum,    // 後尾文字
				extname: ".css"     // 拡張子
			}))
			.pipe(gulp.dest('./dist'));
	}
});
