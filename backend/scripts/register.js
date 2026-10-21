
const db = require('../firebase');

async function register(req, res) {
    try {
        const { email, senha } = req.body;

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailValido) {
            return res.json(false);
        }

        await db.collection('users').add({
            email: email,
            senha: senha
        });

        return res.json(true);
    } catch (error) {
        console.error(error);
        return res.status(500).json(false);
    }
}

module.exports = register;
