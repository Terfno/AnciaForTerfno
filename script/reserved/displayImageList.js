// @name		DisplayImageList for Ancia
// @lastupdate	2014/10/30
// @author		From E
// @description	ページ内の画像を一覧表示(http://ariel.s8.xrea.com/news/2012_02.htm#20120212)

(function() {	// 無名関数開始

// 同じフォルダ(ディレクトリ)に displayImageList.json がある場合は、そちらの設定を優先します。
// 設定に記述誤りがある場合は、デフォルトの値が適応されます。
var config = new Object();
	config.limitSize     = 32;		// 指定サイズ以下の画像は取得しない。（設定範囲：1～999，推奨：32）
	config.thumbnail     = 224;		// 画像一覧表示時のサムネイルサイズを指定（設定範囲：1～999，推奨：192～256）
	config.tabPosition   = true;	// 画像一覧表示時を新規タブで表示するなら true 、現在のタブに表示なら false を指定。
	config.safety        = true;	// 画像一覧表示時のリンク先が画像ファイルのみ表示するなら true 、それ以外(html,cgi,php,asp etc...)も表示するなら false を指定。true 推奨
	config.safetyStyle   = true;	// スタイルシートでの背景画像指定が画像ファイルのみなら true 、それ以外(html,cgi,php,asp etc...)も表示するなら false を指定。true 推奨
	config.crossDdomain  = false;	// 外部ドメインのフレーム・インラインフレームページを新規タブで開くなら true 、スルーなら false を指定。
	config.filteringList = [		// URL指定でフィルタリング(正規表現可) > 文字列中に . / を使う場合は、\. \/ とエスケープする。 > 外部ファイルでは不要。
			// 拡張子 > flash,rdf,xml
			"https?(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)\.(swf|rdf|xml)$",
			
			// 特定サイトのファイルorフォルダ
			// リンク先URLでフィルタリング > 転送URL,アダルト系,アクセスランキング系 & etc...
			// 除外するフレーム・インラインフレーム
			"http:\/\/sample\.sample\.sample\.net\/"
		];

var define = new Object();
	define.limitSizeMin = 1;
	define.limitSizeMax = 1000;
	define.thumbnailMin = 32;
	define.thumbnailMax = 1000;

	define.PushKey         = 0x11;	// 任意キーを押した状態でスクリプトを実行した場合、画像一覧を新規タブで開く > Key Code:http://msdn.microsoft.com/en-us/library/dd375731(v=vs.85).aspx
	define.SettingPotision = true;	// 設定ファイル（displayImageList.json）の保存位置 > true 指定時、Ancia\scriptがあるフォルダ。false 指定で Ancia\setting に保存。
	define.AllowZeroSize   = true;	// true 指定時、画像サイズ取得不可(0*0)の場合、仮の画像サイズ(64*64)を与える。

	define.MatchImage         = /\.(jpe?g|gif|png|bmp)(\?[-_!~*\'()a-zA-Z0-9;\:\@&=+\$,%#]+)?$/i;
	define.MatchDataURIscheme = /^data:image\/(jpeg|gif|png|svg\+xml);base64,/
	define.MatchURL           = /^(https?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)[^\/]$/;
	define.MatchIllegalWord   = /\s|^inherit$/;
	define.MatchDomain        = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
	define.MatchURIscheme     = /^(javascript|res|mailto):/;
	define.MatchImport        = /\@import url\(.*\.css/g;
	define.MatchCSS           = /([a-zA-Z0-9_\-\.]+)\.(css)(\?)?([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)?$/;
	

	define.AlertTitle      = "DisplayImageList";
	define.AlertSetting    = "で記述ミスがありました。\nデフォルトの設定を使用します。";
	define.ErrInputBox     = "で不正な値が入力されていました。";
	define.TabCountZero    = "タブが開かれていません。";
	define.NotGetDocument  = "documentオブジェクトが取得できませんでした。";
	define.NotGetImage     = "取得可能な画像はありませんでした。";
	define.ReloadPage      = "画像一覧は取得済みです";
	define.FailedRequest   = "displayImageList.json で記述ミスがありました。\nデフォルトの設定を使用します。\n";
	define.FailedToLoad    = "設定ファイル読み込みでエラーが発生しました。\nデフォルトの設定を使用します。\n";
	define.FailedToSave    = "設定ファイルの保存に失敗しました。";
	define.NotSettingValue = "checkSetting()に、存在しない設定が渡されています。";
	define.InputBoxTop     = "設定詳細はスクリプト中の解説を参照して下さい。";
	define.MsgSameFolder   = "設定は、スクリプト（displayImageList.js）と同じフォルダに保存されます。";
	define.MsgOtherFolder  = "設定は、setting\\script のフォルダに保存されます。";
		
	define.BodyID      = "P0TQRNp0WXy6cee7iVcUNiUOTpPlAf8JbPZUQQD7krO408IoEqpp6T8x50bJwDlC";
	define.ClassImage  = 'class="image"';
	define.ClassAnchor = 'class="anchor"';
	define.ClassHtml   = 'class="html"';
	define.Signature   = '<a href="http://ariel.s8.xrea.com/news/2012_02.htm#20120212" title="DisplayImageList ～ページ内に表示されている画像一覧を表示～" target="_blank">DisplayImageList</a> by <a href="http://ariel.s8.xrea.com/" title="駄文にゅうす" target="_blank">駄文にゅうす</a>';

	// デフォルトの設定
	define.limitSize       = 32;
	define.thumbnail       = 224;
	define.tabPosition     = true;
	define.safety          = true;
	define.safetyStyle     = true;
	define.crossDdomain    = false;
	define.filteringList   = [
		// 拡張子 > flash,rdf,xml
		"https?(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)\.(swf|rdf|xml)$"
	];



// Class > start --------------------------------------------------------------------------------------------------------------
// 設定ファイル（displayImageList.json）の読み込み & 保存
function ApplicationSetting(_flag) {
	// Private Property
	var settingPosition = settingPosition(_flag);
	var settingPath     = settingPath(settingPosition);

	// Private Method
	function messageBox(message, title) {
		if (typeof title == "undefined") {	// 引数省略時
			App.beep();
			App.MsgBox(message);
		} else {
			App.beep();
			App.MsgBox(message, title);
		}
	}

	function settingPosition(flag) {
		if (flag === true || flag === false) {
			// OK
		} else if (typeof flag == "undefined") {
			// 引数省略時、デフォルト値を渡す
			flag = false;
		} else {
			messageBox("call : function settingPosition()" + "\n\n" + "bad : key setting" + "\n" + "key > " + flag + "\n\n" + "return > null");
			flag = null;
		}
		
		return flag;
	}

	function settingPath(flag) {
		if (flag !== true && flag !== false) {
			messageBox("call : function settingPath()" + "\n\n" + "bad : key setting" + "\n" + "key > " + flag + "\n\n" + "rewrite : key > false" );
			flag = false;
		}
		
		return Context.settingPath(flag);	// Ancia依存
	}

	// IEのバージョンチェック
	// 引数:無し 返値:IEのメジャーバージョン数、IE以外の場合は 0 を返す > タブが一つも開かれていない場合は、7(IE7)を返す
	function ieVersinCheck() {
		var isMSIE = /*@cc_on!@*/false;
		if (!isMSIE) {  // for FireFox, Opera, Safari, Crome
			return 0;
		}
		
		var msie;
		if (App.tabCount) {
			msie = window.navigator.appVersion.toLowerCase();
			msie = (msie.indexOf('msie')>-1) ? parseInt(msie.replace(/.*msie[ ]/, '').match(/^[0-9]+/)) : 0;
		} else {
			msie = 7;
		}
		
		return msie;
	}

	// オブジェクトをJSON文字列に変換
	// http://shall.dip.jp/mediawiki/index.php?title=%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92JSON%E6%96%87%E5%AD%97%E5%88%97%E3%81%AB%E5%A4%89%E6%8F%9B_(jQuery)
	function stringify(obj, base) {
	    var type = typeof (obj);
	    var parseArry = function(arrays, baseline) {	// JSON.stringify()互換に整形
				var string = "\n";
				var indent = baseline + "\t";
				
				for (var i = 0; i < arrays.length; i++) {
					string += indent + arrays[i];
					
					if (i < arrays.length-1) {
						string += "\," + "\n";
					} else if (baseline != "") {
						string += "\n" + indent;
					} else {
						string += "\n";
					}
				}
				
				return string;
			};
	    
	    if (typeof base == "undefined") {
	    	base = "";
	    }
	    
	    if (type != "object" || obj === null) {
	        // simple data type
	        if (type == "string") {
	        	obj = '"' + obj + '"';
	        }
	        
	        return String(obj);
	    } else {
	        // recurse array or object
	        var prop, value, json = [], arr = (obj && obj.constructor == Array);
			
	        for (prop in obj) {
	            value = obj[prop];
	            type = typeof(value);
	            
	            if (obj.hasOwnProperty(prop)) {
	                if (type == "string") {
	                	value = '"' + value + '"';
	                } else if (type == "object" && value !== null) {
	                	value = stringify(value, base + "\t");
	                }
	                
	                json.push((arr ? "" : '"' + prop + '": ') + String(value));
	            }
	        }
	        
	        return (arr ? "[" : "{") + parseArry(json, base) + (arr ? "]" : "}");
	    }
	}

	// Public Method
	this.setPosition = function(_obj) { settingPosition = settingPosition(_obj); settingPath = settingPath(settingPosition); };
	this.getPosition = function()     { return settingPosition; };
	this.setPath     = function(_str) { messageBox("No Support" + "\n\n" + "key > " + _str); };
	this.getPath     = function()     { return settingPath; };

	// 引数:データ格納済みオブジェクト 返値:データ保存成功 > true, データ保存失敗 > false
	this.save = function(_data) {
		var obj = _data;
		var ieVer = ieVersinCheck();
		
		if (!obj) {
			messageBox("bad : key setting > " + obj);
			return false;
		}
		
		// convert obj→json
		var json = null;
		if (ieVer > 7 || ieVer == 0) {
			json = JSON.stringify(obj, null, "\t");	// IE8以降 & OtherBrowser
		} else {
			json = stringify(obj);	// IE8未満
		}
		
		// file save
		try {
			var fs = new ActiveXObject("Scripting.FileSystemObject");
			var f = fs.OpenTextFile(settingPath, 2, true, -1);
			if (f) {
				f.Write(json);
				f.Close();
			}
		} catch (e) {
			messageBox("failed : save setting" + "\n\n" + "path > " + settingPath + "\n\n" + " error message > " + e.message);
			return false;
		}
		
		return true;
	};

	// 引数:無し 返値:読み込み成功 > データ格納済みオブジェクト, 読み込み失敗 > null
	this.load = function() {
		var fs = new ActiveXObject("Scripting.FileSystemObject");
		var	confg = null;
		var ieVer = ieVersinCheck();
		
		// file reading
		if (fs.FileExists(settingPath)){
			try {
				confg = fs.OpenTextFile(settingPath, 1, false, -1).ReadAll();
			} catch (e) {
				messageBox("failed : data loading" + "\n\n" + "path > " + settingPath + "\n\n" + " error message > " + e.message);
				confg = null;
			}
		} else {
			messageBox("failed : data loading" + "\n\n" + "path > " + settingPath + " > nothing");
			confg = null;
		}
		
		// check value
		if (confg) {
			var obj = new Object();
			
			// convert json→obj
			try {
				if (ieVer > 7 || ieVer == 0) {
					obj = JSON.parse(confg);	// IE8以降 & OtherBrowser
				} else {
					obj = eval("(" + confg + ")");	// IE8未満
				}
			} catch (e) {
				//messageBox("failed : data loading" + "\n\n" + e.message)
			}
			
			if (!obj) {
				obj = null;
			}
		} else {
			obj = null;
		}
		
		return obj;
	};
}

function ApplicationOption() {
	// Private Property
	var setting = main();

	// Public Property
	this.config = setting;

	// Private Method
	function main() {
		var data = settingForm();
		
		data = checkInput(data);
		
		return data;
	}
	
	function settingForm() {
		var message = define.SettingPotision ? define.MsgSameFolder : define.MsgOtherFolder;
		var json = App.InputBox({
					caption:define.AlertTitle,
					statics:[{text:define.InputBoxTop},{text:message}],
					inputs:[
							{label:"LimitSize:",     type:"number",   value:config.limitSize.toString()},
							{label:"ThumbnailSize:", type:"number",   value:config.thumbnail.toString()},
							{label:"tabPosition:",   type:"checkbox", value:config.tabPosition},
							{label:"safety:",        type:"checkbox", value:config.safety},
							{label:"crossDdomain:",  type:"checkbox", value:config.crossDdomain}
						],
					buttons:[{text:"OK"},{text:"キャンセル", type:"default"}]
			});
		
		return json;
	}

	// 入力値の整合性確認
	function checkInput(json) {
		var data = new Object();
		var castNum = function(a) {
				var num = a.replace(/[０１２３４５６７８９]/g
							, function(a) {
								var b = "０１２３４５６７８９".indexOf(a);
								return (b !== -1) ? b : a;
								}
							);
				
				return parseInt(num, 10);
			};
		
		if (!json) {
			return null;
		}
		
		var obj = eval("(" + json + ")");	// JSON→オブジェクトへ変換
		
		// 入力値が全角数値の場合のエラー対策。参考：http://thinkit.x-sys.net/p1040.html
		var limit = castNum(obj.inputs[0]);
		var thumb = castNum(obj.inputs[1]);
		var message = "";
		
		if (!limit || limit == "NaN" || limit == "" || limit < define.limitSizeMin || define.limitSizeMax < limit) {
			data = null;
			message += "limitSize" + "\n";
		}
		if (!thumb || thumb == "NaN" || thumb == "" || thumb < define.thumbnailMin || define.thumbnailMax < thumb) {
			data = null;
			message += "thumbnail" + "\n";
		}
		
		if (data) {
			data.limitSize     = limit;
			data.thumbnail     = thumb;
			data.tabPosition   = obj.inputs[2];
			data.safety        = obj.inputs[3];
			data.crossDdomain　= obj.inputs[4];
			data.filteringList = config.filteringList;	// filteringListだけ変数から取得
		} else {
			App.beep();
			App.MsgBox(message + define.ErrInputBox, define.AlertTitle);
		}
		
		return data;
	}
}

function ExtractionImage(_document, _list) {
	// Private Property
	var filteringList = _list;
	var filteringPattern = new RegExp('^' + '(' + (filteringList).join('|') + ')');
	var imageObj = searchImage(_document);
	
	// Public Property
	this.stylesheet = imageObj.stylesheet;
	this.background = imageObj.background;
	this.image      = imageObj.image;
	
	// Private Method
	function searchImage(_doc) {	// 引数:走査対象ページのdocumentオブジェクト 返値:画像オブジェクト格納済みオブジェクト
		var doc    = _doc;
		var tag    = doc.getElementsByTagName("*");
		var img    = doc.getElementsByTagName("img");
		var frame  = doc.getElementsByTagName("frame");
		var iframe = doc.getElementsByTagName("iframe");
		
		var array = new Object();
			array.stylesheet = new Array();
			array.background = new Array();
			array.image      = new Array();
		var temp = null;
		
		// 引数:フレーム・インラインフレームのObject，フレーム・インラインフレームの識別子 返値:画像オプジェクト格納済み配列
		var search = function(obj, type) {
				var frameObj = new Object();
					frameObj.stylesheet = new Array();
					frameObj.background = new Array();
					frameObj.image      = new Array();
				var temp = null;
				
				if (obj) {
					for (var i = 0; i < obj.length; i++) {
						console.log("search : "+ type + " > " + obj[i].src);
						
						if (typeof obj[i].src != "undefined" && obj[i].src != null && !obj[i].src.match(filteringPattern)) {
							try {
								temp = searchImage(obj[i].contentWindow.document);
								
								frameObj.stylesheet = (frameObj.stylesheet).concat(temp.stylesheet);
								frameObj.background = (frameObj.background).concat(temp.background);
								frameObj.image      = (frameObj.image).concat(temp.image);
							} catch (e) {
								// ｢外部ドメインのフレームorインラインフレーム｣のdocument取得時、｢アクセスが拒否されました。｣発生
								//alert(e.message);
								if (config.crossDdomain && obj[i].src != "" && !obj[i].src.match(define.MatchURIscheme)) {
									var	tab = CurrentTab.CmdExec("duplicate", -1, 0x1000004, 0);	// Ancia依存
									if (tab) {
										tab.CmdExec("go", obj[i].src);	// Ancia依存
									}
								}
							}
						}
					}
				}
				
				return frameObj;
			};
		var getBgImage = function(doc, obj) {
				var imgObj   = new Image();
				var retObj   = null;
				var baseURL  = doc.URL;
				var imageURL = "";
				
				if (obj == null || obj == "undefined" || obj == "none" || obj == "") {
					return retObj;
				}
				
				// URL末尾に含まれるファイル名を削除
				if (!baseURL.match(/\/$/)) {
					baseURL = baseURL.replace(/([a-zA-Z0-9_\-\.%]+)\.[-_!~*\'()a-zA-Z0-9;\?:\@&=+\$,%#]+$/, "");
				}
				// ｢URL末尾に含まれるファイルを削除｣後に、baseURL用にURL末尾を再確認
				if (!baseURL.match(/\/$/)) {
					baseURL += "/";
				}
				
				// 背景画像パスの文字列に含まれる url( " ' ) を削除
				obj = obj.replace(/(\"|\'|url\(|\)$)/g, "");
				
				imageURL = setImageUrl(baseURL, obj);
				
				// 空チェックは、background指定のURLが""だとdocument.URLが入るバグ対策
				imgObj.src = imageURL;
				if (imageURL != "") {
					retObj = imgObj;
					console.log("background ImageURL > " + retObj.src);
				} else {
					retObj = null;
				}
				
				return retObj;
			};
		
		console.log("url : " + doc.URL);
		console.log("url > frame : " + frame.length + ' ' + "iframe : " + iframe.length);
		console.log("url > style : " + doc.styleSheets.length);
		console.log("url > tag : " + tag.length);
		console.log("url > image : " + img.length);
		
		// フレーム・インラインフレームの検出。第2引数はデバック（console.log）用
		temp = search(frame, "frame");
			array.stylesheet = (array.stylesheet).concat(temp.stylesheet);
			array.background = (array.background).concat(temp.background);
			array.image      = (array.image).concat(temp.image);
		temp = search(iframe, "iframe");
			array.stylesheet = (array.stylesheet).concat(temp.stylesheet);
			array.background = (array.background).concat(temp.background);
			array.image      = (array.image).concat(temp.image);
		
		// スタイルシート(ページ中のstyleタグ & 外部スタイルシート)指定の背景画像を取得
		temp = extractionStyle(doc);
			array.stylesheet = (array.stylesheet).concat(temp);
		
		// タグ中で指定されている背景画像を取得
		for (var i = 0; i < tag.length; i++) {
			temp = getBgImage(doc, tag[i].background);
			if (temp) { (array.background).push(temp); };
			
			temp = getBgImage(doc, tag[i].style.backgroundImage);
			if (temp) { (array.background).push(temp); };
		}
		
		// imgタグ表示の画像を取得
		for (var i = 0; i < img.length; i++) {
			console.log("image : " + img[i].width + " , " + img[i].height +  " > " + img[i].src);
			(array.image).push(img[i]);
		}
		
		return array;
	}

	function extractionStyle(doc) {
		var styleSheetList = doc.styleSheets;
		var array  = new Array();
		
		for (var i = 0; i < styleSheetList.length; i++) {
			var styleSheet = styleSheetList[i];
			
			// 外部スタイルシート & styleタグ
			temp = getStyleImage(doc, styleSheet, null);
			if (temp) { array = array.concat(temp); }
			
			// @import検出
			if (styleSheet.imports) {
				for (var j = 0; j < (styleSheet.imports).length; j++) {
					temp = getStyleImage(doc, styleSheet.imports[j], styleSheet);
					if (temp) { array = array.concat(temp); }
				}
			}
		}
		
		return array;
	}

	function getStyleImage(doc, styleObj, relative){
		var rules   = null;
		var	baseURL = "";	// cssファイルがあるフォルダへのパス
		
		// styleObj.href != null の判定処理変更、様子見 > 2013/04/12
		if (styleObj.href != null && (typeof styleObj.href == "undefined" || (styleObj.href).match(/^file:\/\//))) {
			return null;
		}
		
		try {
			rules = styleObj.rules || styleObj.cssRules;	// 前:IE8以前 後:IE9以降 & other browser
		} catch (e) {
			// 存在していないcssファイルを読み込もうとすると、｢アクセスが拒否されました。｣発生
			//alert(e.message);
			console.log("404 Not Found : sheet > " + styleObj.href);
			return null;
		}
		
		// cssファイルが存在する｢ディレクトリィのパス｣を取得
		if (styleObj.href) {
			if (!relative) {
				// 外部スタイルシート
				baseURL = (styleObj.href).replace(define.MatchCSS, "");
				console.log("sheet > " + styleObj.href);
				console.log("baseURL > " + baseURL);
			} else {
				// 外部スタイルシートからの @import 呼び出し
				if (relative.href) {
				
					// ---------------------------------------------------------------------------------------------------------------------------
					// styleObj.href でcssファイルへのURLを取得しようとすると｢呼び出し元ページのパス＋\@importのurl｣の文字列が返る為、変則的な方法で @import css のパスを取得 > 2013/03/31
					var imp = (relative.cssText).match(define.MatchImport);
					var csspath = "";
					var cssfile = "";
					var recursion = "";	// cssファイルを含めたフルパス > 再帰呼び出し時の引数(relative)用
					
					if(imp) {
						for(var i = 0; i < imp.length; i++) {
							csspath = imp[i].replace(/@import url\(|\)\;?|\s|\"|url\(/g, "");
							cssfile = csspath.substring(csspath.lastIndexOf('/')+1, csspath.length)
							
							if ((styleObj.href).match(cssfile)) {
								if (csspath.match(/^https?:\/\//) || csspath.match(/^\/\//)) {
									recursion = csspath;
									baseURL = recursion.replace(define.MatchCSS, "");
								} else if (csspath.match(/^\//i)) {
									var reg = (relative.href).match(define.MatchDomain);
									recursion = (reg[1] + reg[3]) + csspath;
									baseURL = recursion.replace(define.MatchCSS, "");
								} else {
									recursion = (relative.href).replace(define.MatchCSS, "") + csspath;
									baseURL = recursion.replace(define.MatchCSS, "");
								}
								break;
							}
						}
					}
					// ---------------------------------------------------------------------------------------------------------------------------
					
					console.log("import in file > " + (relative.href).replace(define.MatchCSS, "") + csspath);
					console.log("baseURL > " + baseURL);
				} else {
					//  ページ中の <style>～</style> からの @import 呼び出し
					baseURL = (styleObj.href).replace(define.MatchCSS, "");
					console.log("import in page > " + styleObj.href);
					console.log("baseURL > " + baseURL);
				}
			}
		} else {
			// ページ中の <style>～</style>
			baseURL = (doc.URL).replace(/([a-zA-Z0-9_\-]+)\.[-_!~*\'()a-zA-Z0-9;\?:\@&=+\$,%#]+$/, "");
			console.log("embed > " + doc.URL);
			console.log("baseURL > " + baseURL);
		}
		
		var style = new Array();
		var image = new Array();
		var src = "";
		var num = 0;
		
		if (rules) {
			for (var k = 0; k < rules.length; k++) {
				var rule = rules[k].style.backgroundImage;
				
				if (typeof styleObj.href == "undefined" || rule != null && rule != "none" && rule != "") {
					rule = rule.replace(/\"|\'|url\(|\)|\/\*.*\*\//g, "");
					
					if (!rule.match(define.MatchIllegalWord)) {
						src = setImageUrl(baseURL, rule);
						
						image[num] = new Image();
						image[num].src = src;
						style.push(image[num]);
						console.log("style ImageURL : " + image[num].width + " , " + image[num].height + " > " + image[num].src);
						num++;
					} else {
						console.log("style ImageURL : unmatch word > " + rule);
					}
				}
			}
		}
		
		// ---------------------------------------------------------------------------------------------------------------------------
		// @import → @import 呼び出しの検出 > getStyleImage()を再帰呼び出し
		if (relative) {
			var tempObj = new Object();	// スタイルシートオブジェクトのプロパティ、上書き不可っぽいので引数用のオブジェクトを作成
			tempObj.href     = recursion;
			tempObj.cssText  = styleObj.cssText;
			tempObj.rules    = styleObj.rules;		// IE8以前
			tempObj.cssRules = styleObj.cssRules;	// IE9以降 & other browser
			
			if ((styleObj.imports).length > 0) {
				//alert((styleObj.imports).length + "\n" + "@import → @import 検出 > デバック用" + "\n" + "root > " + tempObj.href);
				
				for (var j = 0; j < (styleObj.imports).length; j++) {
					temp = getStyleImage(doc, styleObj.imports[j], tempObj);
					if (temp) { style = style.concat(temp); }
				}
			}
		}
		// ---------------------------------------------------------------------------------------------------------------------------
		
		return style;
	}

	function setImageUrl(baseURL, imageURL) {
		var src = "";
		
		if (imageURL.match(define.MatchDataURIscheme)) {	// URL指定が"Data URI scheme"
			src = imageURL;
		} else if (imageURL.match(/^https?:\/\//) || imageURL.match(/^\/\//) || imageURL.match(/^file:\/\//)) {	// 相対URL指定の先頭が // の場合は http:// と同じ処理
			src = imageURL;
		} else if (imageURL.match(/^\//i)) {	// 相対URL指定の先頭が / の場合は｢ドメイン＋相対URL指定｣
			var reg = baseURL.match(define.MatchDomain);	// ドメイン名の抽出 参考:http://tools.ietf.org/html/rfc2396#appendix-B
			src = (reg[1] + reg[3]) + imageURL;
		} else if (baseURL.match(/\/$/)) {
			src = baseURL + imageURL;
		} else {
			src = baseURL + "/" + imageURL;
		}
		
		return src;
	}
}

function ParseHtml(_array, _list) {
	// Private Property
	var filteringList    = _list;
	var filteringPattern = new RegExp("^" + '(' + (filteringList).join('|') + ')');
	var imageList        = new Array();	// 重複画像チェック用画像URLリスト
	var string           = main(_array);

	// Public Property
	this.size = checkSize(string);
	this.html = parseHtml(string);

	// Private Method
	function main(array) {
		var str = "";
		
		for (var pname in array) {
			var obj = array[pname];
			
			for (var i = 0; i < obj.length; i++) {
				if (obj[i] != null || typeof obj[i] != "undefined") {
					str += parseTag(obj[i], pname);
				}
			}
		}
		
		return str;
	}

	function checkSize(str) {
		var size = str.length;
		
		if (size > 0 || str != "") {
			return true;
		} else {
			return false;
		}
	}

	// 引数：画像オブジェクト，取得元（styleseet, background, img） 返値：
	function parseTag(obj, type) {
		var node   = obj.parentNode;	// 画像の親要素
		var style  = setingImagStyle(obj);
		var tag    = "";
		
		var tagSet = function(anchor, image, text, styleseet, classtype) {	// 引数:アンカーURL, 画像URL, テキスト(alt,title), 画像サイズ指定スタイルシート, リンク先別Class指定 返値:HTML文字列
						var str = '<a href="' + anchor + '"' + 'target="_blank">' + '<img src="' + image + '"' + 'alt="' + text + '"' + 'title="' + text + '"' + styleseet + classtype + '>' + '</a>' + '\n';
						
						return str;
					};
		
		// 重複画像排除 > 参考:http://tande.jp/lab/2012/07/1852
		// 引数:比較用文字列, 比較用リスト(配列) 返値:同じ文字列(URL)が存在するなら true, 存在しないなら false を返す
		var checkDuplicate = function(str, dupli) {
			var loop = dupli.length;
			
			for(var i = 0; i < loop; i++) {
				if (str == dupli[i]) {
					return true;
				}
			}
			
			imageList.push(str);
			
			return false;
		};

		// define.AllowZeroSize有効かつ画像サイズ取得不可(0*0)の場合、仮の画像サイズ(64*64)を与える
		if (define.AllowZeroSize && (obj.width == 0 && obj.height == 0)) {
			obj.width = 64;
			obj.height = 64;
			style = setingImagStyle(obj);
		}
		
		// ------------------------------------------------ フィルタリング開始 ------------------------------------------------
		var remove = true;
		var retype = ""
		
		// 画像取得状況
		//console.log("get image : " + type + " > "+ obj.width + " , "+ obj.height + " > " + obj.src);
		
		// URLタイプ
		if (config.safetyStyle) {
			if (!(obj.src).match(define.MatchImage) && !(obj.src).match(define.MatchDataURIscheme)) {
				console.log("unmatch : " + obj.src);
				remove = false;
				retype = "unmatch";
			}
		} else {
			if (!(obj.src).match(define.MatchImage) && !(obj.src).match(define.MatchDataURIscheme) && !(obj.src).match(define.MatchURL)) {
				console.log("unmatch : " + obj.src);
				remove = false;
				retype = "unmatch";
			}
		}
		
		if (checkDuplicate(obj.src, imageList)) {	// 重複画像URLチェック
			remove = false;
			retype = "duplicate";
		} else if (obj.width < config.limitSize && obj.height < config.limitSize) {	// 画像サイズチェック
			remove = false;
			retype = "size";
		} else if ((obj.src).match(filteringPattern)) {	// フィルタリング対象URLチェック
			remove = false;
			retype = "filtering";
		}
		
		// 一覧排除
		if (!remove) {
			console.log("remove > " + type + " : "  + retype + " : " + obj.width + " , " + obj.height + " > " + obj.src);
			return tag;
		}
		// ------------------------------------------------ フィルタリング終了 ------------------------------------------------
		
		// 暫定対策 > 2014/09/09
		// ついっぷる(http://twipple.jp/) で実行した際ページ内の含まれる
		// <a href="/user/%_SCREEN_NAME_%"><img src="./icon_proxy.php?screen_name=%_SCREEN_NAME_%" height="48" width="48" /></a>
		// の画像親要素(node.href)にアクセスするとエラー発生。とりあえず、try ～ catch で捕まえておく。
		try {
			if (node != null && node.nodeName == "A" && node.href != obj.src) {
				if ((node.href).match(define.MatchImage)) {
					tag = tagSet(node.href, obj.src, node.href, style, define.ClassAnchor);
				} else if ((node.href).match(define.MatchURIscheme)) {
					tag = tagSet(obj.src, obj.src, obj.src, style, define.ClassImage);
				} else if (!config.safety && !(node.href).match(filteringPattern)) {
					tag = tagSet(node.href, obj.src, node.href, style, define.ClassHtml);
				}
			} else if (!(obj.src).match(filteringPattern)) {
				tag = tagSet(obj.src, obj.src, obj.src, style, define.ClassImage);
			}
		} catch (e) {
			//alert(e.message);
			console.log("obj parent node accesas error : " + obj.src + " > " + e.message);
		}
		
		return tag;
	}

	function setingImagStyle(img) {
		var width, height;
		
		if (img.width > config.thumbnail || img.height > config.thumbnail) {
			if (img.width > img.height) {
				width = config.thumbnail;
				height = img.height / (img.width / config.thumbnail);
			} else if (img.width < img.height) {
				height = config.thumbnail;
				width = img.width / (img.height / config.thumbnail);
			} else {
				width = config.thumbnail;
				height = config.thumbnail;
			}
		} else {
			width = img.width;
			height = img.height;
		}

		return 'style="' + 'width:' + Math.round(width) + 'px;' + 'height:' + Math.round(height) + 'px;' + '"';
	}

	function parseHtml(html) {
		var PageTitle = document.title ? document.title : document.URL;
		var str = "";

		str += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">' + '\n';
		str += '<html lang="ja">' + '\n';
		str += '<head>' + '\n';
		str += '<meta http-equiv="content-type" content="text/html; charset=utf-8">' + '\n';
		str += '<meta http-equiv="content-style-type" content="text/css">' + '\n';
		str += '<title>about:image - ' + PageTitle + '</title>' + '\n';
		str += '<style type="text/css">' + '\n';
		str += '<!--' + '\n';
		str += '	body  { margin:1em 1em 2em; padding:0; background-color:#faf0e6; }' + '\n';
		str += '	img   { display:inline; margin:3px; background-color:#aaaaaa; }' + '\n';
		str += '	a img { border:solid 3px transparent; }' + '\n';
		str += '	.image:hover  { border:solid 3px #0068ff; }' + '\n'; // 青
		str += '	.anchor:hover { border:solid 3px #ff8c00; }' + '\n'; // 橙
		str += '	.html:hover   { border:solid 3px #ff0033; }' + '\n'; // 赤
		str += '	a img:hover { -moz-border-radius:10px;    }' + '\n'; // 角丸指定 > Firefox
		str += '	a img:hover { -webkit-border-radius:10px; }' + '\n'; // 角丸指定 > Safari,Chrome
		str += '	a img:hover { border-radius:10px;         }' + '\n'; // 角丸指定 > CSS3対応プラウザ
		str += '	.return       { display:block; margin:1em 0; padding:0.5em 0.5em 0.5em 1em; text-decoration:none; color:#ffffff; background-color:#242424; }' + '\n';
		str += '	.return:hover { color:#ff9900; }' + '\n';
	 	str += '	.signature           { margin:1em 0; padding:0 0.5em; text-align:right; }' + '\n';
		str += '	.signature a         { font-style:"メイリオ","ＭＳ Ｐゴシック",sans-serif; font-weight:bold; text-decoration:none; }' + '\n';
		str += '	.signature a:link    { color:#0068ff; }' + '\n';
		str += '	.signature a:visited { color:#0068ff; }' + '\n';
		str += '	.signature a:hover   { color:#8000ff; text-decoration:underline; }' + '\n';
		str += '	.signature a:active  { color:#0068ff; }' + '\n';
		str += '-->' + '\n';
		str += '</style>' + '\n';
		str += '</head>' + '\n';
		str += '<body id="' + define.BodyID + '">' + '\n';	// define.BodyID は二重読み込み検知用
	 	str += '\n';
		str += '<a href="' + document.URL + '"' + ' title="' + PageTitle + '"' + ' target="_self" class="return">戻る</a>' + '\n';
	 	str += '\n';
	  	str += html;
	  	str += '\n';
		str += '<a href="' + document.URL + '"' + ' title="' + PageTitle + '"' + ' target="_self" class="return">戻る</a>' + '\n';
	 	str += '\n';
	 	str += '<div class="signature">\n';
	 	str += '\t' + define.Signature + '\n';
	 	str += '</div>\n';
	 	str += '\n';
		str += '</body>' + '\n';
		str += '</html>' + '\n';

		return str;
	}
}
// Class > end ----------------------------------------------------------------------------------------------------------------



// Function > start -----------------------------------------------------------------------------------------------------------
function boot() {
	if (Context.isSetting) {
		scriptOption(define.SettingPotision);
	} else {
		main();
	}
}

function scriptOption(_flag) {
	loadSetting(_flag);
	
	var option = new ApplicationOption();
	
	if (option.config) {
		var appset = new ApplicationSetting(_flag);
		appset.save(option.config);
	}
}

function loadSetting(_flag) {
	var appset = new ApplicationSetting(_flag);
	var data   = appset.load();

	if (data) {	// 同じフォルダに displayImageList.json が有る
		parseSetting(data);
	} else {	// 同じフォルダに displayImageList.json が無い or 読み込みエラー
		parseSetting(null);
	}
}

function parseSetting(_data) {
	var data = _data;
	var checkSetting = function(path, type, argument) {
			var obj  = null;
			var flag = true;
			var message = "";
			
			switch (type) {
				case "limitSize":
					if (typeof argument == "number" && (define.limitSizeMin < argument && argument < define.limitSizeMax)) {
						obj = argument;
					} else {
						obj = define.limitSize;
						flag = false;
						message = "limitSize";
					}
					break;
				case "thumbnail":
					if (typeof argument == "number" && (define.thumbnailMin < argument && argument < define.thumbnailMax)) {
						obj = argument;
					} else {
						obj = define.thumbnail;
						flag = false;
						message = "thumbnail";
					}
					break;
				case "tabPosition":
					if (typeof argument == "boolean") {
						obj = argument;
					} else {
						obj = define.tabPosition;
						flag = false;
						message = "tabPosition";
					}
					break;
				case "safety":
					if (typeof argument == "boolean") {
						obj = argument;
					} else {
						obj = define.safety;
						flag = false;
						message = "safety";
					}
					break;
				case "crossDdomain":
					if (typeof argument == "boolean") {
						obj = argument;
					} else {
						obj = define.crossDdomain;
						flag = false;
						message = "crossDdomain";
					}
					break;
				case "filteringList":
					if (typeof argument == "object" && (argument != null && argument.length > 0)) {
						obj = argument;
					} else {
						obj = define.filteringList;
						flag = false;
						message = "filteringList";
					}
					break;
				default:
					// 存在しない設定が渡されている
					flag = false;
					App.MsgBox(define.NotSettingValue, define.AlertTitle);
				break;
			};
			
			if (!flag) {
				if (path) {
					message = "設定ファイル（displayImageList.json）" + "\n" + message;
				} else {
					message = "スクリプト（displayImageList.js）" + "\n" + message;
				}
				
				App.MsgBox(message + define.AlertSetting, define.AlertTitle);
			}
			
			return obj;
		};
	
	if (data) {	// 設定ファイルから（displayImageList.json）
		config.limitSize     = checkSetting(true, "limitSize",     data.limitSize);
		config.thumbnail     = checkSetting(true, "thumbnail",     data.thumbnail);
		config.tabPosition   = checkSetting(true, "tabPosition",   data.tabPosition);
		config.safety        = checkSetting(true, "safety",        data.safety);
		config.crossDdomain  = checkSetting(true, "crossDdomain",  data.crossDdomain);
		config.filteringList = checkSetting(true, "filteringList", data.filteringList);
	} else {	// スクリプト中から（displayImageList.js）
		config.limitSize     = checkSetting(false, "limitSize",     config.limitSize);
		config.thumbnail     = checkSetting(false, "thumbnail",     config.thumbnail);
		config.tabPosition   = checkSetting(false, "tabPosition",   config.tabPosition);
		config.safety        = checkSetting(false, "safety",        config.safety);
		config.crossDdomain  = checkSetting(false, "crossDdomain",  config.crossDdomain);
		config.filteringList = checkSetting(false, "filteringList", config.filteringList);
	}
}

function main() {
	if (!App.tabCount) {
		App.beep();
		App.MsgBox(define.TabCountZero, define.AlertTitle);
	} else if (!document) {
		App.beep();
		App.MsgBox(define.NotGetDocument, define.AlertTitle);
	} else if (document.getElementsByTagName("body")[0] != null && document.getElementsByTagName("body")[0].id == define.BodyID) {
		// 二重読み込み時
		alert(define.ReloadPage);
	} else {
		loadSetting(define.SettingPotision);
		
		var image = new ExtractionImage(document, config.filteringList);
		var parse = new ParseHtml(image, config.filteringList);
		var mess  =  define.NotGetImage + "\n\n" + config.limitSize + "pix以下のサイズは取得していません。"
		
		if (parse.size) {
			var tab = null;
			
			if (config.tabPosition || App.getKeyState(define.PushKey)) {
				// 画像一覧を、｢新規タブ・非active・タブ追加位置アプリ準拠｣で作成
				tab = App.NewTab("about:blank", false, -1);
			} else {
				// 画像一覧を、現在のタブに上書き表示
				tab = CurrentTab;
			}
			
			tab.html = parse.html;
		} else {
			alert(mess);
		}
	}
}
// Function > end -------------------------------------------------------------------------------------------------------------



console.log("start");
boot();
console.log("end");

})(); //無名関数終了
