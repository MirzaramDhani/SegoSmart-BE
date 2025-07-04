const express = require("express");
const router = express.Router();
const { Menu } = require("../models");
const { Op } = require("sequelize");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

router.post("/tambahMenu",async(req,res)=>{
    const {nama_menu,kategori,deskripsi,gambar,harga,stok} = req.body
    const cekNama = await Menu.findOne({where :{
        nama_menu:nama_menu
    }})
    if(cekNama)
        return res.json({error:"Nama sudah dipakai"});

    const perKategori = await Menu.findAll({
        where:{
            kategori:kategori
        },
        order: [["id_menu","ASC"]],
        attributes:["id_menu"]
    })

    const frontId ={
        "makanan": "A",
        "minuman": "B",
        "paket"  : "C"
    }

    const hurufDepan = frontId[kategori]

    function generateId(perKategori, hurufDepan) {
      const angkaId = perKategori
        .map(item => parseInt(item.id_menu.slice(1), 10))
        .sort((a, b) => a - b);
    
      for (let i = 1; i <= angkaId.length + 1; i++) {
        if (!angkaId.includes(i)) {
          return `${hurufDepan}${i}`;
        }
      }
    }
    
    const idBaru = generateId(perKategori, hurufDepan)

    await Menu.create({
        id_menu:idBaru,
        nama_menu: nama_menu,
        kategori: kategori,
        deskripsi: deskripsi,
        gambar: gambar,
        harga: harga,
        stok: stok
    })
    
    return res.json({success: true})

    
})
router.post("/editMenu", async (req, res) => {
  const { id_menu, nama_menu, harga, stok, deskripsi, gambar } =
    req.body;

  try {
    // Validasi input
    if (!id_menu || !nama_menu || !harga || !deskripsi) {
      return res.json({ error: "Semua field wajib diisi!" });
    }

    // Periksa apakah menu dengan id_menu ada
    const menu = await Menu.findOne({ where: { id_menu } });
    if (!menu) {
      return res.json({ error: "Menu tidak ditemukan!" });
    }
    // Update data menu
    await Menu.update(
      {
        nama_menu,
        harga,
        stok,
        deskripsi,
        gambar, // Opsional, jika tidak mengubah gambar, gunakan data lama
      },
      { where: { id_menu } }
    );

    return res.json({ message: "Menu berhasil diperbarui!" });
  } catch (error) {
    console.error("Error updating menu:", error);
    return res.json({ error: "Terjadi kesalahan server." });
  }
});

router.get("/tampilMenu/perKategori/:kategori",async(req,res)=>{
    const kategori = req.params.kategori
    const daftarMenu = await Menu.findAll({where:{
        kategori:kategori
    },order:[["nama_menu","ASC"]]})

    return res.json(daftarMenu)
})

router.get("/tampilMenu/perNama/:nama",async(req,res)=>{
    const namaMenu = req.params.nama
    const daftarMenu = await Menu.findAll({where:{
        nama_menu:{
            [Op.like]:`%${namaMenu}%`
        }
    },order:[["nama_menu","ASC"]]})

    return res.json(daftarMenu)
})
router.get("/tampilMenu/perID/:id",async(req,res)=>{
    const id = req.params.id
    const daftarMenu = await Menu.findAll({where:{
        id_menu:id
    }})

    return res.json(daftarMenu)
})
router.get("/tampilMenu/All",async(req,res)=>{
    const daftarMenu = await Menu.findAll({order:[["id_menu","ASC"]]})

    return res.json(daftarMenu)
})

router.get("/tampilMenu/Byid/:id_menu", async(req,res)=>{
    const id_menu = req.params.id_menu
    const menu = await Menu.findByPk(id_menu)
    return res.json(menu)
})

router.delete("/hapusMenu/:id_menu", async (req, res) => {
  try {
    const { id_menu } = req.params;

    // Cari menu
    const menu = await Menu.findOne({
      where: {
        id_menu: id_menu,
      },
    });

    if (!menu) {
      return res.status(404).json({ error: "Menu tidak ditemukan" });
    }

    const fullUrl = menu.gambar;
    const namaGambar = fullUrl.split("/").pop(); // hasil: nasigoreng.jpg

    // Hapus dari bucket
    const { error: deleteError } = await supabase.storage
      .from("uploads")
      .remove(["menu/" + namaGambar]);

    if (deleteError) {
      console.error("Gagal hapus gambar:", deleteError);
      // lanjut hapus menu, tapi beri warning
    }

    // Hapus dari DB
    await Menu.destroy({
      where: {
        id_menu: id_menu,
      },
    });

    return res.json({
      success: true,
      message: "Menu & gambar berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

module.exports = router