class CookiesHelper{
	constructor(){
		this.refresh();
	}
	
	refresh(){
		var pairs = decodeURIComponent(document.cookie).split(";");
    
    this.cookies = {};
    for(var i=0; i<pairs.length; i++){
			var pairString = pairs[i];
			var pair = pairString.split("=");
			if(pair[0] && pair[1]){
				this.cookies[pair[0].trim()] = pair[1].trim();
			}
    }
	}
	
	hasCookie(attribute){
		return attribute in this.cookies;
	}
	
	setCookie(attribute, value){
    //document.cookie = attribute + "=" + value + ";";
		
		var today = new Date();
		var expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000); // plus 30 days

		function setCookie(name, value)
		{
			document.cookie=name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
		}
	}
	
	removeCookie(attribute){
    document.cookie = attribute + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	}
	
	removeAllCookies(){
		for(var attribute of this.cookies){
			this.removeAllCookie(attribute);
		}
	}
	
	get(attribute){
		return attribute in this.cookies ? this.cookies[attribute] : null;
	}
}