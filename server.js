const express = require('express');
const app = express();
const mysql = require('mysql');
const multer = require('multer');
require('dotenv').config();
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());


// Static folder to access uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

conn.connect(function (err) {
    if (err) {
        console.log('fail connection');
    } else {
        console.log('mysql is connected');
    }
});

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

// Test route
app.get('/test', function (req, res) {
    conn.query('SELECT * FROM user', function (err, result) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({
            server: 'is running',
            data: result
        });
    });
});

// ✅ Image upload route
app.post('/upload', upload.single('image'), function (req, res) {
        
    console.log(req)

    res.json({
        message: 'User and image uploaded successfully',
        data: {
            image: `/uploads/${req.file.originalname}`
        }
    });
    
});

// Start server
app.listen(process.env.PORT, function () {
    console.log('server is running');
});
