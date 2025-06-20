const express = require("express");
const router = express.Router();
const { Riwayat } = require("../models");
const { Op } = require("sequelize");

router.post("/unggahriwayat", async (req,res)=>{
  const riwayat = req.body
  const riwayatItem = await Riwayat.create(riwayat);

  return res.json({ succes: true, id: riwayatItem.id });
})

router.post("/unggahKepuasan", async (req, res) => {
  const { kepuasan } = req.body;

  try {
    // Temukan entri terakhir berdasarkan ID
    const riwayat = await Riwayat.findOne({
      order: [["id", "DESC"]], // Urutkan berdasarkan ID secara descending
      attributes: ["id"], // Hanya ambil ID untuk update
    });

    // Jika tidak ada entri yang ditemukan
    if (!riwayat) {
      return res
        .status(404)
        .json({ success: false, message: "Riwayat tidak ditemukan" });
    }

    // Perbarui nilai kepuasan
    await Riwayat.update(
      { kepuasan: kepuasan },
      { where: { id: riwayat.id } }
    );

    // Kembalikan respons sukses
    return res.json({ success: true });
  } catch (error) {
    console.error("Error updating kepuasan:", error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
});

router.get("/tampilRiwayat/All", async (req,res) => {
  const riwayats = await Riwayat.findAll({ order: [["createdAt", 'DESC']]});

  return res.json(riwayats)
})
router.get("/tampilRiwayat/filter/", async (req ,res) =>
{
  const { from, to } = req.query
  const newFrom = new Date(from);
  newFrom.setHours(0, 0, 1)
  
  const newTo = new Date(to);
  newTo.setHours(23, 59, 59)

  const riwayats = await Riwayat.findAll({
    where: {
      createdAt: { [Op.between]: [newFrom, newTo] },
    },
    order: [["createdAt", "DESC"]], // Order diletakkan di dalam objek findAll
  });
  
  return res.json(riwayats)
})

module.exports=router