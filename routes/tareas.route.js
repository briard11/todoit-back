const { Router } = require("express");
const { check } = require("express-validator");
const {
  tareasGet,
  tareasGetById,
  tareasPost,
  tareasPut,
  tareasDelete,
  tareasCompleted,
} = require("../controllers/tareas.controller");

const {
  esRoleValido,
  existeTareaPorId,
} = require("../helpers/db-validators");

// Middlewares
const {
  validarCampos,
  validarJWT,
} = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/tareas/
 */

//Obtener todas la tareas - publico
router.get("/", [validarJWT, validarCampos], tareasGet);

//Obtener una tarea por id - publico
router.get("/:id", [validarJWT, validarCampos], tareasGetById);

//Crear tarea - privado - cualquier persona con un token valido
router.post("/", [validarJWT, validarCampos], tareasPost);

//Actualizar tarea - privado - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeTareaPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  tareasPut
);

//Borrar tarea - privado - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeTareaPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  tareasDelete
);

module.exports = router;
