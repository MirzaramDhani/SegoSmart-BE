const express = require("express");
const router = express.Router();
const { Keranjang, Menu, Promo } = require("../models");
const Sequelize = require('sequelize')

router.post("/tambahKeranjang", async (req, res) => {
  try {
    const { id_menu, jumlah } = req.body;
    // Validasi input
    if (!id_menu || !jumlah || jumlah <= 0) {
      return res.json({ error: "Invalid input" });
    }

    // Ambil data menu
    const menu = await Menu.findOne({ where: { id_menu } });
    if (!menu) {
      return res.json({ error: "Menu not found" });
    }

    // Cari promo untuk menu tersebut (jika ada)
    const promo = await Promo.findOne({ where: { id_menu } });
    let diskonAkhir = 0;

    if (promo) {
      // Jika ada promo, gunakan potongan promo
      diskonAkhir = promo.diskon;
    }

    const subTotal = menu.harga * jumlah;

    const item = await Keranjang.findOne({ where: { id_menu: id_menu } });
    
    if (menu.stok > 0 && menu.stok >= jumlah) {
      await Menu.update(
        { stok: Sequelize.literal(`stok - 1`) },
        { where: { id_menu: id_menu } } // Pastikan kondisinya benar
      );
    } else {
      return res.json({ error: "Stok tidak cukup" });
    }
    if (item) {
      const totalsub = menu.harga * (item.jumlah + 1);
      await Keranjang.update(
        { jumlah: Sequelize.literal(`jumlah + 1`), sub_total: totalsub },
        { where: { id_menu: id_menu } }
      );

      return res.json({ message: "Item added to cart successfully" });
    } else {
      await Keranjang.create({
        id_menu,
        jumlah,
        sub_total: subTotal,
        diskon: diskonAkhir,
      });

      return res.json({ message: "Item added to cart successfully" });
    }
    
    // Tambahkan ke keranjang
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.json({ error: "Internal server error" });
  }
});

router.post("/kurangiKeranjang", async (req, res) => {
  try {
    const { id_menu } = req.body;

    if (!id_menu) {
      return res.json({ error: "Invalid input" });
    }

    const item = await Keranjang.findOne({ where: { id_menu } });
    if (!item) {
      return res.json({ error: "Item not found in cart" });
    }

    if (item.jumlah > 1) {
      const newTotal = item.sub_total - item.sub_total / item.jumlah;
      await Keranjang.update(
        { jumlah: Sequelize.literal(item.jumlah - 1), sub_total: newTotal },
        { where: { id_menu } }
      );
      await Menu.update(
        { stok: Sequelize.literal(`stok + 1`) },
        { where: { id_menu: id_menu } } // Pastikan kondisinya benar
      );
      return res.json({ message: "Item quantity decreased successfully" });
    } else {
      await Keranjang.destroy({ where: { id_menu } });
      await Menu.update(
        { stok: Sequelize.literal(`stok + ${item.jumlah}`) },
        { where: { id_menu: id_menu } } // Pastikan kondisinya benar
      );
      return res.json({ message: "Item removed from cart successfully" });
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.json({ error: "Internal server error" });
  }
});
router.post("/deleteAll", async (req, res) =>
{
  await Keranjang.destroy({where:{}})

  return res.json({success: true})
})

router.get("/tampilKeranjang", async (req, res) => {
  try {
    // Ambil data keranjang beserta menu terkait
    const keranjanglist = await Keranjang.findAll({
      order: [["id_menu", "ASC"]],
    });

    return res.json(keranjanglist);
  } catch (error) {
    res.json({ error: "Internal server error" });
  }
});

router.post("/hapusDariKeranjang", async (req, res) => {
  try {
    const { id_menu } = req.body;

    if (!id_menu) {
      return res.json({ error: "Invalid input" });
    }

    const item = await Keranjang.findOne({ where: { id_menu } });
    if (!item) {
      return res.json({ error: "Item not found in cart" });
    }

    await Menu.update(
      { stok: Sequelize.literal(`stok + ${item.jumlah}`) },
      { where: { id_menu: id_menu } } // Pastikan kondisinya benar
    );

    // Remove item from cart
    await Keranjang.destroy({ where: { id_menu } });
    return res.json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.json({ error: "Internal server error" });
  }
});

module.exports = router;
  