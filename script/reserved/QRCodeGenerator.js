var url=DataObject.url;
if(!url)url=DataObject.text;
if(url)App.NewTab('https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl='+url);