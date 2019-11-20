# 開発テンプレート 進捗メモ
- webサイトのUIの一覧を作成　[UIリスト](./progress.md)
- まずは、タイポグラフィとグリッドシステムを作成
- 各コンポーネントにわたす、コンポーネント毎に変数を定義し、そこにグローバル変数をわたす

ディレクトリ構造
```
index.pug
	└style.scss
		└import

import
	└setting
	└component(ui)
	└utility
```

- normalize と typography の基礎はまとめる
- 変数には参照用とプロジェクト固有の値がある。それぞれファイルを分けるべきか→わけるべき
- 参照用変数にはカラースケールやCSSプロパティ一覧
- プロジェクト用変数と normalize/typography は同一ファイルに
