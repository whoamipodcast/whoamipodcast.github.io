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
    document.cookie = attribute + "=" + value + ";";
		this.refresh();
	}
	
	removeCookie(attribute){
    document.cookie = attribute + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
		this.refresh();
	}
	
	removeAllCookies(){
		for(var attribute in this.cookies){
			this.removeCookie(attribute);
		}
	}
	
	getCookie(attribute){
		return attribute in this.cookies ? this.cookies[attribute] : null;
	}
}