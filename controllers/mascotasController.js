  const fs = require("fs/promises");                                                                                                      
  const path = require("path");
  const rootDir = require("../utils/path");                                                                                               
                  
  const mascotasPath = path.join(rootDir, "data", "mascotas.json");

  // Lee todas las mascotas del archivo JSON
  async function readMascotas() {                                                                                                         
    const data = await fs.readFile(mascotasPath, "utf-8");
    const mascotas = JSON.parse(data);                                                                                                    
    // Agregar ids si faltan
    return mascotas.map((mascota, index) => ({
      ...mascota,
      id: mascota.id !== undefined ? mascota.id : index
    }));
  }

                                                                                                                                          
  // Escribe las mascotas actualizadas al archivo JSON
  async function writeMascotas(mascotas) {
    await fs.writeFile(mascotasPath, JSON.stringify(mascotas, null, 2));
  }

  // GET sin parámetros: Retornar todas las mascotas
  // GET con parámetro nombre: Retornar la mascota con ese nombre
  // GET con parámetro rut: Retornar todas las mascotas asociadas a ese rut
  const getMascotas = async (req, res) => {
    const { nombre, rut } = req.query;                                                                                                    
   
    try {                                                                                                                                 
      const mascotas = await readMascotas();

      if (nombre) {
        // Filtrar por nombre
        const mascota = mascotas.find(m => m.nombre === nombre);
        if (mascota) {
          res.render("index", { mascotas: [mascota] });
        } else {
          res.render("index", { mascotas: [], mensaje: "No se encontró mascota con ese nombre" });
        }
      } else if (rut) {
        // Filtrar por RUT
        const mascotasFiltradas = mascotas.filter(m => m.rut === rut);
        res.render("index", { mascotas: mascotasFiltradas });                                                                             
      } else {
        // Retornar todas                                                                                                                 
        res.render("index", { mascotas });
      }
    } catch (err) {
      res.status(500).render("index", { error: "Error al leer el archivo" });
    }
  };

  // GET /agregar
  const getAgregar = (req, res) => {
    res.render("agregar");
  };

  // POST: Inserta una mascota
  const postAgregar = async (req, res) => {
    const { nombre, rut, edad, raza, direccion } = req.body;
                                                            
    if (!nombre || !rut) {
      return res.status(400).render("agregar", { error: "Nombre y RUT son obligatorios" });
    }                                                                                      
     
    try {
      const mascotas = await readMascotas();
      // Generar ID único (último ID + 1, o 0 si no hay mascotas)
      const ultimoId = mascotas.length > 0 ? Math.max(...mascotas.map(m => m.id)) : -1;
      const nuevaMascota = {                                                                                                              
        id: ultimoId + 1,   
        nombre,                                                                                                                           
        rut,      
        edad: edad || null,
        raza: raza || null,
        direccion: direccion || null
      };                            
      mascotas.push(nuevaMascota);
      await writeMascotas(mascotas);
      res.redirect("/");            
    } catch (err) {     
      res.status(500).render("agregar", { error: "Error al guardar" });
    }
  };                            
                                                                                                                                          
  // DELETE con parámetro nombre: elimina la mascota con ese nombre
  const deleteByNombre = async (req, res) => {
    const { nombre } = req.params;

    try {
      const mascotas = await readMascotas();
      const filtradas = mascotas.filter(m => m.nombre !== decodeURIComponent(nombre));
      await writeMascotas(filtradas);
      res.redirect("/");
    } catch (err) {
      const mascotas = await readMascotas().catch(() => []);
      res.status(500).render("index", { mascotas, error: "Error al eliminar mascota" });
    }
  };
                                                                                                                                          
  // DELETE con parámetro rut: elimina todas las mascotas asociadas a ese rut
  const deleteByRut = async (req, res) => {
    const { rut } = req.params;

    try {
      const mascotas = await readMascotas();
      const filtradas = mascotas.filter(m => m.rut !== decodeURIComponent(rut));
      await writeMascotas(filtradas);
      res.redirect("/");
    } catch (err) {
      const mascotas = await readMascotas().catch(() => []);
      res.status(500).render("index", { mascotas, error: "Error al eliminar mascotas del RUT" });
    }                                                                                                                                     
  };

  // GET /detalle/:id - Ver detalle de una mascota
  const getDetalle = async (req, res) => {
    const { id } = req.params;
    const index = parseInt(id, 10);
                                                                                                                                          
    if (isNaN(index)) {
      return res.status(400).render("no-encontrado");                                                                                     
    }             

    try {
      const mascotas = await readMascotas();
      const mascota = mascotas[index];

      if (!mascota) {
        return res.status(404).render("no-encontrado");
      }

      res.render("detalle", { mascota });
    } catch (err) {
      res.status(500).render("no-encontrado");
    }
  };

 
  module.exports = { getMascotas, getAgregar, postAgregar, deleteByNombre, deleteByRut, getDetalle };