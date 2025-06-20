const express = require("express");
const router = express.Router();
const { Promo, Menu } = require("../models"); // Pastikan tabel Menu dihubungkan untuk mendapatkan harga awal
const { Op } = require("sequelize");

router.post("/tambahPromo", async (req, res) => {
  const { id_menu, nama_promo, diskon, deskripsi } = req.body;

  try {
    // Ambil harga awal dari tabel Menu berdasarkan id_menu
    const menu = await Menu.findOne({ where: { id_menu: id_menu } });
    if (!menu) {
      return res
        .status(404)
        .json({ success: false, message: "Menu tidak ditemukan" });
    }

    // Periksa apakah promo sudah ada untuk menu ini
    const promo = await Promo.findOne({ where: { id_menu: id_menu } });
    if (promo) {
      return res
        .status(400)
        .json({ success: false, message: "Promo sudah ada untuk menu ini" });
    }

    const harga_awal = menu.harga; // Kolom harga di tabel Menu adalah `harga`

    // Hitung harga akhir berdasarkan diskon
    const potongan = (harga_awal * diskon) / 100;
    const harga_akhir = harga_awal - potongan;

    // Simpan promo ke database
    await Promo.create({
      id_menu: id_menu,
      nama_promo: nama_promo,
      diskon: diskon,
      deskripsi: deskripsi,
      harga_akhir: harga_akhir,
      potongan: potongan,
    });

    return res.json({ success: true, message: "Promo berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});


router.get("/tampilPromo/perId/:id",async(req,res)=>{
    const idPromo = req.params.id
    const daftarPromo = await Promo.findOne({
      where:{
        id: idPromo
    }})

    return res.json(daftarPromo)
});

router.get("/tampilPromo/All", async (req, res) => {
  const promoAll = await Promo.findAll({
    order: [["id", "ASC"]],
  });

  return res.json(promoAll);
});

router.delete("/hapusPromo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Periksa apakah menu dengan ID yang diberikan ada di database
    const promo = await Promo.findOne({
      where: {
        id: id,
      },
    });

    if (!promo) {
      return res.status(404).json({ error: "promo tidak ditemukan" });
    }

    // Hapus menu dari database
    await Promo.destroy({
      where: {
        id: id,
      },
    });

    return res.json({ success: true, message: "Promo berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
