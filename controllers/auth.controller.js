const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario.model");
const { response, request } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Correo / Password no son correctos - correo",
      });
    }

    // Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Correo / Password no son correctos - estado",
      });
    }

    // Verificar la clave
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Correo / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el admin",
    });
  }
};

const googleSignin = async (req, res = response) => {
  try {
    const { id_token } = req.body;
    const { correo, nombre, img } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });
    
    if (!usuario) {
      // Creacion
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };
      
      usuario = new Usuario(data);
      await usuario.save();
    }
    
    if (!usuario.estado) {
      res.status(401).json({ msg: "Hable con el admin, usuario bloqueado" });
    }

    // Generar el JWT
    const token = await generarJWT(usuario._id);

    res.json({
      msg: "todo ok",
      token
    });
  } catch (error) {
    res.status(400).json({ msg: "Token de Google no es valido" });
  }
};

module.exports = { login, googleSignin };
