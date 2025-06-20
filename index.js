const express =require("express");
const app = express();
const cors = require ("cors");
require("dotenv").config()

app.use(express.json());
app.use(cors());

const adminRouter = require("./router/Admin")
const menuRouter = require("./router/Menu")
const promoRouter = require("./router/Promo")
const keranjangRouter = require("./router/Keranjang")
const uploadGambarRouter = require("./router/UploadGambar")
const itempesananRouter = require("./router/ItemPesanan")
const riwayatrouter = require("./router/Riwayat")


app.use("/Admin",adminRouter)
app.use("/Menu",menuRouter)
app.use("/Promo",promoRouter)
app.use("/Keranjang",keranjangRouter)
app.use("/uploadGambar",uploadGambarRouter)
app.use("/ItemPesanan", itempesananRouter)
app.use("/riwayat", riwayatrouter)


const db =require ("./models");

db.sequelize.sync().then(()=>
{
    app.listen(3001,()=>
        console.log("Run port 3001")
    )
}
)
