const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Gunakan memory storage untuk multer
const upload = multer({ storage: multer.memoryStorage() });

// Upload gambar ke Supabase
router.post("/Menu", upload.single("gambar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Tidak ada file yang diupload" });
  }

  const file = req.file;
  const fileName = file.originalname;
  const filePath = `menu/${fileName}`;

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    return res
      .status(500)
      .json({ error: "Gagal mengupload ke Supabase", detail: error });
  }

  const { data: publicUrl } = supabase.storage
    .from("uploads")
    .getPublicUrl(filePath);

  return res.json({
    message: "Gambar berhasil diupload",
    fileName: fileName,
    url: publicUrl.publicUrl,
  });
});

// Hapus gambar dari Supabase
router.post("/Menu/deleteGambar", async (req, res) => {
  const fileName = req.body.fileName;
  const filePath = `menu/${fileName}`;

  const { data, error } = await supabase.storage
    .from("uploads")
    .remove([filePath]);

  if (error) {
    return res
      .status(500)
      .json({ error: "Gagal menghapus gambar", detail: error });
  }

  return res.json({ message: "Gambar berhasil dihapus" });
});

module.exports = router;
