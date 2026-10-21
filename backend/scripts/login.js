const db = require('../firebase')

async function login(req, res) {
    const { email, senha } = req.body;

    if(!email || !senha){
        return res.json(false)
    }
    const snap = await db.collection("users").where("email", "==", email).limit(1).get();
    
    if(snap.empty){
        return res.json(false)
    }

    const usuario = snap.docs[0].data();
    if(usuario.senha !== senha){
        return res.json(false)
    }

    res.json(true)
}

module.exports = login;