// 抽出スクリプトサンプル
// 抽出スクリプトでは、window, document, Debugオブジェクトが使用できます。
// 取得結果への追加は、
//   var v = { link:"追加するURL", title:"表示タイトル"};
//   Tool.addItem(v);
// とすることで行えます。
//
// 下は、イメージを全て抽出しているサンプルです。
var imgs=document.images;
for(i=0;i<imgs.length;++i){
	var	img=imgs[i],v={link:img.src},title="";
	if(img.alt){
		title=img.alt;
	}
	if(img.width&&img.height){
		title+=" ("+img.width+"×"+img.height+")";
	}
	v.title=title;
	Tool.addItem(v);
}