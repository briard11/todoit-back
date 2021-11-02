const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario.model");

const validarJWT = async (req = request, res = response, next) => {
  const auth = req.header("Authorization");
  if (!auth) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }

  try {
    const token = auth.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        msg: "No hay token en la peticion",
      });
    }
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVETEKEY);
    // Leer el usuario que corresponde al uid
    usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido",
      });
    }

    // Verificar si el uid no esta marcado como inactivo
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = { validarJWT };
