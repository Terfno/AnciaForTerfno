function dohilite(tab,txt){
 if(!txt){
  return ;
 }
 txt=txt.replace(/( |　)+|(\r|\n)+/g," ");
 txt=txt.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,"");
 var s=txt.split(" ");
 for(i=0;i<s.length;++i){
  tab.cmdExec("add.hilite",s[i]);
 }
}

function main(){
 var txt = "";
 if(DataObject.text) {
  txt += DataObject.text;
 }
 var hostname=window.location.hostname;
 var prm = "";
 if (hostname){
  prm = "site:"+hostname+" ";
 }
 if (txt) {
  prm += txt;
 }
 var	activate=((Context.tabFlags&0x4)===0);
 var tab=App.createTab(Context.NewTabPosition,activate);
 if(tab){
  var sch = App.openSearch("Google検索.xml");
  if(sch){
   dohilite(tab,txt);
   tab.cmdExec("go", sch.buildUrl(prm));
  }
 }
}

main();