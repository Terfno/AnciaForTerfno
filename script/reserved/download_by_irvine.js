// download_by_irvine.js  version 20160212.0
// charset: UTF-8
// Irvineでリンクや画像をダウンロード

// based on download_by_irvine.htm version 20151121

/*
Copyright (C) 2012-2016 rentan at rentan.org

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* globals ActiveXObject, App, DataObject, activeDocument */


// 設定 ----------------------------------------------------------------------

var config = {
  // Punycode 変換を行うか
  punycode: true,

  // ftp:// で URL デコードを行うか
  decode_ftp_url: true,

  // *_action に指定できる値
  //  'imgonly': 画像をダウンロード
  //  'doc_url': 現在のページの URL をダウンロード
  //  'extract': ページ内の URL を抽出してダイアログ表示
  //  'auto': リンクまたは画像をダウンロード、なければ extract

  // Ctrl+Shift キー押し下げ時の動作
  ctrl_shift_action: 'extract',

  // Ctrl キー押し下げ時
  ctrl_action: 'doc_url',

  // Shift キー押し下げ時
  shift_action: 'imgonly',

  // キー押し下げなし
  normal_action: 'auto',


  // リファラを送信しないリンク元サイト
  no_referer: [
    'http://local.ptron/',
    /^http:\/\/([^.\/]+\.)?inoreader\.com\//
  ],


  // imgonly で無視する画像ファイル名
  ignore_img: [
    'blank.gif',
    'spacer.gif',
    'clear.gif'
  ]
};


// Punycode.js ---------------------------------------------------------------
// https://github.com/bestiejs/punycode.js
// 不要な関数の削除、サイズ縮小の加工をしてあります。

/*
Copyright Mathias Bynens <http://mathiasbynens.be/>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var punycode = null;
/* jshint ignore:start */
/*! http://mths.be/punycode v1.2.3 by @mathias */
punycode = (function(){
function e(o){throw RangeError(L[o])}
function n(o,e){for(var n=o.length;n--;)o[n]=e(o[n]);return o}
function t(o,e){return n(o.split(S),e).join(".")}
function r(o){for(var e,n,t=[],r=0,u=o.length;u>r;)e=o.charCodeAt(r++),e>=55296&&56319>=e&&u>r?(n=o.charCodeAt(r++),56320==(64512&n)?t.push(((1023&e)<<10)+(1023&n)+65536):(t.push(e),r--)):t.push(e);return t}
function f(o,e){return o+22+75*(26>o)-((0!=e)<<5)}
function c(o,e,n){var t=0;for(o=n?P(o/m):o>>1,o+=P(o/e);o>M*y>>1;t+=x)o=P(o/M);return P(t+(M+1)*o/(o+j))}
function d(o){var n,t,u,i,l,d,s,a,p,h,v,g,w,j,m,E=[];for(o=r(o),g=o.length,n=I,t=0,l=A,d=0;g>d;++d)v=o[d],128>v&&E.push(R(v));for(u=i=E.length,i&&E.push(F);g>u;){for(s=b,d=0;g>d;++d)v=o[d],v>=n&&s>v&&(s=v);for(w=u+1,s-n>P((b-t)/w)&&e("overflow"),t+=(s-n)*w,n=s,d=0;g>d;++d)if(v=o[d],n>v&&++t>b&&e("overflow"),v==n){for(a=t,p=x;h=l>=p?C:p>=l+y?y:p-l,!(h>a);p+=x)m=a-h,j=x-h,E.push(R(f(h+m%j,0))),a=P(m/j);E.push(R(f(a,0))),l=c(t,w,u==i),t=0,++u}++t,++n}return E.join("")}
function a(o){return t(o,function(o){return O.test(o)?"xn--"+d(o):o})}
var g,w,b=2147483647,x=36,C=1,y=26,j=38,m=700,A=72,I=128,F="-",E=/^xn--/,O=/[^ -~]/,S=/\x2E|\u3002|\uFF0E|\uFF61/g,L={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},M=x-C,P=Math.floor,R=String.fromCharCode;
return a; // toASCII()
})();
/* jshint ignore:end */


// Selection -----------------------------------------------------------------
// 選択範囲取得オブジェクト

