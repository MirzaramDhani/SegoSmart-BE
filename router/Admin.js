const express = require ("express")
const router = express.Router()
const {Admin} = require("../models")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


router.post("/Login",async(req,res)=>{
    const { username , password }=req.body
    try{

        if (!username)
            return res.json({error:"username kosong"});
    
        if(!password)
            return res.json({error:"password kosong"})
    
        const admin = await Admin.findOne({where:{username:username}})
        if(!admin)
            return res.json({error:"username atau password salah"})
    
        const isPasswordvalid = await bcrypt.compare(password,admin.password)
        if(!isPasswordvalid)
            return res.json({error:"username atau password salah"})
        
        const token = jwt.sign({id:admin.id,username:admin.username,role:"admin"},process.env.JWT_SECRET);
        return res.json({token})
    }catch(error){
        return res.status(400).json({error:error})
    }

})

router.get("/VerifyToken",async(req,res)=>{
    const token = req.headers['authorization']
    if(!token)
        return res.json({valid:false})

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const admin = await Admin.findOne({where:{username:decoded.username}})
        if(!admin)
            return res.json({valid:false})

        return res.json({valid:true})
    }catch(error){
        return res.json({valid:false, error: error})
    }
})

router.post("/TambahAdmin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validasi input
    if (!username) {
      return res.json({ error: "Username tidak boleh kosong" });
    }

    if (!password) {
      return res.json({ error: "Password tidak boleh kosong" });
    }

    // Cek apakah admin dengan username yang sama sudah ada
    const existingAdmin = await Admin.findOne({
      where: { username: username },
    });
    if (existingAdmin) {
      return res.json({ error: "Username sudah digunakan" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan admin baru ke dalam database
    const newAdmin = await Admin.create({
      username: username,
      password: hashedPassword,
    });

    return res.json({ message: "Admin berhasil ditambahkan", admin: newAdmin });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


module.exports = router