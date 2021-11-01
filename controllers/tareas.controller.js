const { response, request } = require("express");
const Tarea = require("./../models/tarea.model");

const options = { new: true };

const tareasGet = async (req = request, res = response) => {
  const usuarioLogeado = req.usuario;

  const tareas = await Tarea.find({
    estado: true,
    correo: usuarioLogeado.correo,
  });

  res.status(200).json({tareas, usuarioLogeado});
};
const tareasGetById = async (req = request, res = response) => {
  const usuarioLogeado = req.usuario;

  const tarea = await Tarea.find({
    estado: true,
    correo: usuarioLogeado.correo,
    id: usuarioLogeado._id,
  });

  res.status(200).json(tarea);
};
const tareasPost = async (req = request, res = response) => {
  const { correo } = req.usuario;
  const { titulo, descripcion } = req.body;
  const tarea = new Tarea({ correo, titulo, descripcion });

  // Guardar en BD
  await tarea.save();

  res.json(tarea);
};
const tareasPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, correo, ...resto } = req.body;

  const tarea = await Tarea.findByIdAndUpdate(id, resto, options);

  res.json(tarea);
};
const tareasDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const tarea = await Tarea.findByIdAndUpdate(
    id,
    { estado: false },
    options
  );

  res.json(tarea);
};

module.exports = {
  tareasGet,
  tareasGetById,
  tareasPost,
  tareasPut,
  tareasDelete,
};
