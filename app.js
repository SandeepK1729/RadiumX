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
    const process=spawn('python',['./vtcli.py',"https://www.facebook.com/"]);
    process.stdout.on('data',(data)=>{
        abc=data;
        result+=data.toString();
        const r1=result.slice(12,result.length-4);
        let resultarr=r1.split(", ");
        // console.log(resultarr);

        //used for storing key value pairs of different properties and their values
        let propValuesObj={};
        for(let i=1;i<resultarr.length;i=i+2)
        {
            let property=resultarr[i-1].slice(2,resultarr[i-1].length-1);
            resultarr[i]=resultarr[i].slice(0,resultarr[i].length-1);
            propValuesObj[resultarr[i-1].slice(2,resultarr[i-1].length-1)]=resultarr[i];
            // console.log(resultarr[i]);
        }
        console.log(propValuesObj);
        response.sendFile( __dirname + "/index.html");
    })
});