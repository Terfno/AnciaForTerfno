function parseJson(data){
	var	ret=null;
	try{
		ret=JSON.parse(data);
	}catch(e){}
	if(!ret)ret=(new Function("return "+data))();
	return ret;
}
function regReadValues(shl,info){
	var	val=info.defValue;
	for(idx in info.keys){
		try{
			var regVal=shl.RegRead(info.keys[idx]);
			if(regVal&&(typeof regVal==="string")){
				val=regVal;
				break;
			}
		}catch(e){}
	}
	return val;
}
var g_regInfo={
	 HTML:		{	 keys:["HKCR\\htmlfile\\"]
					,defValue:"HTML ドキュメント"}
	,HTMLfn:	{	 keys:["HKCR\\htmlfile\\FriendlyTypeName","HKCR\\htmlfile\\"]
					,defValue:"HTML ドキュメント"}
	,MHTML:		{	 keys:["HKCR\\mhtmlfile\\"]
					,defValue:"MHTML ドキュメント"}
	,MHTMLfn:	{	 keys:["HKCR\\mhtmlfile\\FriendlyTypeName","HKCR\\mhtmlfile\\"]
					,defValue:"MHTML ドキュメント"}
	,SHTML:		{	 keys:[]
					,defValue:"SHTML ドキュメント"}
	,SVG:		{	 keys:["HKCR\\svgfile\\"]
					,defValue:"SVG ドキュメント"}
	,SVGfn:		{	 keys:["HKCR\\svgfile\\FriendlyTypeName","HKCR\\svgfile\\"]
					,defValue:"SVG ドキュメント"}
	,XHTML:		{	 keys:["HKCR\\xhtmlfile\\"]
					,defValue:"XHTML ドキュメント"}
	,XHTMLfn:	{	 keys:["HKCR\\xhtmlfile\\FriendlyTypeName","HKCR\\xhtmlfile\\"]
					,defValue:"XHTML ドキュメント"}
	,FTP:		{	 keys:["HKCR\\ftp\\"]
					,defValue:"File Transfer Protocol"}
	,FTPfn:		{	 keys:["HKCR\\ftp\\FriendlyTypeName","HKCR\\ftp\\"]
					,defValue:"URL:FTP プロトコル"}
	,HTTP:		{	 keys:["HKCR\\http\\"]
					,defValue:"HyperText Transfer Protocol"}
	,HTTPfn:	{	 keys:["HKCR\\http\\FriendlyTypeName","HKCR\\http\\"]
					,defValue:"URL:ハイパーテキスト転送プロトコル"}
	,HTTPS:		{	 keys:["HKCR\\https\\"]
					,defValue:"HyperText Transfer Protocol with Privacy"}
	,HTTPSfn:	{	 keys:["HKCR\\https\\FriendlyTypeName","HKCR\\https\\"]
					,defValue:"URL:保護されたハイパーテキスト転送プロトコル"}
	,URL:		{	 keys:["HKCR\\InternetShortcut\\"]
					,defValue:undefined}
	,URLftn:	{	 keys:["HKCR\\InternetShortcut\\FriendlyTypeName"]
					,defValue:"インターネット ショートカット"}
	,URLfd:		{	 keys:["HKCR\\InternetShortcut\\FullDetails"]
					,defValue:"prop:System.Link.TargetUrl;System.Rating;System.Link.Description;System.Link.Comment"}
	,URLit:		{	 keys:["HKCR\\InternetShortcut\\InfoTip"]
					,defValue:"prop:System.Link.TargetUrl;System.Rating;System.Link.Description;System.Link.Comment"}
	,URLpd:		{	 keys:["HKCR\\InternetShortcut\\PreviewDetails"]
					,defValue:"prop:System.Link.TargetUrl;System.Rating;System.History.VisitCount;System.History.DateChanged;System.Link.DateVisited;System.Link.Description;System.Link.Comment"}
	,URLicon:	{	 keys:["HKCR\\InternetShortcut\\DefaultIcon\\"]
					,defValue:"url.dll,0"}
	,URLclsid:	{	 keys:["HKCR\\InternetShortcut\\CLSID\\"]
					,defValue:"{FBF23B40-E3F0-101B-8488-00AA003E56F8}"}
};
var	g_strOpenWith=" で開く(&O)";
var	ATTR_NODELETE="noDelete,"
function checkEnv(args,reg){
	return (eval(args.sysVer+reg.sysVer)&&eval(args.ieVer+reg.ieVer));
}
function queryAttributes(reg,attr){
	return ((undefined!==reg.attributes)&&(reg.attributes.indexOf(attr)!==-1));
}
function getRegValueType(shl,value){
	var	strType;
	var	valType=typeof value;
	if(valType==="number")strType="REG_DWORD";
	else if(valType==="string"){
		// check expand string
		if(value.indexOf("%")!=-1){
			var	expanded=shl.ExpandEnvironmentStrings(value);
			if(expanded===value){
				strType="REG_SZ";
			}else{
				strType="REG_EXPAND_SZ";
			}
		}else{
			strType="REG_SZ";
		}
	}
	return strType;
}
// true: prevent write reg
// false: write reg
function checkPreventRegWriteByUsr(regInfo,value){
	return ((undefined!==regInfo)&&(undefined!==regInfo.fnCheck)&&!regInfo.fnCheck(value));
}
function writeReg(args,reg){
	var	ret=true;
	if(checkEnv(args,reg)){
		if(undefined!==reg.value||undefined!==reg.follow_value){
			var	value;
			var	regInfo;
			if(undefined==reg.value){
				regInfo=g_regInfo[reg.follow_value];
				value=regReadValues(args.shl,regInfo);
			}else{
				value=reg.value;
			}
			
			if(undefined!==value){
				// check write
				if(checkPreventRegWriteByUsr(regInfo,value)){
					WScript.Echo("check failed "+reg.key+" value: "+value);
				}else{
					var	strType=getRegValueType(args.shl,value);
					try{
						args.shl.RegWrite(reg.key,value,strType);
						WScript.Echo("writed "+reg.key+" "+strType+":"+value);
					}catch(e){
						ret=false;
						WScript.Echo("ERROR "+e.description+" "+reg.key+" "+value+" "+strType);
					}
				}
			}
		}
	}
	return ret;
}
function restoreValue(shl,reg){
	var	regInfo={keys:[reg.restoreFrom]};
	var	value=regReadValues(shl,regInfo);
	if(undefined!==value){
		var	strType=getRegValueType(shl,value);
		try{
			shl.RegWrite(reg.key,value,strType);
			WScript.Echo("restored "+reg.key+" "+strType+":"+value);
		}catch(e){
			// restore failed
			// ignore error
			WScript.Echo("ERROR restore failed :"+e.description+" "+reg.key+" "+value+" "+strType);
		}
	}
	return value;
}
function deleteReg(args,reg){
	if(checkEnv(args,reg)){
		// no delete check
		if(queryAttributes(reg,ATTR_NODELETE)){
			WScript.Echo("no delete "+reg.key);
		}else{
			
			// restore value
			if(undefined!==reg.restoreFrom&&undefined!==restoreValue(args.shl,reg)){
				// restored
			}else{
				try{
					args.shl.RegDelete(reg.key);
					WScript.Echo("deleted "+reg.key);
				}catch(e){
					WScript.Echo("ERROR "+e.description+" "+reg.key);
				}
			}
		}
	}
}
function regApp(args){
	var	fso=new ActiveXObject("Scripting.FileSystemObject");

	// exist file?
	if(args.regist&&!fso.FileExists(args.appPath)){
		WScript.Echo("File does not exist: "+args.appPath);
		return false;
	}
	var	shl=new ActiveXObject("WScript.Shell");
	args.shl=shl;
	
	// reg entry
	var	openCmd="\""+args.appPath+"\" \"%1\"";
	var	appName=args.appName;
	if(undefined===appName)appName=fso.GetBaseName(args.appPath);
	var	exeName=args.exeName;
	if(undefined===exeName)exeName=fso.GetFileName(args.appPath);
	var	keyBase="HKLM\\SOFTWARE\\Classes\\";
	var	usrBase="HKCU\\SOFTWARE\\Classes\\";
	var	capBase="SOFTWARE\\Clients\\StartMenuInternet\\"+exeName;
	var	appDetail=args.appDetail;
	if(undefined===appDetail)appDetail=appName;
	var	ret=true;
	var	urlCLSID=regReadValues(shl,g_regInfo["URLclsid"]);
	var	appHTM=appName+".HTM";
	var	appMHT=appName+".MHT";
	var	appSHT=appName+".SHT";
	var	appSVG=appName+".SVG";
	var	appURL=appName+".URL";
	var	appXHT=appName+".XHT";
	var	appFTP=appName+".FTP";
	var	appHTTP=appName+".HTTP";
	var	appHTTPS=appName+".HTTPS";
	var	fnIsAppName=function(v){return v.length&&v!==appName}
	var	fnIsAppHTM=function(v){return v.length&&v!==appHTM}
	var	fnIsAppMHT=function(v){return v.length&&v!==appMHT}
	var	fnIsAppSHT=function(v){return v.length&&v!==appSHT}
	g_regInfo["HTMusr"]={keys:[usrBase+".htm\\"],fnCheck:fnIsAppHTM};
	g_regInfo["HTMLusr"]={keys:[usrBase+".html\\"],fnCheck:fnIsAppHTM};
	g_regInfo["MHTusr"]={keys:[usrBase+".mht\\"],fnCheck:fnIsAppMHT};
	g_regInfo["MHTMLusr"]={keys:[usrBase+".mhtml\\"],fnCheck:fnIsAppMHT};
	g_regInfo["SHTMLusr"]={keys:[usrBase+".shtml\\"],fnCheck:fnIsAppSHT};
	g_regInfo["FTPusr"]={keys:[usrBase+"ftp\\shell\\"],fnCheck:fnIsAppName};
	g_regInfo["HTTPusr"]={keys:[usrBase+"http\\shell\\"],fnCheck:fnIsAppName};
	g_regInfo["HTTPSusr"]={keys:[usrBase+"https\\shell\\"],fnCheck:fnIsAppName}
	var	regs=[
	// .html
		 {sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTM+"\\",follow_value:"HTML"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTM+"\\FriendlyTypeName",follow_value:"HTMLfn"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTM+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTM+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTM+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appHTM+"\\",follow_value:"HTML"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appHTM+"\\FriendlyTypeName",follow_value:"HTMLfn"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appHTM+"\\shell\\",value:"open"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appHTM+"\\shell\\open\\",value:appName+g_strOpenWith}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appHTM+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appHTM+"\\.htmBackup",follow_value:"HTMusr"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appHTM+"\\.htmlBackup",follow_value:"HTMLusr"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+".htm\\",value:appHTM,restoreFrom:usrBase+appHTM+"\\.htmBackup"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+".html\\",value:appHTM,restoreFrom:usrBase+appHTM+"\\.htmlBackup"}
	// .mhtml
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appMHT+"\\",follow_value:"MHTML"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appMHT+"\\FriendlyTypeName",follow_value:"MHTMLfn"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appMHT+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appMHT+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appMHT+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appMHT+"\\",follow_value:"MHTML"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appMHT+"\\FriendlyTypeName",follow_value:"MHTMLfn"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appMHT+"\\shell\\",value:"open"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appMHT+"\\shell\\open\\",value:appName+g_strOpenWith}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appMHT+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appMHT+"\\.mhtBackup",follow_value:"MHTusr"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appMHT+"\\.mhtmlBackup",follow_value:"MHTMLusr"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+".mht\\",value:appMHT,restoreFrom:usrBase+appMHT+"\\.mhtBackup"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+".mhtml\\",value:appMHT,restoreFrom:usrBase+appMHT+"\\.mhtmlBackup"}
	// .shtml
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appSHT+"\\",follow_value:"SHTML"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appSHT+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appSHT+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appSHT+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appSHT+"\\",follow_value:"SHTML"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appSHT+"\\shell\\",value:"open"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appSHT+"\\shell\\open\\",value:appName+g_strOpenWith}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appSHT+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+appSHT+"\\.shtmlBackup",follow_value:"SHTMLusr"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+".shtml\\",value:appSHT,restoreFrom:usrBase+appSHT+"\\.shtmlBackup"}
	// .svg
		,{sysVer:">=6000",ieVer:">=9000",key:keyBase+appSVG+"\\",follow_value:"SVG"}
		,{sysVer:">=6000",ieVer:">=9000",key:keyBase+appSVG+"\\FriendlyTypeName",follow_value:"SVGfn"}
		,{sysVer:">=6000",ieVer:">=9000",key:keyBase+appSVG+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=9000",key:keyBase+appSVG+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=9000",key:keyBase+appSVG+"\\shell\\open\\command\\",value:openCmd}
	// .xhtml
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appXHT+"\\",follow_value:"XHTML"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appXHT+"\\FriendlyTypeName",follow_value:"XHTMLfn"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appXHT+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appXHT+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appXHT+"\\shell\\open\\command\\",value:openCmd}
	// .url
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\",follow_value:"URL"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\FriendlyTypeName",follow_value:"URLftn"}
		,{sysVer:">=7000",ieVer:">=   0",key:keyBase+appURL+"\\FullDetails",follow_value:"URLfd"}
		,{sysVer:">=7000",ieVer:">=   0",key:keyBase+appURL+"\\InfoTip",follow_value:"URLit"}
		,{sysVer:">=7000",ieVer:">=   0",key:keyBase+appURL+"\\PreviewDetails",follow_value:"URLpd"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\NeverShowExt",value:""}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\IsShortcut",value:""}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\EditFlags",value:0x2}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\DefaultIcon\\",follow_value:"URLicon"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\shell\\CLSID",follow_value:"URLclsid"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\ShellEx\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appURL+"\\ShellEx\\ContextMenuHandlers\\"}
		,{sysVer:">=7000",ieVer:">=   0",key:keyBase+appURL+"\\ShellEx\\ContextMenuHandlers\\"+urlCLSID+"\\",value:""}
		,{sysVer:">=7000",ieVer:">=   0",key:keyBase+appURL+"\\ShellEx\\IconHandler\\",follow_value:"URLclsid"}
		,{sysVer:">=7000",ieVer:">=   0",key:keyBase+appURL+"\\ShellEx\\PropertySheetHandlers\\"}
		,{sysVer:">=7000",ieVer:">=   0",key:keyBase+appURL+"\\ShellEx\\PropertySheetHandlers\\"+urlCLSID+"\\",value:""}
	// FTP protocol
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appFTP+"\\",follow_value:"FTP"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appFTP+"\\FriendlyTypeName",follow_value:"FTPfn"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appFTP+"\\EditFlags",value:0x2}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appFTP+"\\URL Protocol",value:""}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appFTP+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appFTP+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appFTP+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"ftp\\",follow_value:"FTP"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"ftp\\shell\\"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"ftp\\shell\\"+appName+"\\ShellBackup",follow_value:"FTPusr"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"ftp\\shell\\"+appName+"\\",value:appName+g_strOpenWith}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"ftp\\shell\\",value:appName,restoreFrom:usrBase+"ftp\\shell\\"+appName+"\\ShellBackup"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"ftp\\shell\\"+appName+"\\command\\",value:openCmd}
	// HTTP protocol
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTP+"\\",follow_value:"HTTP"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTP+"\\FriendlyTypeName",follow_value:"HTTPfn"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTP+"\\EditFlags",value:0x2}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTP+"\\URL Protocol",value:""}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTP+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTP+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTP+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"http\\",follow_value:"HTTP"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"http\\shell\\"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"http\\shell\\"+appName+"\\ShellBackup",follow_value:"HTTPusr"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"http\\shell\\"+appName+"\\",value:appName+g_strOpenWith}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"http\\shell\\",value:appName,restoreFrom:usrBase+"http\\shell\\"+appName+"\\ShellBackup"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"http\\shell\\"+appName+"\\command\\",value:openCmd}
	// HTTPS protocol
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTPS+"\\",follow_value:"HTTPS"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTPS+"\\FriendlyTypeName",follow_value:"HTTPSfn"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTPS+"\\EditFlags",value:0x2}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTPS+"\\URL Protocol",value:""}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTPS+"\\shell\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTPS+"\\shell\\open\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:keyBase+appHTTPS+"\\shell\\open\\command\\",value:openCmd}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"https\\",follow_value:"HTTPS"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"https\\shell\\"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"https\\shell\\"+appName+"\\ShellBackup",follow_value:"HTTPSusr"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"https\\shell\\"+appName+"\\",value:appName+g_strOpenWith}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"https\\shell\\",value:appName,restoreFrom:usrBase+"https\\shell\\"+appName+"\\ShellBackup"}
		,{sysVer:"==5000",ieVer:">=   0",key:usrBase+"https\\shell\\"+appName+"\\command\\",value:openCmd}
	// registered applications
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\SOFTWARE\\RegisteredApplications\\"+appName,value:capBase+"\\Capabilities"}
	// capabilities
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\",value:appName}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\ApplicationDescription",value:appDetail}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\ApplicationName",value:appName}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.htm",value:appHTM}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.html",value:appHTM}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.mht",value:appMHT}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.mhtml",value:appMHT}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.shtml",value:appSHT}
		,{sysVer:">=6000",ieVer:">=9000",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.svg",value:appSVG}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.url",value:appURL}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.xht",value:appXHT}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\FileAssociations\\.xhtml",value:appXHT}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\Startmenu\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\Startmenu\\StartmenuInternet",value:exeName}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\UrlAssociations\\"}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\UrlAssociations\\ftp",value:appFTP}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\UrlAssociations\\http",value:appHTTP}
		,{sysVer:">=6000",ieVer:">=   0",key:"HKLM\\"+capBase+"\\Capabilities\\UrlAssociations\\https",value:appHTTPS}
	];
	if(args.regist){
		for(idx in regs){
			var	reg=regs[idx];
			if(reg&&!writeReg(args,reg)){
				ret=false;
				break;
			}
		}
		if(ret){
			WScript.Echo("");
			WScript.Echo("writed end");
		}
	}
	if(!args.regist||(args.regist&&!ret)){
		for(i=regs.length-1;i>=0;--i){
			deleteReg(args,regs[i]);
		}
		WScript.Echo("");
		WScript.Echo("deleted end");
	}
	return ret;
}
var args=parseJson(WScript.Arguments(0));
regApp(args);
