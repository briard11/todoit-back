const { response, request } = require("express");
const Tarea = require("./../models/tarea.model");

const options = { new: true };

const tareasGet = async (req = request, res = response) => {
  const usuarioLogeado = req.usuario;

  const tareas = await Tarea.find({
    estado: true,
    correo: usuarioLogeado.correo,
  });
  res.json(tareas);
};
const tareasGetById = async (req = request, res = response) => {
  const usuarioLogeado = req.usuario;
  const { id } = req.params;
  console.log(id + " hola");

  const tarea = await Tarea.findById(id,null,{estado: true, correo: usuarioLogeado.correo});
  console.log(tarea);
  res.json(tarea);
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
  const tarea = await Tarea.findByIdAndUpdate(id, { estado: false }, options);

  res.json(tarea);
};

module.exports = {
  tareasGet,
  tareasGetById,
  tareasPost,
  tareasPut,
  tareasDelete,
};
