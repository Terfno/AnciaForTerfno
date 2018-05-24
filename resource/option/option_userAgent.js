// user agent list
var l_userAgents=[
	"<Tridentのユーザエージェントを使用>"
	,"Mozilla/4.0 (compatible; MSIE 5.0; Windows NT)"
	,"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.0)"
	,"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)"
	,"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)"
	,"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/5.0)"
	,"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)"
	,"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
	,"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)"
	,"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.4) Gecko/20100611 Firefox/3.6.4"
	,"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.99 Safari/533.4"
	,"Opera/9.80 (Windows NT 6.1; U; ja) Presto/2.6.30 Version/10.60"
	,"Java/1.6.0_10"
	,"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
	,"msnbot/2.0b (+http://search.msn.com/msnbot.htm)"
	,"Hatena Antenna/0.5 (http://a.hatena.ne.jp/help)"
	,"Mozilla/4.0 (Compatible; MSIE 6.0; Windows NT 5.1 T-01A_6.5; Windows Phone 6.5)"
	,"Mozilla/5.0 (Linux; U; Android 2.1; en-us; sdk Build/ERD79) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17"
	,"Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_1_3 like Mac OS X; ja-jp) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7E18 Safari/528.16"
	,"Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7"
	,"Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10"
	,"BlackBerry9000/4.6.0.224 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/220"
];
function refreshUserAgent(userAgents){
	var	v=document.userAgentList.v;
	v.options.length=userAgents.length;
	var	userAgent=g_setting.userAgent;
	for(var i=0;i<userAgents.length;++i) {
		v.options[i].value=i;
		v.options[i].text=userAgents[i];
		if(userAgent===userAgents[i]) {
			v.selectedIndex=i;
		}
	}
	if(!userAgent){
		userAgent=userAgents[0];
		v.options[0].selected=true;
	}
	document.userAgent.v.value=userAgent;
}
function userAgentChange(){
	var idx=document.userAgentList.v.selectedIndex;
	document.userAgent.v.value=document.userAgentList.v.options[idx].text;
}
(function(){refreshUserAgent(l_userAgents);})();