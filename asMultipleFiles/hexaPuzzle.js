YELLOW = 0;
RED = 1;
BLUE = 2;
GREEN = 3;
COLORS = ["#FFFF00", "#FF0000", "#0000FF", "#00EE00"];

/*function indexOf(list, element) {
    for(var i=0; i<list.length; i++){
        if(list[i] === element){
            return i;
        }
    }
    
    return null;
};*/

var cookiesHelper = new CookiesHelper();
var canvas = document.getElementById("myCanvas");
var game = new Game(cookiesHelper, canvas);
var ta = document.getElementById("box");