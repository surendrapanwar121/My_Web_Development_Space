var p1 = Math.random()*6;
p1 = Math.floor(p1)+1;

var p2 = Math.random()*6;
p2 = Math.floor(p2)+1;

var img1= "images/dice" + p1 + ".png";
var img2= "images/dice" + p2 + ".png";

document.querySelectorAll("img")[0].setAttribute("src",img1);
document.querySelectorAll("img")[1].setAttribute("src",img2);

if(p1>p2){
    document.querySelector("h1").innerHTML = "Player 1 Wins !";
}
else if(p1<p2){
    document.querySelector("h1").innerHTML = "Player 2 Wins !";
}
else{
    document.querySelector("h1").innerHTML = "Nobody Wins !";
}
