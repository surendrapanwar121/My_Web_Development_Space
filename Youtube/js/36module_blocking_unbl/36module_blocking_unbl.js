// Synchronous or Blocking  ---- line by line execution
// EXAMPLE-
const fs=require("fs");
let text = fs.readFileSync("text.txt","utf-8");
console.log(text);
console.log("Above Paragraph, Is Content Of File text.txt ");
text = text.replace("Hello ","Hello ,")
fs.writeFileSync("newtext.txt",text);
console.log();

// Asynchronous or Unblocking  ---- line by line execution not guranteed
// Callback will Fire..   
//  EXAMPLE-
fs.readFile("newtext.txt","utf-8",(err,data)=>{
    console.log(data);
});
console.log("Above Paragraph, Is Content Of File newtext.txt ");


