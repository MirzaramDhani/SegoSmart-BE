const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,"../client/public/images/menu");
    },
    filename: (req,file,cb) => {
        cb(null,file.originalname);
    }
});

const upload = multer({storage: storage});

router.post("/Menu",upload.single("gambar"),(req,res) =>{
    if (req.file){
        return res.json({
            message: "Gambar berhasil diupload", file: req.file
        })
    }
    else{
        return res.json({
            error: "Gagal mengupload gambar"
        })
    }
})

router.post("/Menu/deleteGambar", (req,res)=>{
    const fileUrl = req.body.fileUrl;
    const filePath = "../client/public/images/menu/" + fileUrl;
    fs.unlink(filePath, (err) =>{
        if (err){
            return res.json({error: "Gagal menghapus file"})
        }

        return res.json({message: "File berhasil dihapus"})
    })
})
module.exports = router