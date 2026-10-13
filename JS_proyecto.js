const button = document.getElementById("button");
const estado = document.getElementById("estado");

const galeria = document.getElementById("galeria");
const favoritos = document.getElementById("favoritos");

const verMas = document.getElementById("verMas");




const mostrarGaleria = document.getElementById("mostrarGaleria");
const mostrarFavoritos = document.getElementById("mostrarFavoritos");

const seccionGaleria = document.getElementById("seccionGaleria");
const seccionFavoritos = document.getElementById("seccionFavoritos");


const API_KEY = 'live_Btxveu4oYzQYG9BECeAOeGYzy30eZGLI95uhlzg8zDIatLwKKX5tt02yaR4kj1eB';

let album = [];
let album_favoritos = [];

let pagina = 1;





function guardarLocalstorage() {

    localStorage.setItem(
        "favoritos",
        JSON.stringify(album_favoritos)
    );

}


function recuperarLocalstorage() {

    const datos = localStorage.getItem("favoritos");

    if (datos) {

        album_favoritos = JSON.parse(datos);

    } else {

        album_favoritos = [];

    }

}





seccionFavoritos.style.display = "none";


mostrarGaleria.addEventListener("click", () => {

    seccionGaleria.style.display = "block";
    seccionFavoritos.style.display = "none";

    mostrarGaleria.classList.add("activo");
    mostrarFavoritos.classList.remove("activo");

});


mostrarFavoritos.addEventListener("click", () => {

    seccionGaleria.style.display = "none";
    seccionFavoritos.style.display = "block";

    mostrarFavoritos.classList.add("activo");
    mostrarGaleria.classList.remove("activo");

});





function renderGaleria() {

    galeria.innerHTML = "";

    if (album.length > 0) {

        album.forEach(a => {

            const li = document.createElement("li");

            const imagen = document.createElement("img");

            imagen.src = a.url;
            imagen.alt = "Imagen de gato";


            const buttonFav = document.createElement("button");

            buttonFav.textContent = "❤️";


            li.appendChild(imagen);
            li.appendChild(buttonFav);

            galeria.appendChild(li);


            buttonFav.addEventListener("click", () => {

                guardarFav(a);

            });

        });


        estado.textContent = "";

    } else {

        estado.textContent = "No se encontraron imágenes";

    }

}





button.addEventListener("click", cargarImagenes);


async function cargarImagenes() {

    estado.textContent = "Buscando...";

    pagina = 1;

    button.disabled = true;
    verMas.disabled = true;


    const exito = await obtenerImagenes();


    if (exito) {

        renderGaleria();

        verMas.disabled = false;

    } else {

        button.disabled = false;

    }

}




verMas.addEventListener("click", masImagenes);


async function masImagenes() {

    estado.textContent = "Buscando...";

    verMas.disabled = true;

    pagina++;


    const exito = await obtenerImagenes();


    if (exito) {

        renderGaleria();

        verMas.disabled = false;

    } else {

        pagina--;

        verMas.disabled = false;

    }

}





function guardarFav(a) {

    const existe = album_favoritos.some(
        fav => fav.id === a.id
    );


    if (!existe) {

        album_favoritos.push(a);

        guardarLocalstorage();

        renderFav();

    }

}





function renderFav() {

    favoritos.innerHTML = "";


    if (album_favoritos.length === 0) {

        favoritos.innerHTML =
            "<p>No tienes imágenes favoritas todavía.</p>";

        return;

    }


    album_favoritos.forEach(a => {

        const li = document.createElement("li");


        const img = document.createElement("img");

        img.src = a.url;
        img.alt = "Gato favorito";


        const buttonEliminar =
            document.createElement("button");

        buttonEliminar.textContent = "🗑️";


        li.appendChild(img);
        li.appendChild(buttonEliminar);

        favoritos.appendChild(li);


        buttonEliminar.addEventListener("click", () => {

            eliminarFav(a);

        });

    });

}




function eliminarFav(a) {

    const indice = album_favoritos.findIndex(
        fav => fav.id === a.id
    );


    if (indice !== -1) {

        album_favoritos.splice(indice, 1);

        guardarLocalstorage();

        renderFav();

    }

}





async function obtenerImagenes() {

    try {

        const url =
            `https://api.thecatapi.com/v1/images/search?limit=9&page=${pagina}&api_key=${API_KEY}`;


        const respuesta = await fetch(url);


        if (!respuesta.ok) {

            throw new Error("Error en la petición");

        }


        const resultado =
            await respuesta.json();


        if (pagina === 1) {

            album = resultado;

        } else {

            

            album.unshift(...resultado);

        }


        return true;


    } catch (error) {

        estado.textContent =
            "Error al cargar las imágenes";

        return false;

    }

}





recuperarLocalstorage();

renderFav();
 