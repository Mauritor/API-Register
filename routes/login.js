const router = require('express').Router();
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// constraseña
const bcrypt = require('bcrypt');

// validation
const Joi = require('@hapi/joi');

const schemaLogin = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

router.post('/login', async (req, res) => {
    // validaciones
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'contraseña no válida' })

    // create token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    },
        process.env.TOKEN_SECRET,
        { expiresIn: '30d' }
    )

    res.header('auth-token', token).json({
        error: null,
        data: { token }
    })
    /*res.json({
        error: null,
        data: 'exito bienvenido',
        token: token
    })*/
})

module.exports = router