// コンストラクタ
function Selection (doc) {
  this._doc = doc;
  var win = doc.parentWindow;

  this._hasGetSelection = !!win.getSelection;
  // this._hasGetSelection = false;

  if (this._hasGetSelection) {
    var sel = this._sel = win.getSelection ();
    this.isSelected = !sel.isCollapsed;

    // 選択範囲が非表示になっていれば、非選択状態として扱う
    if (this.isSelected) {
      if (this._isHidden (sel.anchorNode)) {
        this.isSelected = false;
      }
    }
  }
  else {
    this._range = doc.selection.createRange ();
    this.isSelected = (doc.selection.type === 'Text');
  }
}

Selection.prototype._isHidden = function (e) {
  var win = this._doc.parentWindow;

  if (e.nodeName === '#text') {
    e = e.parentNode;
  }

  try {
    for (;; e = e.parentNode) {
      if (win.getComputedStyle (e).display === 'none') {
        return true;
      }
    }
  }
  catch (ex) { }

  return false;
};

Selection.prototype.getNodes = function () {
  var div = this._doc.createElement ('div');

  if (this._hasGetSelection) {
    var nodes = this._sel.getRangeAt (0).cloneContents ();
    div.appendChild (nodes);
    return div;
  }

  // div を document に紐付けないまま innerHTML を設定しているので
  // 相対リンクが about:～ に化ける可能性がある。
  div.innerHTML = this._range.htmlText;
  return div;
};

Selection.prototype.getHtml = function () {
  if (this._hasGetSelection) {
    return this.getNodes ().innerHTML;
  }

  return this._range.htmlText;
};

Selection.prototype.getText = function () {
  if (this._hasGetSelection) {
    return this._sel.toString ();
  }

  return this._range.text;
};


// IrvineItemList ------------------------------------------------------------

// コンストラクタ
function IrvineItemList () {
  this.list_check = { };
  this.list = [ ];
  this.length = 0;
}

IrvineItemList.prototype.referer = true;
IrvineItemList.prototype.dialog = false;


IrvineItemList.prototype.config = {
  shiftJIS: false,
  encodePunycode: false,
  decodeFtpUrl: false
};

IrvineItemList.prototype.setConfig = function (cfg) {
  var config = IrvineItemList.prototype.config;

  for (var key in cfg) {
    if (cfg.hasOwnProperty (key)) {
      config [key] = cfg [key];
    }
  }
};


// URLエンコードされたパスをデコードする
IrvineItemList.prototype.decodePath = function (path) {
  try {
    return path.replace (/%([0-9a-f]{2})/ig, function (s, hex) {
      var c = parseInt ('0x' + hex);
      if (c < 0x20 || 0x7e < c) { //>
        throw 'not ascii character: ' + s;
      }
      return String.fromCharCode (c);
    });
  }
  catch (e) {
    return path;
  }
};


