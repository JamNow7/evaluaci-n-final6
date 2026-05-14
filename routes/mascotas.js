const express = require("express");
  const router = express.Router();
  const {
    getMascotas,
    getAgregar,
    postAgregar,
    deleteByNombre,
    deleteByRut,
    getDetalle,
  } = require("../controllers/mascotasController");

  router.get("/", getMascotas);                                                                                                           
  router.get("/agregar", getAgregar);
  router.get("/detalle/:id", getDetalle);
  router.post("/agregar", postAgregar);                                                                                                   
  router.post("/eliminar/nombre/:nombre", deleteByNombre);
  router.post("/eliminar/rut/:rut", deleteByRut);

  module.exports = router;
  