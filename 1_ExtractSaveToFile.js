///// EDIT THIS LINES!
var key = "/home/web_user/.renpy/GameName-1234567/SaveName.save";
////////////////////////


var con = indexedDB.open("/home/web_user/.renpy");
con.onsuccess = (e)=>{
	var db = e.target.result;
	console.log(e.target.result);
	
	var transaction = db.transaction(["FILE_DATA"], "readwrite");
	var os = transaction.objectStore('FILE_DATA');
	var req = os.get(key);
	
	req.onsuccess = (e) =>{
		
		console.log(req.result);

		var file = req.result;
		downloadBlob(file.contents, 'extracted.save', 'application/octet-stream');
	}
	
	req.onerror = (e) =>{
		console.log(e.target.result);
	}
}

con.onerror = (e) =>{
	console.log("error " + e.target.result);
}

var downloadBlob, downloadURL;

downloadBlob = function(data, fileName, mimeType) {
  var blob, url;
  blob = new Blob([data], {
    type: mimeType
  });
  url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function() {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};

downloadURL = function(data, fileName) {
  var a;
  a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = 'display: none';
  a.click();
  a.remove();
};