// ダウンロードする URL をリストに追加する
IrvineItemList.prototype.add = function (url) {
  // ttp:// tp:// → http://
  url = url.replace (/^(ttp|tp):\/\//, 'http://');

  if (!/^((http|https|ftp):\/\/([^@\/]*@)?)([^\/:]+)(.*)$/.test (url)) {
    // 非対応スキームまたはホスト名がない
    return false;
  }
  var head = RegExp.$1;
  var host = RegExp.$4;
  var tail = RegExp.$5;
  var scheme = RegExp.$2.toLowerCase ();

  // IDN なら Punycode 変換
  if (this.config.encodePunycode && /[^ -~]/.test (host)) {
    try {
      host = punycode (host);
    }
    catch (e) { }
  }

  // パス名に U+0080 以上の文字があれば %xx エンコードする
  // (ただし保存ファイル名は文字化けする)
  if (!this.config.shiftJIS && /[\u0080-\uffff]/.test (url)) {
    tail = encodeURI (decodeURI (tail));
  }
  else if (scheme === 'ftp' && this.config.decodeFtpUrl) {
    tail = this.decodePath (tail);
  }

  url = head + host + tail;

  if (url in this.list_check) {
    // 既に同じ URL が追加されている
    return false;
  }

  // 問題ないのでリストに追加
  this.list_check [url] = true;
  this.list.push (url);
  this.length = this.list.length;

  return true;
};

// リストの URL を Irvine にダウンロード登録する
IrvineItemList.prototype.sendToIrvine = function () {
  //var ref = (this.referer ? 'Referer あり' : 'Referer なし');
  //var dia = (this.dialog ? 'ダイアログ使用' : 'ダイアログなし');
  //alert (ref + '\n' + dia + '\n\n' + this.list.join ('\n'));

  if (!this.length) {
    return;
  }

  var irvine = new ActiveXObject ('Irvine.Api');
  if (!irvine) {
    alert ('Irvine が見つかりません。');
    return;
  }

  // カレントフォルダがごみ箱ならデフォルトに変更
  if (irvine.CurrentQueueFolder === '/Trash') {
    irvine.CurrentQueueFolder = '/Default';
  }

  var flag = this.dialog ? 1 : 0;

  if (this.referer) {
    // リファラあり
    var ref = external.menuArguments.document.URL.replace (/#.*$/, '');
    irvine.AddUrlAndReferer (this.list.join ('\n'), ref, flag);
    // api.txt の AddUrlAndReferer の解説には Flag…使用していません
    // とあるが、実際には Flag…[0:通常 1:選択]
  }
  else {
    // リファラなし
    irvine.AddUrl (this.list.join ('\n'), flag);
  }
};


// ---------------------------------------------------------------------------

// リファラを送信しないリンク元サイトか調べる
function referer_check () {
  var url = external.menuArguments.document.URL;

  // http:// 以外ならリファラを送信しない
  //  about:  file://  https:// など
  //
  //  https:// → https:// のリンクはリファラを送信するのが普通だが、
  //  現状では送信しない仕様とする。
  if (!/^http:\/\//.test (url)) {
    return false;
  }

  var noref = config.no_referer;
  var noref_len = noref.length;

  for (var i = 0; i < noref_len; ++i) { //>
    var s = noref [i];

    if (typeof s === 'string') {
      // 文字列なら先頭一致
      if (s === url.slice (0, s.length)) {
        return false;
      }
    }
    else if (s instanceof RegExp) {
      if (s.test (url)) {
        return false;
      }
    }
    else {
      alert ('no_referer の形式が違います。\n\n' + s.toString ());
    }
  }

  return true;
}


// タグの親を辿って <a> タグを探す
function get_parent_anchor (e) {
  while (e && e.tagName !== 'A') {
    e = e.parentNode;
  }
  return e;
}

// href（または指定された属性）の値を絶対 URL で取得
function get_abs_href (doc, e, atr) {
  if (typeof atr !== 'string') {
    atr = 'href';
  }

  // IE9 では不可
  // return e.getAttribute (atr, 4);

  var href = null;
  try {
    href = e [atr];
  }
  catch (ex) {
    return '';
  }

  var span = doc.createElement ('span');
  span.innerHTML = '<a href="' + href + '">';
  return span.firstChild.href;
}


// 選択範囲から取得したリンクに相対 URL が含まれていたか調べる
function is_broken_relative_link (links) {
  var links_len = links.length;
  for (var i = 0; i < links_len; ++i) { //>
    if (/^about:/.test (links.item (i).href)) {
      return true;
    }
  }

  return false;
}


// 選択範囲のリンクを取得（相対 URL の about: 化を回避）
function get_selected_links2 (doc, sel) {
  var div = doc.createElement ('div');

  // document に紐付けないと about:blank ゾーンとして扱われてしまうので、
  // タグを不可視にして一時的に document にぶら下げる
  div.style.display = 'none';
  doc.body.appendChild (div);

  div.innerHTML = sel.getHtml ();
  var links = div.getElementsByTagName ('a');

  // 参照前に切り離すとコレクションが空になるので、別の配列にコピーする
  var links2 = [ ];
  links2.item = function (n) { return this [n]; };

  var links_len = links.length;
  for (var i = 0; i < links_len; ++i) { //>
    var a = links.item (i);
    a.href = get_abs_href (doc, a);
    links2.push (a);
  }

  // ここまできたら切り離してよい
  doc.body.removeChild (div);

  return links2;
}


// テキスト中の URL を抽出する
function extract_url_from_text (text) {
  var url_re = /\b(http|https|ftp|ttp|tp):\/\/[\w\-]+(\.[\w\-]+)+(:\d+)?\/[\w\-!#$%&()*+,.\/:;=?@\[\]{}~]*/ig;

  var urls = text.match (url_re);

  if (urls) {
    // ttp、tp を http に修正
    var urls_len = urls.length;
    for (var i = 0; i < urls_len; ++i) { //>
      urls [i] = urls [i].replace (/^(ttp|tp):/i, 'http:');
    }
  }

  return urls;
}


// 選択範囲からリスト追加
function download_selected_link_or_text (doc, sel) {
  var list = new IrvineItemList ();

  var nodes = sel.getNodes ();
  var links = nodes.getElementsByTagName ('a');

  // about: から始まる URL があれば、相対 URL 対応のルーチンで取得し直す
  if (is_broken_relative_link (links)) {
    links = get_selected_links2 (doc, sel);
  }

  // 選択範囲にリンクあり → そのリンクをダウンロード
  var links_len = links.length;
  var i;
  if (links_len) {
    for (i = 0; i < links_len; ++i) { //>
      list.add (get_abs_href (doc, links.item (i)));
    }
    return list;
  }

  // 選択範囲にリンクなし → テキスト形式の URL を抽出する
  links = extract_url_from_text (sel.getText ());
  if (links) {
    links_len = links.length;
    for (i = 0; i < links_len; ++i) { //>
      list.add (links [i]);
    }

    list.referer = false;  // この場合はリファラなし
    return list;
  }

  // 選択範囲にはダウンロード出来そうなものが何もなかった
  return list;
}


// 無視する画像ファイル名か調べる
function is_ignore_img (url) {
  var f = url.replace (/[?#].*$/, '').replace (/^.*[\/]/, '').toLowerCase ();

  var ignore_img = config.ignore_img;
  for (var i = 0; i < ignore_img.length; ++i) { //>
    if (f === ignore_img [i].toLowerCase ()) {
      return true;
    }
  }

  return false;
}


// 画像をリスト追加
function download_img (doc, e) {
  var list = new IrvineItemList ();

  function add (url) {
    if (is_ignore_img (url)) {
      return false;
    }

    list.add (url);
    return true;
  }


  // <img src="..."> なら画像をダウンロード
  if (e.tagName === 'IMG') {
    if (add (get_abs_href (doc, e, 'src'))) {
      return list;
    }
  }

  // 背景画像を探す
  for (; e && e.nodeName !== 'HTML'; e = e.parentNode) {

    // スタイルシート
    if (/^url\(["']([^'"]+)['"]\)$/.test (e.currentStyle.backgroundImage)) {
      if (add (RegExp.$1)) {
        return list;
      }
    }

    // <body background="..."> など
    if (e.background) {
      // 絶対 URL 化する細工 ※相対URLでの動作未確認、ダメかも
      var div = doc.createElement ('div');
      div.innerHTML = '<a href="' + e.background +'"></a>';
      var a = div.getElementsByTagName ('a') [0];

      if (!add (get_abs_href (doc, a))) {
        return list;
      }
    }
  }

  // 画像がなかった
  alert ('画像リソースが見つかりません。');
  return list;
}


// <img useMap="～"> で指定された <map name="～"> を探す
function get_map (doc, img) {
  if (img.tagName === 'IMG' && /^#(.+)$/.test (img.useMap)) {
    var name = RegExp.$1;

    var elements = doc.getElementsByName (name) || [ ];
    for (var i = 0; i < elements.length; ++i) { //>
      if (elements [i].tagName === 'MAP') {
        return elements [i];
      }
    }
  }

  return null;
}


// イメージマップ内の全リンクとマップ画像をリスト追加
function download_imagemap (doc, e) {
  var list = new IrvineItemList ();

  var map = get_map (doc, e);
  if (map) {
    list.add (get_abs_href (doc, e, 'src'));

    var areas = map.getElementsByTagName ('area') || [ ];
    for (var i = 0; i < areas.length; ++i) { //>
      list.add (get_abs_href (doc, areas [i]));
    }

    if (list.length > 1) {
      // 有効な <area href="..."> があればダイアログ表示
      // なければ画像だけを直接ダウンロード
      list.dialog = true;
    }
  }

  return list;
}


// リンク先または画像をリスト追加（画像よりリンクを優先）
function download_link_or_img (doc, e) {
  var list = new IrvineItemList ();

  // 親に <a href="..."> があればリンク先をダウンロード
  var a = get_parent_anchor (e);
  if (a) {
    list.add (get_abs_href (doc, a));
    return list;
  }

  // <img useMap="..."> ならイメージマップ内のリンクをダウンロード
  var list2 = download_imagemap (doc, e);
  if (list2.length) {
    return list2;
  }

  // <img src="..."> なら画像をダウンロード
  if (e.tagName === 'IMG') {
    list.add (get_abs_href (doc, e, 'src'));
    return list;
  }

  // リンクも画像もなかった
  return list;
}


// ページ内の全リンクをリスト追加
function download_all_links (doc) {
  var list = new IrvineItemList ();
  list.dialog = true;  // ダイアログあり

  var links = doc.links;
  var links_len = links.length;
  for (var i = 0; i < links_len; ++i) { //>
    list.add (get_abs_href (doc, links.item (i)));
  }

  if (!list.length) {
    alert ('ページ内にリンクがありません。');
  }
  return list;
}


// ページの URL をリスト追加
function download_page_url () {
  var list = new IrvineItemList ();

  list.add (external.menuArguments.document.URL);
  list.referer = false;  // リファラなし

  return list;
}


// リンクまたは画像またはページ内の全リンクをリスト追加
function download_auto (doc, e) {
  // 右クリック位置のリンク先または画像をダウンロード
  var list = download_link_or_img (doc, e);
  if (list.length) {
    return list;
  }

  // リンクや画像でなければ、ページ内の URL を抽出してダイアログ表示
  return download_all_links (doc);
}


// 設定に従って各種動作
function do_action (doc, event, action) {
  var act = config [action + 'action'];

  function target_element () {
    var e = event.srcElement;
    if (e.nodeName === 'HTML' && e.parentNode.nodeName === '#document') {
      e = doc.body;
    }
    return e;
  }

  if (act === 'auto') {
    return download_auto (doc, target_element ());
  }
  if (act === 'imgonly') {
    // 画像をダウンロード
    return download_img (doc, target_element ());
  }
  if (act === 'doc_url') {
    // 現在のページの URL をダウンロード
    return download_page_url ();
  }
  if (act === 'extract') {
    // ページ内の URL を抽出してダイアログ表示
    return download_all_links (doc);
  }

  alert (action + ' の形式が違います。\n\n' + act.toString ());
  return new IrvineItemList ();
}


function main () {
  var event = external.menuArguments.event;
  var doc = external.menuArguments.document;

  var cfg = {
    shiftJIS: doc.charset === 'shift_jis',
    encodePunycode: config.punycode,
    decodeFtpUrl: config.decode_ftp_url
  };
  (new IrvineItemList ()).setConfig (cfg);

  var list;

  var sel = new Selection (doc);
  var selected = sel.isSelected;

  if (selected) {
    // 選択範囲あり

    // 選択範囲のリンクまたは URL テキストをダウンロード
    list = download_selected_link_or_text (doc, sel);

    if (!list.length) {
      var s = '選択範囲にリンクがありません。\nアクティブな要素をダウンロードしますか?';
      if (!confirm (s)) {
        return;
      }

      // 選択範囲なしの動作を実行する
      selected = false;
    }
  }

  if (!selected) {
    // 選択範囲なし

    // キー状態に従って実行
    var key = (event.ctrlKey ? 'ctrl_' : '') + (event.shiftKey ? 'shift_' : '');
    list = do_action (doc, event, key || 'normal_');
  }

  if (!list.length) {
    return;
  }

  // リファラを送らないリンク元サイトに該当するか調べる
  if (list.referer) {
    list.referer = referer_check ();
  }

  // Irvine へダウンロード登録
  list.sendToIrvine ();
}


//////////////////////////////// 以下、Ancia 用 ////////////////////////////////


// ダイアログ表示
function msgbox (message, type) {
  return App.MsgBox (message, 'download_by_irvine', type);
}

function alert (message) {
  return msgbox (message, 0x000);
}

function confirm (message) {
  return msgbox (message, 0x004) === 6;
}


// エレメント偽装
function createElement (tagName, atr) {
  var e = {
    tagName: tagName,
    nodeName: tagName,
    parentNode: null,
    getAttribute: function (atr, mode) { return this [atr]; }
  };

  for (var key in atr) {
    if (atr.hasOwnProperty (key)) {
      e [key] = atr [key];
    }
  }

  return e;
}


// external オブジェクト偽装
var external = (function () {
  var a = null;
  var se = null;

  if (DataObject.url) {
    se = a = createElement ('A', { href: DataObject.url });
  }

  if (DataObject.imageUrl) {
    se = createElement ('IMG', { src: DataObject.imageUrl, parentNode: a });
  }

  return {
    menuArguments: {
      document: activeDocument,
      event: {
        ctrlKey: App.getKeyState (0x11),
        shiftKey: App.getKeyState (0x10),
        srcElement: se || { nodeName: 'dummy' }
      }
    }
  };
}) ();

main ();


// EOF
