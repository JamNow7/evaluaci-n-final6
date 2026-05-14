const path = require("path");
  const express = require("express");
  const rootDir = require("../utils/path");
  const expressHbs = require("express-handlebars");
  const mascotasRoutes = require("../routes/mascotas");

  const app = express();

  // Configuración Handlebars
  app.engine(
    "handlebars",                                                                                                                         
    expressHbs.engine({
      extname: "handlebars",                                                                                                              
      defaultLayout: false,
      helpers: {
        encodeURIComponent: (str) => encodeURIComponent(str),
      },
    }),
  );
  app.set("view engine", "handlebars");
  app.set("views", path.join(rootDir, "views"));

  // Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(rootDir, "public")));

  // Rutas
  app.use("/", mascotasRoutes);

  // 404
  app.use((req, res) => {
    res.status(404).render("no-encontrado");
  });                                                                                                                                     
   
  app.listen(3002, () => {                                                                                                                
    console.log("Servidor escuchando en http://localhost:3002");
  });
