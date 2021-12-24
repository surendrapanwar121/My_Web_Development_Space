for (let index = 0; index < document.querySelectorAll(".drum").length ; index++) {
    document.querySelectorAll(".drum")[index].addEventListener("click",function handleClick(){
        var i = index%7+1;
        var str = 'sounds/tom-' + i + '.mp3';
        var audio = new Audio(str);
        audio.play();
        // console.log(this.innerHTML);
        // this.style.color = "white";
    });  
}
document.addEventListener("keydown",function handleClick(event){
    console.log(event.key);
    switch (event.key) {
        case 'w':
            var audio = new Audio("sounds/tom-1.mp3");
            audio.play();
            break;
    
        case 'a':
            var audio = new Audio("sounds/tom-2.mp3");
            audio.play();
            break;
    
        case 's':
            var audio = new Audio("sounds/tom-3.mp3");
            audio.play();
            break;
    
        case 'd':
            var audio = new Audio("sounds/tom-4.mp3");
            audio.play();
            break;
    
        case 'j':
            var audio = new Audio("sounds/tom-5.mp3");
            audio.play();
            break;
    
        case 'k':
            var audio = new Audio("sounds/tom-6.mp3");
            audio.play();
            break;
    
        case 'l':
            var audio = new Audio("sounds/tom-7.mp3");
            audio.play();
            break;
    
        default:
            break;
    }
    buttonAnimation(event.key);
});  


function buttonAnimation (currenKey){
    var activeButton = document.querySelector("."+currenKey);
    activeButton.classList.add("pressed");

    function dothat() {
        activeButton.classList.remove("pressed"); 
    }
    setTimeout(dothat,100);
}


// function handleClick(){
//     alert("I got clicked ");
// }
