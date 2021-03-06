var adTypeBinary=1;
var adTypeText =2;

var	boundary="----+*+----dc9620b338ea55c0----+*+----";

var gimgsearchurl="https://www.google.co.jp/searchbyimage/upload";
var	headerVal="multipart/form-data; boundary="+boundary;
var header="Content-Type";

function trace(t){
	//console.trace(t);
}
function buildPart(name,value){
	var	ret="";
	ret+="--"+boundary+"\r\n";
	ret+='Content-Disposition: form-data; name="'+name+'"\r\n';
	ret+="\r\n";
	ret+=value;
	ret+="\r\n";
	//ret += endBoundary;
	return ret;
}
function buildPartHeader(name){
	var	ret="";
	ret += "--"+boundary+"\r\n";
	ret += 'Content-Disposition: form-data; name="'+name+'"\r\n';
	ret += "\r\n";
	return ret;
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

/*
function httpPost(postData){
	var	obj=new ActiveXObject("Microsoft.XMLHTTP");
	obj.open("POST",gimgsearchurl,false);
	obj.setRequestHeader(header,headerVal);
	obj.send(postData);
}*/

function brzPost(postData){
	var	brz=CurrentTab.Browser;
	trace(typeof brz);
	brz.Navigate2(gimgsearchurl,1,0,postData,header+": "+headerVal);
}
function newTabPost(postData){
	var	tab=App.createTab();
	var	brz=tab.browser;
	brz.Navigate2(gimgsearchurl,0,0,postData,header+": "+headerVal);
}
function buildPostData(path){
	var	imgData=readFileAsBin(path);
	var	postData;

	// build post param
	var stm=new ActiveXObject("ADODB.Stream");
	stm.Charset="UTF-8";
	stm.Open();
	var	part=buildPartHeader("encoded_image");
	writeData(stm,adTypeText, part);
	writeData(stm,adTypeBinary,imgData);
	writeData(stm,adTypeText,"\r\n");
	writeData(stm,adTypeText,"--"+boundary+"--\r\n");
	var	postData=readDataAll(stm,adTypeBinary);
	stm.Close();

	return postData;
}
function imgSearchByFile(path){
	var	postData=buildPostData(path);
	//if (App.tabCount)brzPost(postData); else
	newTabPost(postData);
}
function imgSearch(imgUrl){
	var	url="http://images.google.co.jp/searchbyimage?image_url="+encodeURIComponent(imgUrl);
	App.CmdExec("go",url,-1,0x1);
}

// main
var	imgUrl=DataObject.imageUrl;
if (imgUrl){
	if ("file:///"===imgUrl.substr(0,8)){
		var	path=decodeURIComponent(imgUrl);
		path=path.substr(8);
		imgSearchByFile(path);
	}else{
		imgSearch(imgUrl);
	}
}else{
	var errMsg="イメージのURL取得に失敗しました。";
	App.MsgBox(errMsg,"searchImageByGoogle",0x10);
}
