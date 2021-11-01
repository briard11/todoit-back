const { Schema, model } = require("mongoose");

const TareaSchema = Schema({
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
  },
  titulo: {
    type: String,
    required: [true, "El titulo es obligatorio"],
  },
  descripcion: {
    type: String,
  },
  estadoTarea: {
    type: Boolean,
    default: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("Tarea", TareaSchema);
