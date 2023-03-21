const express=require("express");
const app=new express();
const dotenv=require('dotenv');
dotenv.config();
const port=process.env.PORT || 3000;
app.use(express.static('public'));

// let urlValue=document.getElementById("URLSubmitBTN").textContent;

//used for storing key value pairs of different properties and their values
let propValuesObj={};

const path=require("path");
app.use(express.json());
// given constant port if not working assgin with variable port
app.listen(3000,()=>{
    console.log("Server is running at http://localhost:3000/");
});
app.get('/',(request,response)=>{
    response.sendFile( __dirname + "/index.html");
});
app.get("/url",(request,response)=>{
    // get url details 
    // like name etc
    // and then call procced to function
    var result = '';
    propValuesObj={};
    const spawn=require("child_process").spawn;
    const process=spawn('python',['./vtcli.py',"https://www.facebook.com/"]);
    process.stdout.on('data',(data)=>{
        abc=data;
        // data will be in dictionary format as we are getting it from python
        // storing the data as string format
        result+=data.toString();
        const r1=result.slice(12,result.length-4);
        let resultarr=r1.split(", ");
        // console.log(resultarr);

        // propValueObj used for storing key value pairs of different properties and their values
        //
        // now converting the string into javascript Object format
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