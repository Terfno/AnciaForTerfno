
■ DisplayImageList ～ページ内に表示されている画像一覧を表示～

// @name        DisplayImageList for Ancia
// @lastupdate  2013/10/30
// @author      From E@駄文にゅうす(http://ariel.s8.xrea.com/)
// @description	ページ内の画像を一覧表示(http://ariel.s8.xrea.com/news/2012_02.htm#20120212)

閲覧中のページ内に表示されている画像を、一覧表示します。

画像一覧表示時、マウスが画像上に移動すると、
	青：ページ上に表示されていた画像へのリンク
	橙：ページ上に表示されていた画像から別の画像ファイルへのリンク
	赤：ページ上に表示されていた画像から別のページへのリンク > デフォルト無効(safety = true;)
と、｢画像周りの枠の色｣と変るよう設定してあります。

リンク先の拡張子を判断基準に、
｢危険 > 赤 > 橙 > 青 > 安全｣の順でリンク先の危険度が判るようになっていますので参考にして下さい。



■ 動作環境

WindowsXP,Vista,7,8/Internet Explorer6以降。



■ DisplayImageListをユーザースクリプトとして使うには？

1.スクリプト(displayImageList.js)を、Ancia\scriptフォルダの中に入れて下さい。
2.適当な画像が表示されているページへ移動し、スクリプトを実行(ツール→スクリプト→displayImageList.js)して下さい。
3.設定に問題が無ければ、閲覧中のページに表示されていた画像の一覧が、現在のタブor新規タブ(デフォルト)に表示されます。



■ DisplayImageListの設定、注意事項(重要)

DisplayImageListの設定で、｢tabPosition = true; // 画像一覧表示時を新規タブで開く｣
を選んだ場合、PCスペック次第では一時的にフリーズorエラー表示が発生する可能性があります。
もし発生するようであれば、｢tabPosition = flase;｣ と設定して下さい。



■ DisplayImageListの設定について

displayImageList.json が同じフォルダにある場合、displayImageList.json での設定が優先されます。
もし、記述に誤りがあった場合は、デフォルトの設定が適応されます。

表示したくない画像等がある場合は、同梱されている displayImageList-Sample.json を参考に、
displayImageList.json を直接書き換えてください。



■ 確認済みの不具合 & 暫定対応法

Q.Google画像検索の検索後のページで実行しても、｢Google画像検索で表示されている画像｣の画像一覧が表示されない。
A.Googleからログアウトして下さい。

Q.pixivの｢プロフィール or 作品一覧｣の画面上で実行しても画像一覧が表示されない。 
A.新規タブで開くと表示されます。Ctrlキーを押しながら実行すると強制的に新規タブで表示されます。

Q.DisplayImageList実行後の画像一覧に表示抜け画像がある。
A.64*64サイズの画像で表示抜け画像がある場合は、サイト側に原因（スタイルシートでのURL指定ミス）の可能性があります。



■ 著作権表示

Copyright (C) 2012 Fron E All rights reserved.
