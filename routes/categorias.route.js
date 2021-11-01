const { Router } = require("express");
const { check } = require("express-validator");
const { categoriasGet, categoriasGetById, categoriasPost, categoriasPut, categoriasDelete } = require("../controllers/categorias.controller");

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
} = require("../helpers/db-validators");

// Middlewares
const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

const router = Router();

/**
 * {{url}}/api/categorias/
 */

//Obtener todas la categorias - publico
router.get("/", categoriasGet);

//Obtener una categoria por id - publico
router.get("/:id", categoriasGetById);

//Crear categoria - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    validarCampos,
  ],
  categoriasPost
);

//Actualizar categoria - privado - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  categoriasPut
);

//Borrar categoria - privado - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    check("rol").custom(esRoleValido),
    check("rol").custom(esAdminRole),
    validarCampos,
  ],
  categoriasDelete
);

module.exports = router;
