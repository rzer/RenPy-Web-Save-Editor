///// EDIT THIS LINES!
var key = "/home/web_user/.renpy/GameName-1234567/SaveName.save";
var content = "paste base64 save file here";
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
		file.contents = Base64Binary.decode(content);
		var r2 = os.put(file,key);
		
		r2.onerror = (e) =>{
			console.log("put error " + e.target.result);
		}
		
		r2.onsuccess = (e) =>{
			console.log("put success " +e.target.result);
		}
		
	}
	
	req.onerror = (e) =>{
		console.log(e.target.result);
	}
}

con.onerror = (e) =>{
	console.log("error " + e.target.result);
}

var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = (input.length/4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);
		
		return ab;
	},

	removePaddingChars: function(input){
		var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
		if(lkey == 64){
			return input.substring(0,input.length - 1);
		}
		return input;
	},

	decode: function (input, arrayBuffer) {
		//get last chars to see if are valid
		input = this.removePaddingChars(input);
		input = this.removePaddingChars(input);

		var bytes = parseInt((input.length / 4) * 3, 10);
		
		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;
		
		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);
		
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));
	
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
	
			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}
	
		return uarray;	
	}
}
