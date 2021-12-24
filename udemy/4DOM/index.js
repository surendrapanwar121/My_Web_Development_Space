var p1 = Math.random()*6;
p1 = Math.floor(p1)+1;

var p2 = Math.random()*6;
p2 = Math.floor(p2)+1;

if(p1>p2){
    document.querySelector("h1").innerHTML = "Player One Wins";
}
else if(p1<p2){
    document.querySelector("h1").innerHTML = "Player Second Wins";
}
else{
    document.querySelector("h1").innerHTML = "Nobody Wins";
}

document.querySelector("#one").innerHTML = p1;
document.querySelector("#two").innerHTML = p2;