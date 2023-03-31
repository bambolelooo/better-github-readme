const DatauriParser = require('datauri/parser')
const cloudinary = require('cloudinary').v2
const express = require('express')
const multer = require('multer')
require('dotenv').config()

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const parser = new DatauriParser()

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        console.log('uploading')
        const fileDataUri = parser.format(
            '.' + req.file.originalname.split('.').pop(),
            req.file.buffer
        ).content

        const result = await cloudinary.uploader.upload(fileDataUri, {
            folder: 'BGR',
        })
        const { public_id, secure_url } = result
        const filename = public_id.split('/').pop() // Extract filename from public_id
        res.json({ filename, url: secure_url })
    } catch (error) {
        console.log(error)
        res.status(500).send('Error uploading image to Cloudinary')
    }
})

module.exports = router
