const express = require('express');
const app = express();
const mysql = require('mysql');
require('dotenv').config();

const conn= mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT
})

conn.connect(function(err){
    if(err){
        console.log('fail connection');
    }
    console.log('mysql is connection');
})

app.get('/test',function(req,res){
    conn.query('select * from user',function(err,result){
        res.json({
            server:'is running',
            data:result
        })
    })
})

app.listen(process.env.PORT,function(){
    console.log('server is running');
})