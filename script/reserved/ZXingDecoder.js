// ZXingDecoder.js  (2012-05-28; rentan)
// charset: UTF-16(mod from UFT8 kurimoto 2012-07-01)
// support file protocol kurimoto 2013-12-29

var adTypeBinary=1;
var adTypeText =2;

var	boundary="---------------------------7dd2edf052e";

var postto="http://zxing.org/w/decode";
var	headerVal="multipart/form-data; boundary="+boundary;
var header="Content-Type";

function getExtention(path){
	var	pos=path.lastIndexOf(".");
	if(-1!==pos)return path.substring(pos);
	return false;
}
function getContentType(path){
	var ext=getExtention(path);
	if (ext){
		ext=ext.toLowerCase();
		var	map=[
		 {ext:".png",type:"image/png"}
		,{ext:".gif",type:"image/gif"}
		,{ext:".jpg",type:"image/jpeg"}
		,{ext:".jpeg",type:"image/jpeg"}
		,{ext:".bmp",type:"image/bmp"}
		];
		for(var i=0;i<map.length;++i){
			if(map[i].ext===ext)return map[i].type;
		}
	}
	return false;
}
function trace(t){
	//console.trace(t);
}
function readFileAsBin(path){
	var stm=new ActiveXObject("ADODB.Stream");
	stm.Open();
	stm.Type=adTypeBinary;
	trace(path);
	stm.LoadFromFile(path);
	var	content=stm.Read();
	stm.Close();
	trace(typeof content);
	return content;
}
function writeData(stm, type, data){
	if (stm.Type!=type){
		var pos=stm.Position;
		stm.Position=0;
		stm.Type=type;
		stm.Position=pos;
	}
	if (type===adTypeText){
		stm.WriteText(data);
		trace("text data writed:"+data);
	}else{
		stm.Write(data);
		trace("bin data writed");
	}
}
function readDataAll(stm,type){
	trace(type);
	stm.Position=0;
	stm.Type=type;
	// skip BOM 3 byte
	stm.Position=3;
	return stm.Read();
}
function newTabPost(postData){
	var	tab=App.createTab();
	var	brz=tab.browser;
	brz.Navigate2(postto,0,0,postData,header+": "+headerVal);
}
function buildPostData(path){
	var	imgData=readFileAsBin(path);
	var	postData;

	// build post param
	var stm=new ActiveXObject("ADODB.Stream");
	stm.Charset="UTF-8";
	stm.Open();
	var	part;
	var ext=getExtention(path);
	var contentType=getContentType(ext);
	if(!contentType){
		return undefined;
	}
	part="--"+boundary+"\r\n";
	part+='Content-Disposition: form-data; name="f"; filename="tmp'+ext+'"\r\n';
	part+='Content-Type: '+contentType+'\r\n\r\n';
	writeData(stm,adTypeText,part);
	writeData(stm,adTypeBinary,imgData);
	writeData(stm,adTypeText,"\r\n");
	writeData(stm,adTypeText,"--"+boundary+"--\r\n");
	var	postData=readDataAll(stm,adTypeBinary);
	stm.Close();

	return postData;
}
function decodeImgFile(path){
	var	postData=buildPostData(path);
	if (typeof postData!=='undefined'){
		newTabPost(postData);
	}else{
	    msgbox ('未サポートの画像: ファイル拡張子が.png .gif .jpeg .jpg .bmp以外です。');
	}
}

// ダイアログ表示
function msgbox (message) {
  App.MsgBox (message, 'バーコード復号');
}

function decodeImgUrl(img){
 if (!/^https?:\/\//.test (img)) {
   msgbox ('HTTP/HTTPS プロトコル以外の画像は復号できません。');
   return;
 }
  App.NewTab ('http://zxing.org/w/decode?u=' + escape (img) + '&full=true', true);
}

// main
var	url=DataObject.imageUrl;
if (url){
	if ("file:///"===url.substr(0,8)){
		var	path=decodeURIComponent(url);
		path=path.substr(8);
		decodeImgFile(path);
	}else{
		decodeImgUrl(url);
	}
}else{
    msgbox ('画像以外は復号できません。');
}
// EOF
