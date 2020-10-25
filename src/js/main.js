"use strict";

const input = document.querySelector(".js-input");
const button = document.querySelector(".js-button");
const resultsList = document.querySelector(".js-results");
const favoritesList = document.querySelector(".js-favorites");

let series = [];
let favorites = [];

//Acceder a la URL para obtener los resultados de la búsqueda
function getResults() {
  let inputValue = input.value;
  fetch(`//api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      series = data;
      //Llamo ahora a la función que muestra el resultado de la búsqueda = los li
      paintResults();
      //Lamo a la función que ha añadido un evento click a cada li
      listenAddItems();
      paintFavorites();
    });
}

//Crear funcion que muestre resultados de la búsqueda -que pinte los li-
function paintResults() {
  let result = "";
  for (let i = 0; i < series.length; i++) {
    const serie = series[i];
    const src = serie.show.image
      ? `${serie.show.image.medium}`
      : "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    result += `<li class="list__results-item" dataId="${serie.show.id}" id="${i}">`;
    result += `<div class="list__results-container">`;
    result += `<img class="list__results-img" src="${src}" alt="${serie.show.name}">`;
    result += `<h2 class="list__results-title">${serie.show.name}</h2>`;
    result += "</div>";
    result += "</li>";
  }
  // console.log(result);
  resultsList.innerHTML = result;
}

//Creo función que añada los listener a los li recorriendo cada uno de ellos. A esta función la tengo que llamar dentro del 2º then, (como a la funcion de pintar los li) porque es cuando se genera la búsqueda y se pintan los resultados
const listenAddItems = () => {
  const items = document.querySelectorAll(".list__results-item");
  //Creo un for para recorrer cada elemento li y poder añadirle el evento click
  for (const item of items) {
    //Le pongo función para que le añada clase de favoritos al item (li) que he clicado
    item.addEventListener("click", addFavoriteItem);
  }
};

//Crear función para añadir a favoritos: AQUÍ QUIERO IDENTIFICAR EL ELEMENTO CLICADO
function addFavoriteItem(event) {
  //Obtengo el Id de la serie
  let clickedId = event.currentTarget.id;
  const itemElement = event.currentTarget;
  //Busco la serie clicada y la añado a favoritos
  if (favorites.indexOf(series[clickedId]) !== -1) {
  } else {
    favorites.push(series[clickedId]);
  }
  console.log(favorites);
  //Aquí tengo que llamar otra vez a todas las funciones porque quiero que me lo pinte todo en favorites
  paintResults();
  listenAddItems();
  setInLocalStorage();
  paintFavorites();
}

//Mostrar listado de favoritos
function paintFavorites() {
  let favoritesResult = "";
  for (let i = 0; i < favorites.length; i++) {
    const favorite = favorites[i];
    const src = favorite.show.image
      ? `${favorite.show.image.medium}`
      : "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    favoritesResult += `<li class="favorites__list-item" dataId="${favorite.show.id}" id="${i}">`;
    favoritesResult += `<div class="favorites__list-container">`;
    favoritesResult += `<img class="favorites__list-img" src="${src}" alt="${favorite.show.name}">`;
    favoritesResult += `<h2 class="favorites__list-title">${favorite.show.name}</h2>`;
    favoritesResult += "</div>";
    favoritesResult += "</li>";
  }
  console.log(favoritesResult);
  favoritesList.innerHTML = favoritesResult;
}

//OJO: VER SI ESTO ESTÁ BIEN AQUÍ O LO TENGO QUE MOVER
button.addEventListener("click", getResults);

//Recuperar lo que he guardado en favoritos al recargar la página
const getFromLocalStorage = () => {
  const LocalStorageFavorites = localStorage.getItem("favorites");
  if (LocalStorageFavorites !== null) {
    favorites = JSON.parse(LocalStorageFavorites);
  }
};

//Guardo favorites en el local storage, pasándolo antes a string
const setInLocalStorage = () => {
  const stringifyFavorites = JSON.stringify(favorites);
  localStorage.setItem("favorites", stringifyFavorites);
};

getFromLocalStorage();

//Start API
getResults();
paintResults();
