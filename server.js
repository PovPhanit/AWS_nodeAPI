require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const app = express();
const PORT = 3000;

// Setup multer to store uploaded files locally temporarily
const upload = multer({ dest: 'uploads/' });




// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  const filePath = req.file.path;
  const fileStream = fs.createReadStream(filePath);
  const fileName = req.file.originalname;
  try {
    const parallelUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
        ContentType: req.file.mimetype,
      }
    });
    parallelUpload.on('httpUploadProgress', (progress) => {
      console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    });
    await parallelUpload.done();
    fs.unlinkSync(filePath); // Remove local temp file
    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log(`✅ Uploaded to S3: ${s3Url}`);
    res.send({
    message: `✅ File '${fileName}' uploaded to S3`,
    url: s3Url
    });





  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).send('❌ Upload failed');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});



