const express = require("express");
const router = express.Router();
const { ItemPesanan } = require("../models");
const { where } = require("sequelize");

router.post("/unggahitemriwayat", async(req,res)=>{
  const item= req.body
  await ItemPesanan.create(item)
  return res.json({succes:true})
})

router.get("/itemPesanan/:id", async (req, res) =>
{
  const id = req.params.id

  const items = await ItemPesanan.findAll({
    where: {
      id_riwayat: id
    },
  });

  return res.json(items)
})

module.exports=router
