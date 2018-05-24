/////////////////////////////////////////////////////////////////////////////////////
//
function imagePanning_getSettingPath(){
	return getFSO().BuildPath(getSettingDirPath(),"ImagePanning.json");
}
var	s_defImagePanningSetting=
{
	 imgPanning:true
	,Ctrl:false
	,Shift:false
}
,s_imagePanningSetting=common_deepCopy(s_defImagePanningSetting)
,s_imagePanningIdx;
function _ImagePanningSettingIsDefault(s){
	for(var v in s_defImagePanningSetting){
		if(s_defImagePanningSetting[v]!==s[v]){
			return false;
		}
	}
	return true;
}
function _GetImagePanningSelectIndex(s){
	var	idx=1;
	if(!s.imgPanning){
		idx=0;
	}else{
		if(s.Ctrl&&s.Shift){
			idx=4;
		}else{
			if(s.Ctrl){
				idx=2;
			}
			if(s.Shift){
				idx=3;
			}
		}
	}
	return idx;
}
function _SetImagePanningSetting(s){
	var	idx=getCheckedIdx(document.imagePanning.v, 1);
	if(0===idx){
		s.imgPanning=false;
		s.Ctrl=false;
		s.Shift=false;
	}else{
		s.imgPanning=true;
		if(1===idx){
			s.Ctrl=false;
			s.Shift=false;
		}else if(2===idx){
			s.Ctrl=true;
			s.Shift=false;
		}else if(3===idx){
			s.Ctrl=false;
			s.Shift=true;
		}else if(4===idx){
			s.Ctrl=true;
			s.Shift=true;
		}
	}
	return idx;
}
function _refreshImagePanningSetting(){
	var	path=imagePanning_getSettingPath();
	var	setting=parseJsonFile(path);
	if(setting){
		s_imagePanningSetting=setting;
	}
	var	idx=_GetImagePanningSelectIndex(s_imagePanningSetting);
	document.imagePanning[idx].checked=true;
	s_imagePanningIdx=idx;
}
function imagePanning_save(){
	var	path=imagePanning_getSettingPath();
	var	idx=_SetImagePanningSetting(s_imagePanningSetting);
	if(!_ImagePanningSettingIsDefault(s_imagePanningSetting)){
		var	json=JSON.stringify(s_imagePanningSetting,undefined,"")
		writeUnicodeTextFile(path,json);
	}else{
		common_deleteFileKillError(path);
	}
	return idx!==s_imagePanningIdx;
}
(function(){_refreshImagePanningSetting();})();