import VideoSystem from "./VideoSystem.js";
import VideoSystemView from "./VideoSystemView.js";
import VideoSystemController from "./VideoSystemController.js";

// Funcion para rellenar los datos de prueba en el sistema de videos
function rellenarDatos(vs) {

    // Crear categorías
    const categoriaAccion = vs.createCategory("Acción");
    const categoriaCom = vs.createCategory("Comedia");
    const categoriaDrama = vs.createCategory("Drama");
    vs.addCategory(categoriaAccion, categoriaCom, categoriaDrama);

    //CREAR PERSONAS
    //crear actores
    const actor1 = vs.createPerson("Leonardo", "DiCaprio", "D.", new Date(1974, 10, 11));
    const actor2 = vs.createPerson("Brad", "Pitt", "P.", new Date(1963, 11, 18));
    const actor3 = vs.createPerson("Morgan", "Freeman", "F.", new Date(1937, 6, 1));
    const actor4 = vs.createPerson("Scarlett", "Johansson", "J.", new Date(1984, 11, 22));
    const actor5 = vs.createPerson("Tom", "Hanks", "H.", new Date(1956, 6, 9));
    const actor6 = vs.createPerson("Natalie", "Portman", "P.", new Date(1981, 5, 9));
    //crear directores
    const director1 = vs.createPerson("Christopher", "Nolan", "N.", new Date(1970, 6, 30));
    const director2 = vs.createPerson("Quentin", "Tarantino", "T.", new Date(1963, 2, 27));
    const director3 = vs.createPerson("Steven", "Spielberg", "S.", new Date(1946, 11, 18));
    const director4 = vs.createPerson("Martin", "Scorsese", "S.", new Date(1942, 10, 17));
    const director5 = vs.createPerson("James", "Cameron", "C.", new Date(1954, 7, 16));
    const director6 = vs.createPerson("Ridley", "Scott", "S.", new Date(1937, 10, 30));


    //CREAR Y ASIGNAR PRODUCCIONES

    //Categoria accion
    const pelicula1 = vs.createProduction("Inception", new Date(2010, 6, 16), 148, "Test Inception.");
    const pelicula2 = vs.createProduction("Matrix", new Date(1999, 2, 31), 136, "Test Matrix.");
    const serie1 = vs.createProduction("The Walking Dead", new Date(2010, 9, 31), 45, "Test The Walking Dead.");
    const serie2 = vs.createProduction("Breaking Bad", new Date(2008, 0, 20), 62, "Test Breaking Bad.");

    vs.addProduction(pelicula1, pelicula2, serie1, serie2);
    vs.assignCategory(categoriaAccion, pelicula1, pelicula2, serie1, serie2);

    vs.assignActor(actor1, pelicula1, pelicula2);
    vs.assignDirector(director1, pelicula1);

    vs.assignActor(actor2, pelicula2, serie1);
    vs.assignDirector(director1, pelicula2);

    vs.assignActor(actor4, serie1, serie2);
    vs.assignDirector(director5, serie1);
  
    vs.assignActor(actor5, serie2, pelicula1);
    vs.assignDirector(director4, serie2);

    //Categoria comedia 
    const pelicula3 = vs.createProduction("Superbad", new Date(2007, 7, 17), 113, "Test Superbad.");
    const pelicula4 = vs.createProduction("The Hangover", new Date(2009, 5, 5), 100, "Test The Hangover.");
    const serie3 = vs.createProduction("The Office", new Date(2005, 0, 20), 62, "Test The Office.");
    const serie4 = vs.createProduction("Friends", new Date(2009, 3, 9), 125, "Test Friends.");

    vs.addProduction(pelicula3, pelicula4, serie3, serie4);
    vs.assignCategory(categoriaCom, pelicula3, pelicula4, serie3, serie4);

    vs.assignActor(actor4, pelicula3, serie3);
    vs.assignDirector(director2, pelicula3);


    vs.assignActor(actor5, pelicula4, serie4);
    vs.assignDirector(director2, pelicula4);


    vs.assignActor(actor6, serie3, pelicula3);
    vs.assignDirector(director3, serie3);

    vs.assignActor(actor6, serie4, pelicula4);
    vs.assignDirector(director3, serie4);


    //Categoria drama
    const pelicula5 = vs.createProduction("Forrest Gump", new Date(1994, 6, 6), 142, "Test Forrest Gump.");
    const pelicula6 = vs.createProduction("El padrino", new Date(1972, 2, 24), 175, "Test El padrino.");
    const serie5 = vs.createProduction("The Crown", new Date(2016, 10, 4), 40, "Test The Crown.");
    const serie6 = vs.createProduction("Stranger Things", new Date(2016, 6, 15), 25, "Test Stranger Things.");
    
    vs.addProduction(pelicula5, pelicula6, serie5, serie6);
    vs.assignCategory(categoriaDrama, pelicula5, pelicula6, serie5, serie6);

    vs.assignActor(actor5, pelicula5, serie5);
    vs.assignDirector(director3, pelicula5);

    vs.assignActor(actor1, pelicula6, serie6);
    vs.assignDirector(director4, pelicula6);

    vs.assignActor(actor4, serie5);
    vs.assignDirector(director4, serie5, pelicula5);

    vs.assignActor(actor6, serie6, pelicula6);
    vs.assignDirector(director6, serie6);

    //crear usuario
    const usuario1 = vs.createUser("IasminaMaghiar", "maghiariasmina@gmail.com", "contraseña123");
    vs.addUser(usuario1);

}

const init = () => {
  //obtenemos el modelo
  const modelo = VideoSystem.getInstance();
  //rellenamos el modelo con datos de prueba
  rellenarDatos(modelo); 
  //Crear el controlador con el modelo y la vista
  const VideoSystemApp = new VideoSystemController(VideoSystem.getInstance(), new VideoSystemView());

};

window.onload = init;
