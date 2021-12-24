
//Alert For Approval
$(".btn3").click(function(){
    $(".warning").css("display","block");
    var user = $('.btn3').val();
    $("h4").html("Please Conform The Approval of "+user)
    var link = '/admin/approveDcPh/' + user;
    $('.btn1').attr('href',link);
})
//Alert For Rejection
$(".btn4").click(function(){
    $(".warning").css("display","block");
    var user = $('.btn4').val();
    $("h4").html("Please Conform The Deletion of "+user)
    var link = '/admin/rejectDcPh/' + user;
    $('.btn1').attr('href',link);
})

//Cancel Case
$(".btn2").click(function(){
    $(".warning").css("display","none");
})

