var imgs=document.images;
for(i=0;i<imgs.length;++i){
	var	img=imgs[i],v={link:img.src},title="",width=img.width,height=img.height
		,sep=img.src.lastIndexOf("/"),filename;
	if(-1!==sep){
		filename=img.src.substring(sep+1);
	}

	if(img.alt){
		title=img.alt;
	}else{
		title=filename;
	}

	if(!width){
		width=img.getAttribute("width");
	}
	if(!height){
		height=img.getAttribute("height");
	}
	if(width&&height){
		title+=" ("+filename+": "+width+"×"+height+")";
	}
	v.title=title;
	Tool.addItem(v);
}