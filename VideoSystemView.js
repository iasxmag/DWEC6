class VideoSystemView { 

    constructor(){ 
        //elementos del menu
        this.menuCat = document.getElementById('menu-categorias');
        this.linkCats = document.getElementById('navCats');

        //elementos del html zona principal
        this.main = document.getElementById('pag-ppal');
        this.centralCat = document.getElementById('lista-categorias');
        this.random = document.getElementById('random');
    } 

    //funcion para mostrar categorias en el menu y en la zona ppal
    mostrarCategorias(categorias) {

        //limpiamos la zona ppal
        this.centralCat.innerHTML = '<h2>Categorías Disponibles:</h2>';

            //submenu
            let submenu = this.linkCats.parentElement.querySelector('ul');
            if (!submenu) {
                submenu = document.createElement('ul');
                this.linkCats.parentElement.appendChild(submenu);
            }
            submenu.innerHTML = ''; // Limpiar el submenu antes de agregar las categorías
            
            for (const categoria of categorias) {
                if (categoria.name === "Sin categoría") continue;

                //añadir categoria al submenu
                const li = document.createElement("li");
                li.innerHTML = `
                    <a href="#" class= "dropdown-item" data-category="${categoria.name}">${categoria.name}</a>
                `;
                submenu.appendChild(li);

                //añadir en la zona ppal
                const div = document.createElement('div');
                div.innerHTML = `<h3>${categoria.name}</h3>`;
                this.centralCat.appendChild(div);
            }            
    }

    //funcion para mostrar producciones
    mostrarProducciones(producciones){
        this.random.innerHTML = '<h1 class="mb-4 fw-bold">Producciones Destacadas</h1>';
        const container = document.createElement('div');
        
        for (const prod of producciones) {
            const div = document.createElement('div');
            div.className = 'produccion';
            div.innerHTML = `
                <article class="peli-click" style= "cursor:pointer;" data-title="${prod.title}">
                    <h3>${prod.title}</h3>
                    <p>${prod.synopsis}</p>
                </article>
                <button data-title="${prod.title}" class="btn btn-secondary btn-abrir-ventana">Abrir en nueva ventana</button>
                <hr>
                `;
            container.appendChild(div);
        }
        
        this.random.appendChild(container);
    }

    // Método para mostrar la ficha técnica de una producción
    mostrarDetalleProduccion(prod, actores, directores) {
        this.random.innerHTML = `
        <div class="p-3 border rounded-3 bg-light">
            <h2 class= "display-6 fw-bold">${prod.title}</h2>
            <p>${prod.synopsis}</p>
            <p>Duración: ${prod.duration} min.</p>
            
            <h3 class= "mt-4">Directores:</h3>
            <ul id="det-dir" class="list-unstyled"></ul>
            
            <h3 class= "mt-4">Actores:</h3>
            <ul id="det-act" class="list-unstyled"></ul>

            <button class="btn btn-secondary mt-3 btn-abrir-ventana" data-title="${prod.title}">
                Abrir en nueva ventana
            </button>
        </div>
        `;
        // Llenamos las listas 
        const ulAct = document.getElementById('det-act');
        for (let a of actores) {
            ulAct.innerHTML += `<li><a href="#" class="actor-link" 
            data-nombre="${a.actor.name} ${a.actor.lastname1}">
            ${a.actor.name} - Papel: ${a.role}</a></li>`;
        }

        const ulDir = document.getElementById('det-dir');
        for (let d of directores) {
            ulDir.innerHTML += `<li><a href="#" class="director-link" 
            data-nombre="${d.name} ${d.lastname1}">
            ${d.name} ${d.lastname1}</a></li>`;
        }
    }

    // Método para mostrar la ficha técnica en una ventana nueva
    mostrarDetalleVentana(prod, actores, directores) {
        const ventana = window.open("", "_blank", "width=400,height=400");
 
        //construir las listas como HTML
        const actoresHTML = actores.map(a =>
            `<li>${a.actor.name} ${a.actor.lastname1} — Papel: ${a.role}</li>`
        ).join('');

        const directoresHTML = directores.map(d =>
            `<li>${d.name} ${d.lastname1}</li>`
        ).join('');

        const html = `
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>${prod.title}</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            </head>
            <body class="p-3">
                <div class="p-3 border rounded-3 bg-light">
                    <h2 class= "display-6 fw-bold">${prod.title}</h2>
                    <p>${prod.synopsis}</p>
                    <p>Duración: ${prod.duration} min.</p>
                
                    <h3 class="mt-4">Directores:</h3>
                    <ul class="list-unstyled">${directoresHTML || '<li>Sin directores asignados</li>'}</ul>

                    <h3 class="mt-4">Actores:</h3>
                    <ul class="list-unstyled">${actoresHTML || '<li>Sin actores asignados</li>'}</ul>

                    <button class="btn btn-danger mt-3" onclick="window.close()">Cerrar</button>
                </div>
            </body>
            </html>
                `;
                
        ventana.document.write(html);
        ventana.document.close();
        return ventana;
    }

    //FUNCIONES PARA MOSTRAR LISTA DE ACTORES Y DIRECTORES EN SUS PÁGINAS

    mostrarActores(actores) {
        //limpiamos la zona ppal
        this.centralCat.innerHTML = '<h2>Actores:</h2>';
        this.random.innerHTML = "";
           
        const ul = document.createElement("ul");
            for (const actor of actores) {
                const li = document.createElement("li");
                li.innerHTML = `<a href="#" class="actor-link" data-nombre="${actor.name} ${actor.lastname1}">${actor.name} ${actor.lastname1}</a>`;
                ul.appendChild(li);
            }
            this.centralCat.appendChild(ul);            
    }

    mostrarDirectores(directores) {
        //limpiamos la zona ppal
        this.centralCat.innerHTML = '<h2>Directores:</h2>';
        this.random.innerHTML = "";
           
        const ul = document.createElement("ul");
            for (const director of directores) {
                const li = document.createElement("li");
                li.innerHTML = `<a href="#" class="director-link" data-nombre="${director.name} ${director.lastname1}">${director.name} ${director.lastname1}</a>`;
                ul.appendChild(li);
            }
            this.centralCat.appendChild(ul);            
    }

    //Fichas actores y directores
    mostrarDetalleActor(actor, producciones) {
        this.random.innerHTML = `
            <h2>${actor.name} ${actor.lastname1}</h2>
            <p>Fecha de nacimiento: ${actor.born.toLocaleDateString()}</p>
            <p>Producciones:</p>
            <ul id="prod-act"></ul>
            <button class="btn btn-secondary mt-3 btn-ventana-act" data-nombre="${actor.name} ${actor.lastname1}">Abrir en nueva ventana</button>
        `;
    
        const ulProd = document.getElementById('prod-act');
        for (let p of producciones) {
            ulProd.innerHTML += `<li><a href="#" class="prod-link" data-titulo="${p.title}">${p.title}</a></li>`;
        }
    }

    mostrarDetalleDirector(director, producciones) {
        this.random.innerHTML = `
            <h2>${director.name} ${director.lastname1}</h2>
            <p>Fecha de nacimiento: ${director.born.toLocaleDateString()}</p>
            <p>Producciones:</p>
            <ul id="prod-dir"></ul>
            <button class="btn btn-secondary mt-3 btn-ventana-dir" data-nombre="${director.name} ${director.lastname1}">Abrir en nueva ventana</button>
        `;
    
        const ulProd = document.getElementById('prod-dir');
        for (let p of producciones) {
            ulProd.innerHTML += `<li><a href="#" class="prod-link" data-titulo="${p.title}">${p.title}</a></li>`;
        }
    }

    // Abre una nueva ventana con la ficha completa de un ACTOR
    mostrarActorVentana(actor, producciones) {
        const ventana = window.open("", "_blank", "width=450,height=400");

        const prodsHTML = producciones.map(p =>
            `<li>${p.title}</li>`
        ).join('');

        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>${actor.name} ${actor.lastname1}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        </head>
        <body class="p-4">
            <div class="p-3 border rounded-3 bg-light">
                <h2 class="display-6 fw-bold">${actor.name} ${actor.lastname1}</h2>
                <p><strong>Fecha de nacimiento:</strong> ${actor.born.toLocaleDateString()}</p>

                <h3 class="mt-4">Producciones:</h3>
                <ul class="list-unstyled">${prodsHTML || '<li>Sin producciones asignadas</li>'}</ul>

                <button class="btn btn-danger mt-3" onclick="window.close()">Cerrar</button>
            </div>
        </body>
        </html>`;

        ventana.document.write(html);
        ventana.document.close();
        return ventana;
    }

    // Abre una nueva ventana con la ficha completa de un DIRECTOR
    mostrarDirectorVentana(director, producciones) {
        const ventana = window.open("", "_blank", "width=450,height=400");

        const prodsHTML = producciones.map(p =>
            `<li>${p.title}</li>`
        ).join('');

        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>${director.name} ${director.lastname1}</title>
            <link rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        </head>
        <body class="p-4">
            <div class="p-3 border rounded-3 bg-light">
                <h2 class="display-6 fw-bold">${director.name} ${director.lastname1}</h2>
                <p><strong>Fecha de nacimiento:</strong> ${director.born.toLocaleDateString()}</p>

                <h3 class="mt-4">Producciones dirigidas:</h3>
                <ul class="list-unstyled">${prodsHTML || '<li>Sin producciones asignadas</li>'}</ul>

                <button class="btn btn-danger mt-3" onclick="window.close()">Cerrar</button>
            </div>
        </body>
        </html>`;

        ventana.document.write(html);
        ventana.document.close();
        return ventana;
    }

    //BINDS
    //click en actor
    bindCentral(handlerActor, handlerDirector, handlerCategoria) {
        this.centralCat.onclick = (event) => {
            const actorLink = event.target.closest('.actor-link');
            const directorLink = event.target.closest('.director-link');
            const h3 = event.target.closest('h3');

            if (actorLink) {
                event.preventDefault();
                handlerActor(actorLink.dataset.nombre);
            } else if (directorLink) {
                event.preventDefault();
                handlerDirector(directorLink.dataset.nombre);
            } else if (h3) {
                event.preventDefault();
                handlerCategoria(h3.innerText);
            }
        };
    }
        
    bindActoresMenu(handler) {
        const link = document.getElementById('navActores');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
        }
    }

    bindDirectoresMenu(handler) {
        const link = document.getElementById('navDirectores');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
        }
    }   

    bindInicio(handler) {
        const link = document.getElementById('navInicio');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
        }
    }


    bindRandom(handlerActor, handlerDirector, handlerProduccion) {
        this.random.onclick = (event) => {
            const actorLink = event.target.closest('.actor-link');
            const directorLink = event.target.closest('.director-link');
            const prodLink = event.target.closest('.prod-link');
            const article = event.target.closest('article');

            if (actorLink) {
                event.preventDefault();
                handlerActor(actorLink.dataset.nombre);
            } else if (directorLink) {
                event.preventDefault();
                handlerDirector(directorLink.dataset.nombre);
            } else if (prodLink) {
                event.preventDefault();
                handlerProduccion(prodLink.dataset.titulo);
            } else if (article) {
                event.preventDefault();
                handlerProduccion(article.dataset.title);
            }      
        }; 
    }

    
    //funcion para mostrar las producciones de una categoria concreta
    bindProductsCategoryListInMenu(handler) { 
        const submenu = this.linkCats.parentElement.querySelector("ul");
        
        if (submenu) {
            const links = submenu.querySelectorAll('a');
            for (const link of links) { 
                link.addEventListener('click', (event) => { 
                    event.preventDefault();
                    handler(event.currentTarget.dataset.category); 
                }); 
            } 
        } 
    }

    // Bind para abrir ventanas nuevas
    bindOpenWindow(handler) {
        this.random.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-abrir-ventana');
            if (btn) {
                event.preventDefault();
                const title = btn.dataset.title;
                if (title) handler(title);
            }
        });
    }

    // Bind "Abrir en nueva ventana" de actores
    bindOpenWindowActor(handler) {
        this.random.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-ventana-act');
            if (btn) {
                event.preventDefault();
                handler(btn.dataset.nombre);
            }
        });
    }

    // Bind "Abrir en nueva ventana" de directores
    bindOpenWindowDirector(handler) {
        this.random.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-ventana-dir');
            if (btn) {
                event.preventDefault();
                handler(btn.dataset.nombre);
            }
        });
    }

}
export default VideoSystemView;