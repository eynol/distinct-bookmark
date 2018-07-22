
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


  while(list.length){
    var currentTag = list.shift();

    //process current tag
    if(currentTag.href){
      var url = currentTag.href;
      if(urlset.has(url)){
        log('removeing:',url);
        analystic(url)
        currentTag.remove()
      }else{
        urlset.add(url)
      }
    }


    // add children to list
    if(currentTag.children.length){
      list.push(...currentTag.children)
    }
  }

  setTimeout(function() {
    if(confirm('Donwload ProNew Bookmarks File?')){
      downloadFile(dom)
    }
    dom = null;
  }, 10);
  bookmarks.value = '';
}

var htmlResult = document.getElementById('htmlResult')
function log(...args){
  htmlResult.innerText+=args.join(' ')+'\n'
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
