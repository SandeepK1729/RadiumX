const express=require("express");
const app=new express();
const dotenv=require('dotenv');
dotenv.config();
const port=process.env.PORT || 3000;
app.use(express.static('public'));

const path=require("path");
app.use(express.json());
// given constant port if not working assgin with variable
app.listen(3000,()=>{
    console.log("Server is running at http://localhost:3000/");
});
app.get("/",(request,response)=>{
    // get url details 
    // like name etc
    // and then call procced to function
    var result = '';
    const spawn=require("child_process").spawn;
    const process=spawn('python',['./vtcli.py']);
    process.stdout.on('data',(data)=>{
        abc=data;
        result+=data.toString();
        console.log(result);
        response.sendFile( __dirname + "/index.html");
    })
});