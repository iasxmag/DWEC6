const MODEL = Symbol("VideoSystemModel");
const VIEW = Symbol("VideoSystemView");

class VideoSystemController {
  constructor(modelVideoSystem, viewVideoSystem) {
    this[MODEL] = modelVideoSystem;
    this[VIEW] = viewVideoSystem;

    //almacenar ventanas abiertas para poder cerrarlas
    this.ventanasAbiertas = [];

    // inicializamos la vista
    this.onInit();
  }

  // Agrega un nuevo estado al historial del navegador
  #pushHistory(estado) {
    history.pushState(estado, "", `#${estado.tipo}`);
  }

  #restoreState(estado) {
    if (!estado) return;

    switch (estado.tipo) {
      case "inicio":
        this.handleInicio(false);   
        break;
      case "categoria":
        this.handleListaCategorias(estado.nombre, false);
        break;
      case "produccion":
        this.handleShowProduction(estado.titulo, false);
        break;
      case "actor":
        this.handleShowActor(estado.nombre, false);
        break;
      case "director":
        this.handleShowDirector(estado.nombre, false);
        break;
      case "actores":
        this.handleListaActores(false);
        break;
      case "directores":
        this.handleListaDirectores(false);
        break;
    }
  }


  handleInicio = (push = true) => {
    this[VIEW].mostrarCategorias(this[MODEL].categories);
    const randomizar = [...this[MODEL].productions].sort(() => 0.5 - Math.random()).slice(0, 3);
    this[VIEW].mostrarProducciones(randomizar);

    this[VIEW].bindProductsCategoryListInMenu(this.handleListaCategorias);
    this[VIEW].bindRandom(this.handleShowActor, this.handleShowDirector, this.handleShowProduction);
    this[VIEW].bindCentral(this.handleShowActor, this.handleShowDirector, this.handleListaCategorias);
    
    if (push) this.#pushHistory({ tipo: "inicio" });
  };


  handleListaCategorias = (nombreCategoria, push = true) => {
    const categoria = this[MODEL].createCategory(nombreCategoria);
    const producciones = this[MODEL].getProductionsCategory(categoria);

    //vaciar la zona central
    this[VIEW].centralCat.innerHTML = "";

    //ahora mostramos las producciones
    this[VIEW].mostrarProducciones(producciones);

    //activamos el evento para mostrar el detalle de la produccion
    this[VIEW].bindRandom(this.handleShowActor, this.handleShowDirector, this.handleShowProduction);

    if (push) this.#pushHistory({ tipo: "categoria", nombre: nombreCategoria });

  };

  handleShowProduction = (titulo, push = true) => {
    const producciones = [...this[MODEL].productions];
    const prod = producciones.find((p) => p.title === titulo);

    if (prod) {
      // Sacamos reparto y directores
      const actores = [...this[MODEL].getCast(prod)];

      const directores = [];
      for (let director of this[MODEL].directors) {
        const prods = [...this[MODEL].getProductionsDirector(director)];
        if (prods.find((p) => p.title === titulo)) {
          directores.push(director);
        }
      }
      this[VIEW].mostrarDetalleProduccion(prod, actores, directores);
      this[VIEW].bindRandom(this.handleShowActor, this.handleShowDirector, this.handleShowProduction);
    
      if (push) this.#pushHistory({ tipo: "produccion", titulo });
    }
  };

  handleListaActores = (push = true) => {
    const actores = [...this[MODEL].actors];
    this[VIEW].mostrarActores(actores);
    if (push) this.#pushHistory({ tipo: "actores" });
  };

  handleShowActor = (nombreCompleto, push = true) => {
    const actores = [...this[MODEL].actors];
    const actor = actores.find(
      (a) => `${a.name} ${a.lastname1}` === nombreCompleto,
    );
    if (actor) {
      const producciones = [...this[MODEL].getProductionsActor(actor)];
      this[VIEW].mostrarDetalleActor(actor, producciones);
      this[VIEW].bindRandom(this.handleShowActor, this.handleShowDirector, this.handleShowProduction);
    
      if (push) this.#pushHistory({ tipo: "actor", nombre: nombreCompleto });
    }
  };

  handleListaDirectores = (push = true) => {
    const directores = [...this[MODEL].directors];
    this[VIEW].mostrarDirectores(directores);
    if (push) this.#pushHistory({ tipo: "directores" });
  };

  handleShowDirector = (nombreCompleto, push = true) => {
    const directores = [...this[MODEL].directors];
    const director = directores.find(
      (d) => `${d.name} ${d.lastname1}` === nombreCompleto,
    );
    if (director) {
      const producciones = [...this[MODEL].getProductionsDirector(director)];
      this[VIEW].mostrarDetalleDirector(director, producciones);
      this[VIEW].bindRandom(this.handleShowActor, this.handleShowDirector, this.handleShowProduction);
      
      if (push) this.#pushHistory({ tipo: "director", nombre: nombreCompleto });
    }
  };

  //VENTANAS NUEVAS PARA PRODUCCONES, ACTORES Y DIRECTORES
  // Abre una nueva ventana con la ficha de una PRODUCCIÓN 
  handleOpenWindow = (titulo) => {
    const producciones = [...this[MODEL].productions];
    const prod = producciones.find((p) => p.title === titulo);
    
    if (prod) {
        const actores = [...this[MODEL].getCast(prod)];

        const directores = [];
        for (let director of this[MODEL].directors) {
            const prods = [...this[MODEL].getProductionsDirector(director)];
            if (prods.find((p) => p.title === titulo)) {
                directores.push(director);
            }
        }

        // Guardar la referencia de la ventana
        const ventana = this[VIEW].mostrarDetalleVentana(prod, actores, directores);
        this.ventanasAbiertas.push(ventana);
    }
  };

  // ACTOR
  handleOpenWindowActor = (nombreCompleto) => {
    const actores = [...this[MODEL].actors];
    const actor = actores.find(
      (a) => `${a.name} ${a.lastname1}` === nombreCompleto,
    );
    if (actor) {
        const producciones = [...this[MODEL].getProductionsActor(actor)];

        const ventana = this[VIEW].mostrarActorVentana(actor, [...producciones]);
        this.ventanasAbiertas.push(ventana);
    }
  };

  // Abre nueva ventana con ficha de DIRECTOR
  handleOpenWindowDirector = (nombreCompleto) => {
    const directores = [...this[MODEL].directors];
    const director = directores.find(
      (d) => `${d.name} ${d.lastname1}` === nombreCompleto,
    );
    if (director) {
        const producciones = [...this[MODEL].getProductionsDirector(director)];


        const ventana = this[VIEW].mostrarDirectorVentana(director, [...producciones]);
        this.ventanasAbiertas.push(ventana);
    }
  };

  // -----------FORMULARIOS------------------

  //FORMULARIO DE AÑADIR

  //handle para mostrar el formulario de añadir producción
  handleAddProd = () => {
    const cats = this[MODEL].categories;
    const dirs = this[MODEL].directors;
    const acts = this[MODEL].actors;

    // Llamamos a la vista
    this[VIEW].mostrarFormAdd(cats, dirs, acts);
    
    // Conectamos el botón de guardar
    this[VIEW].bindAddProduction(this.handleCreateProd);
  };

  //handle para crear la producción a partir de los datos del formulario
  handleCreateProd = (datos) => {
    try {
        // Crear produccion
        const nuevaProd = this[MODEL].createProduction(
            datos['crear-titulo'],          
            new Date(datos['crear-fecha']),
            Number(datos['crear-duracion']),
            datos['crear-sinopsis'] || ''  
        );

        //añadir al sistema la produccion nueva
        this[MODEL].addProduction(nuevaProd);

        //asignar el director
        const director = [...this[MODEL].directors].find(d => d.name === datos.selectDirector);
        if (director) this[MODEL].assignDirector(director, nuevaProd);

        //asignar el actor o actores
        if (datos.actores) {
            for (const nombreActor of datos.actores) {
                const actor = [...this[MODEL].actors].find(a => a.name === nombreActor);
                if (actor) this[MODEL].assignActor(actor, nuevaProd);
            }
        }

        //asignar la categoria
        const cat = [...this[MODEL].categories].find(c => c.name === datos.selectCategoria);
        if (cat) this[MODEL].assignCategory(cat, nuevaProd);

        alert('La producción "' + datos['crear-titulo'] + '" se ha añadido correctamente.');
        this.handleInicio();

    } catch (error) {
        alert('Error: ' + error.message);
    }
  };

  //FORMULARIO DE ELIMINAR

  //handle para mostrar el formulario de eliminar producción
  handleDeleteProd = () => {
      const prods = this[MODEL].productions;
      this[VIEW].mostrarFormDelete(prods);
      this[VIEW].bindDeleteProduction((datos) => this.handleConfirmDelete(datos));
  };

  //handle para eliminar la producción seleccionada en el formulario
  handleConfirmDelete = (datos) => {
    try {
      const tituloEliminar = datos.selectEliminar;
      const objetoProd = [...this[MODEL].productions].find(prod => prod.title === tituloEliminar);

      if (objetoProd) {
        //llamada al metodo del modelo
        this[MODEL].removeProduction(objetoProd);
        alert(`Producción "${tituloEliminar}" eliminada correctamente.`);
        this.handleInicio();
      }
    } catch (error) {
        alert('Error: ' + error.message);
    }
  };

  onInit = () => {
    //Mostrar las categorias en el menu
    this[VIEW].mostrarCategorias(this[MODEL].categories);

    //mostrar prducciones aleatorias
    const producciones = [...this[MODEL].productions];

    //mezclamos el array de producciones y cogemos solo 3
    const randomizar = producciones
      .sort(() => 0.5 - Math.random()) // mezcla las producciones
      .slice(0, 3);

    this[VIEW].mostrarProducciones(randomizar); // Mostramos las producciones en la vista

    //añadir eventos a los enlaces de las categorias
    this[VIEW].bindProductsCategoryListInMenu(this.handleListaCategorias);
    this[VIEW].bindRandom(this.handleShowActor, this.handleShowDirector, this.handleShowProduction);
    this[VIEW].bindActoresMenu(this.handleListaActores);
    this[VIEW].bindDirectoresMenu(this.handleListaDirectores);
    this[VIEW].bindInicio(this.handleInicio);
    this[VIEW].bindCentral(this.handleShowActor, this.handleShowDirector, this.handleListaCategorias);
    
   // botones de abrir en nueva ventana para producciones, actores y directores
    this[VIEW].bindOpenWindow(this.handleOpenWindow);
    this[VIEW].bindOpenWindowActor(this.handleOpenWindowActor);
    this[VIEW].bindOpenWindowDirector(this.handleOpenWindowDirector);

    // formulario de añadir producción
    this[VIEW].bindNavAdd(this.handleAddProd);
    // formulario de eliminar producción
    this[VIEW].bindNavDelete(this.handleDeleteProd);

    // Botón "Cerrar todas las ventanas" en el menu principal
    const btnCerrar = document.getElementById('cerrarTodo');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            this.ventanasAbiertas.forEach(w => { 
                if (w && !w.closed) w.close(); 
            });
            this.ventanasAbiertas = []; 
        });
    }

    //permitir navegar con el botón atrás/adelante del navegador
    // Escucha el evento popstate para gestionar los botones atrás/adelante
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            this.#restoreState(event.state);
        }
    });

    // Al cargar la aplicación, establecemos el estado inicial en el historial
    history.replaceState({ tipo: "inicio" }, "", "#inicio");

  };
}

export default VideoSystemController;
