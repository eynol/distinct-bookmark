
function whenFileSelect(e) {
  var file = e.target.files[0];
  console.log(file)
  if(!file)return;
  var fileReader = new FileReader();
  fileReader.onload = function(e){
    htmlResult.innerText = ''
    recieveText(fileReader.result);
  }
  fileReader.readAsText(file);



}
function recieveText(text){
  var domParser = new DOMParser();

  var dom = domParser.parseFromString(text,'text/html');
  domWalker(dom)
  dom = null;
}

function domWalker(dom){
  var list = [dom];
  var urlset = new Set();
  var eleToRemove = new Set();

  var querySet = dom.documentElement.querySelectorAll('dt');
  for(let i =0;i<querySet.length;i++){
    let currentTag = querySet[i];

    //process current tag
    let a_tag = currentTag.firstElementChild;
    if(a_tag && a_tag.href){
      var url = a_tag.href;
      if(urlset.has(url)){
        log('removeing:',url);
        analystic(url)
        eleToRemove.add(currentTag)
      }else{
        urlset.add(url)
      }
    }
  }
  querySet = null;

  for(let e of eleToRemove.values()){
    e.remove();
  }
  eleToRemove.clear();
  showlog();

  setTimeout(function() {
    if(confirm('Donwload Distinct Bookmarks File?')){
      downloadFile(dom)
    }
    dom = null;
  }, 10);
  if(console.table){
    console.table([...removeMap])
  }
  removeMap.clear();
  bookmarks.value = '';
}

var htmlResult = document.getElementById('htmlResult');
var results_arr = [];
function showlog(){
  htmlResult.innerText= results_arr.join('\n')
  results_arr = [];
}
function log(...args){
  results_arr.push(args.join(' '))
}

var removeMap = new Map();
function analystic(url){
  if(removeMap.has(url)){
    var count = removeMap.get(url);
    count+=1;
    removeMap.set(url,count);
  }else{
    removeMap.set(url,1);
  }
}


function downloadFile(dom){
  var fileToDownload = new Blob([dom.documentElement.innerHTML],{type:'text/html'}) ;
  var a = document.createElement('a');
  a.href = URL.createObjectURL(fileToDownload)
  a.style.display='none';
  a.download='BookMark'+getDate()+'.html';
  a.click();
}
function getDate(){
  var d = new Date()
  return d.toLocaleDateString();
}

bookmarks.addEventListener('change',whenFileSelect); 
