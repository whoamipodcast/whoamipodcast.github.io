YELLOW = 0;
RED = 1;
BLUE = 2;
GREEN = 3;
COLORS = ["#FFFF00", "#FF0000", "#0000FF", "#00EE00"];

var cookiesHelper = new CookiesHelper();
var canvas = document.getElementById("myCanvas");
var game = new Game(cookiesHelper, canvas);
var ta = document.getElementById("box");