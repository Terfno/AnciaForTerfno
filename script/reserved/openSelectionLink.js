// from openSelectionLink_r.js  (2012-08-29; rentan)
function getLinkInHtmlR(doc,html){
  var div = doc.createElement ('div');
  div.innerHTML = html;
  var links = div.getElementsByTagName ('a');
  var urls = [ ];
  var urls2 = { };

  for (var i = 0; i < links.length; ++i) {
    var lnk=links[i],href = lnk.href;
    if (href == '' || /^(javascript|ftp|mailto|telnet):/.test (href)) {
      continue;
    }

    // 同じ URL は無視する(重複して開かない)
    if (urls2 [href]) {
      continue;
    }
    urls2 [href] = true;

    // add url list
    var	urlInfo=App.createUrlInfo();
    urlInfo.url=href;
    if(lnk.innerText)urlInfo.title=lnk.innerText;
    urlInfo.tabGroupId=1;
    urls.push(urlInfo);
  }
  return urls;
}

var	html=DataObject.selectionHtml;
if(!html)html=DataObject.text;
if(html){
	var	urls=getLinkInHtmlR(activeDocument,html);
	if(urls.length){
		App.openTabList(urls,-1,0x04000000);
	}
}