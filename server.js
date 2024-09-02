const express = require('express');
const app = express();
const mysql = require('mysql');

// const conn= mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'room_for_rent'
// })

// conn.connect(function(err){
//     if(err){
//         console.log('fail connection');
//     }
//     console.log('mysql is connection');
// })

app.get('/test',function(req,res){
    res.json({
        server:'is running'
    })
})

app.listen(3000,function(){
    console.log('server is running');
})