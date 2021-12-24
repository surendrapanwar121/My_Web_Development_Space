//  $("h1").css("color","red");
//  $('h1').click.css("color","green");
$("h1").addClass("greenAuto")

$("h1").click(function () {
    $("h1").css("color","grey");
})

$("button").click(function(){
    $("h1").css("color","red");
})

$("input").keydown(function(event){
    $("h1").html(event.key)
})
$("h1").on("mouseover",function(){
    $("h1").css("color","yellow");
    $("h1").html("Dirty Color")
})