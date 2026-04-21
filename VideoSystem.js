// Importación de las clases necesarias
import Category from "./Category.js";
import User from "./User.js";
import Production from "./Production.js";
import Person from "./Person.js";


const VideoSystem = (function () {
    let vSys; //Variable para guardar la unica instancia de VideoSystem

    // Clase VideoSystem
    class VideoSystem {
        #name;
        #users = [];
        #productions = [];
        #categories = new Map(); // Mapa de categorías a conjuntos de producciones
        #actors = new Map();
        #directors = new Map();
        //Categoria por defecto
        #defCategory;
        #productionsCast = new Map();

        //Constructor
        constructor(name = "VideoSystem") {
            //Comprobar si ya existe una instancia de VideoSystem, si existe devolverla
            if (vSys) return vSys;

            //Si no existe, crear la instancia
            this.#name = name;

            //Crear categoria por defecto
            this.#defCategory = new Category("Sin categoría");
            this.#categories.set(this.#defCategory, new Set()); //Añadir categoria por defecto al sistema

            //Asignar la instancia creada a la variable vSys
            vSys = this;
        }

        //getter y setter name y defCategory
        get name() {
            return this.#name;
        }

        set name(name) {
            if (!name)
                throw new Error("El nombre no puede estar vacio");
            this.#name = name;
        }

        get defCategory() {
            return this.#defCategory;
        }

        set defCategory(category) {
            this.#defCategory = category;
        }

        //Métodos categoria
        //getter categorias usando un iterador !!
        get categories() {
            const catKey = this.#categories.keys();
            // Devolver un iterador para recorrer las categorías
            return {
                *[Symbol.iterator]() {
                    for (const category of catKey) {
                        yield category;
                    }
                },
            };
        }

        //Método añadir categoria
        addCategory(...categories) {
            for (const category of categories) {
                if (!category || !(category instanceof Category)) {
                    throw new Error("Categoría inválida.");
                }
                if (this.#categories.has(category)) {
                    throw new Error(`La categoría ${category.name} ya existe.`);
                }
                // Añadir la categoría al mapa con un conjunto vacío de producciones
                this.#categories.set(category, new Set());
            }
            return this.#categories.size;
        }

        //Método eliminar categoria
        removeCategory(category) {
            // Validar la categoría existente 
            if (!category || !this.#categories.has(category)) {
                throw new Error("La categoría no está registrada.");
            }
            // Prevenir la eliminación de la categoría por defecto
            if (category === this.#defCategory) {
                throw new Error("No se puede eliminar la categoría por defecto.");
            }
            // Traspasar las producciones a la categoría por defecto
            const prods = this.#categories.get(category);
            const defProds = this.#categories.get(this.#defCategory);
            for (const p of prods) {
                defProds.add(p);
            }
            this.#categories.delete(category);
            return this.#categories.size;
        }

        //Métodos usuario
        //getter usuarios
        get users() {
            const lista = this.#users;
            // Devolver un iterador para recorrer las categorías
            return {
                *[Symbol.iterator]() {
                    for (const user of lista) {
                        yield user;
                    }
                },
            };
        }

        //Método añadir usuario
        addUser(user){
            if (!user || !(user instanceof User)) {
                throw new Error("El usuario no puede ser null y debe ser un objeto válido.")
            }
            const existeUsu = this.#users.find(usu => usu.username === user.username);
            if (existeUsu) {
                throw new Error("El usuario ya existe.");
            }
            const existeEmail = this.#users.find(usu => usu.email === user.email);
            if (existeEmail) {
                throw new Error("El email ya está registrado.");
            }  
            this.#users.push(user);
            return this.#users.length;
        }

        //Método eliminar usuario
        removeUser(user){
            if (!user || !(user instanceof User)) {
                throw new Error("El usuario no puede ser null y debe ser un objeto válido.")
            }
            //Buscar la posicion del usuario para saber si está registrado o no
            const index = this.#users.findIndex(usu => usu.username === user.username);
            if (index === -1) {
                throw new Error("El usuario no está registrado.");
            }
            this.#users.splice(index, 1); 
            return this.#users.length;
        }

        //Métodos productions
        get productions() {
            const lista = this.#productions;
            // Devolver un iterador para recorrer las producciones
            return {
                *[Symbol.iterator]() {
                    for (const production of lista) {
                        yield production;
                    }
                },
            };
        }

        //Método añadir producción
        addProduction(...productions) {
            for (const production of productions) {
                if (!(production instanceof Production)) throw new Error("Producción inválida.");
                if (this.#productions.includes(production)) throw new Error("La producción ya existe.");
                this.#productions.push(production);
            }
            return this.#productions.length;
        }

        removeProduction(production) {
            const index = this.#productions.indexOf(production);
            if (index === -1) throw new Error("La producción no existe.");

            // Limpiar relaciones en Maps (Súper eficiente)
            for (const prods of this.#categories.values()) prods.delete(production);
            for (const prods of this.#actors.values()) prods.delete(production);
            for (const prods of this.#directors.values()) prods.delete(production);

            this.#productions.splice(index, 1);
            return this.#productions.length;
        }

        //Métodos actors
        //getter actors
        get actors() {
            const lista = this.#actors;
            return {
                *[Symbol.iterator]() {
                    for (const actor of lista.keys()) {
                        yield actor;
                    }
                },
            };
        }
        
        // Añadir actores (permite uno o varios)
        addActor(...actors) {
            for (const actor of actors) {
                if (!actor || !(actor instanceof Person)) throw new Error("Objeto no es una Persona.");
                if (this.#actors.has(actor)) throw new Error("El actor ya existe.");
                
                this.#actors.set(actor, new Set()); // Inicializamos su lista de pelis vacía
            }
            return this.#actors.size;
        }

        //eliminar actor
        removeActor(actor) {
            if (!actor || !(actor instanceof Person)) {
                throw new Error("El actor no puede ser null y debe ser un objeto válido.");
            }

            // En un Map, el borrado es directo. .delete() devuelve true si existía y false si no.
            if (!this.#actors.has(actor)) {
                throw new Error("El actor no existe en el sistema.");
            }

            // Al borrar la llave del Map, automáticamente dejas de tener acceso a su Set de producciones
            this.#actors.delete(actor);

            return this.#actors.size;
        }

        //Métodos directors
        //getter directors
        get directors() {
            const lista = this.#directors;
            return {
                *[Symbol.iterator]() {
                    for (const director of lista.keys()) {
                        yield director;
                    }
                },
            };
        }
        
        // Añadir directores (permite uno o varios)
        addDirector(...directors) {
            for (const director of directors) {
                if (!director || !(director instanceof Person)) throw new Error("Objeto no es una Persona.");
                if (this.#directors.has(director)) throw new Error("El director ya existe.");
                
                this.#directors.set(director, new Set());
            }
            return this.#directors.size;
        }

        //eliminar director
        removeDirector(director) {
            if (!director || !(director instanceof Person)) {
                throw new Error("El director no puede ser null y debe ser un objeto válido.");
            }

            if (!this.#directors.has(director)) {
                throw new Error("El director no existe en el sistema.");
            }

            // Borrado O(1) - Instantáneo
            this.#directors.delete(director);

            return this.#directors.size;
        }

        //Método assignCategory
        assignCategory(category, ...productions) {
            if (!productions) {
                throw new Error("Production es null.")
            }
            //Comprobar si la categoría existe en el sistema y añadirla si no existe
            if (!this.#categories.has(category)) {
                this.addCategory(category);
            }

            //Asignar cada producción a la categoría
            const setProductions = this.#categories.get(category);

                for (const prod of productions) {
                    if (!prod) throw new Error("Production es null.");
                    // Si la producción no existe en el sistema global, podrías añadirla aquí
                    setProductions.add(prod); 
                }

                return setProductions.size; // Total de producciones en esta categoría
            }

        //Método deassignCategory
        deassignCategory(production, category) {
            if (!production) {
                throw new Error("Production es null.")
            }
            if (!category) {
                throw new Error("Category es null.")
            }
            // Obtener el Set de producciones de la categoría
            const catProds = this.#categories.get(category);
            if (!catProds || !catProds.has(production)) {
                throw new Error("La producción no está asignada a la categoría.");
            }
            // Eliminar la producción del Set de la categoría
            catProds.delete(production);
            return catProds.size
        }

        //Métodos directores y actores
        assignActor(actor, ...productions) {
            //ASIGNAR
            if (!actor) throw new Error("Actor es null.");
            // Si no existe, lo añadimos automáticamente
            if (!this.#actors.has(actor)) this.addActor(actor);
            // Obtener el Set de producciones del actor
            const actorProductions = this.#actors.get(actor);
            // Asignar producciones al actor
            for (const prod of productions) {
                if (!prod) continue;
                actorProductions.add(prod);
                // Añadir al mapa de producciones el actor con rol "Sin asignar"
                if (!this.#productionsCast.has(prod)) {
                    this.#productionsCast.set(prod, new Set());
                }
                // Añadir al cast de la producción con rol "Sin asignar"
                this.#productionsCast.get(prod).add({ actor: actor, role: "Sin asignar" });
            }
            return actorProductions.size;
        }

        assignDirector(director, ...productions) {
            if (!director) throw new Error("Director es null.");
            
            if (!this.#directors.has(director)) this.addDirector(director);
            
            const directorProductions = this.#directors.get(director);
            for (const prod of productions) {
                directorProductions.add(prod);
            }
            return directorProductions.size;
        }

        //DESASIGNAR
        deassignDirector(director, production) {
            if (!director) {
                throw new Error("Person es null.")
            }
            if (!production) {
                throw new Error("Production es null.")
            }
            //Buscamos el Set de producciones de ese director concreto
            const directorProductions = this.#directors.get(director);

            if(directorProductions) {
                // el metodo .delete() dentro de un Set devuelve true si existía y luego lo borra
                directorProductions.delete(production);
                return directorProductions.size; //Devuelve cuantas le quedan
            }
            return 0;

        }
            
        deassignActor(actor, production) {
            if (!actor) {
                throw new Error("Person es null.")
            }
            if (!production) {
                throw new Error("Production es null.")
            }
            const actorProductions = this.#actors.get(actor);
            if(actorProductions) {
            actorProductions.delete(production);
            return actorProductions.size;
            }
            return 0;
        }

        //Metodos cast
        getCast(production) {
            if (!production) {
                throw new Error("Production es null.")
            }
            // Obtener el cast de la producción
            const cast = this.#productionsCast.get(production);
            // Devolver un iterador para recorrer el cast
            return {
                *[Symbol.iterator]() {
                    if (cast) {
                        for (const person of cast) {
                            yield {
                                actor : person.actor,
                                role : person.role
                            };
                        }
                    }
                }
            };
        }

        //Métodos getProductionsDirector, getProductionsActor y getProductionsCategory
        // Generador de producciones por director
        *getProductionsDirector(director) {
            if (!director) throw new Error("Director es null.");
            
            const productions = this.#directors.get(director);
            if (productions) {
                for (const prod of productions) {
                    yield prod; // Va devolviendo cada peli según se pide
                }
            }
        }

        // Generador de producciones por actor
        *getProductionsActor(actor) {
            if (!actor) throw new Error("Actor es null.");
            
            const productions = this.#actors.get(actor);
            if (productions) {
                for (const prod of productions) {
                    yield prod;
                }
            }
        }

        // obtener producciones de una categoria
        *getProductionsCategory (category) {
            if (!category) {
                throw new Error("Category es null.")
            }
            // !!! CORRECCION: Filtrar las relaciones para obtener cuales son las producciones de una categoria
            const prodsCat = this.#categories.get(category);
            if (prodsCat) {
                for (const production of prodsCat) {
                    yield production; // Devolver cada producción una por una sin crear un array inmediato.
                }
            }
        }

        //Métodos create
        createPerson(name, lastname1, lastname2, birthDate) {
            for(let p of this.#actors.keys()) {
                if (p.name === name && p.lastname1 === lastname1) return p;
            }
            return new Person(name, lastname1, lastname2, birthDate);
        }

        createProduction(title, releaseDate, duration, synopsis) {
            let production = this.#productions.find(prod => prod.title === title);
            if (production) return production;
            const nuevaProd = new Production(title, releaseDate, duration, synopsis);
            nuevaProd.duration = duration; 
            return nuevaProd;
        }

        createUser(username, email, password) {
            let user = this.#users.find(usu => usu.username === username || usu.email === email);
            if (user) return user;
            return new User(username, email, password);
        }   

        createCategory(name) {
            for (let cat of this.#categories.keys()) {
                if (cat.name === name) return cat;
            }
            return new Category(name);
        }

    }

return {
    getInstance: function () {
        if (!vSys) {
                vSys = new VideoSystem("VideoSystem");
            }
            return vSys;
    }
};

})();

// Exportar la clase VideoSystem para que se pueda usar
export default VideoSystem;

