"use strict";

const input = document.querySelector(".js-input");
const button = document.querySelector(".js-button");
const resultsList = document.querySelector(".js-results");
const favouritesList = document.querySelector(".js-favourites");

let series = [];
let favourites = [];

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
      paintFavourites();
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
    result += `<li class="list__results-item" id="${serie.show.id}">`;
    result += `<div class="list__results-container">`;
    result += `<img class="list__results-img" src="${src}" alt="${serie.show.name}">`;
    result += `<h2 class="list__results-title">${serie.show.name}</h2>`;
    result += "</div>";
    result += "</li>";
  }
  resultsList.innerHTML = result;

  if (series.length === 0) {
    const resultContainer = document.querySelector(".js-results-container");
    resultContainer.classList.add("results-container-hidden");
  } else {
    const resultContainer = document.querySelector(".js-results-container");
    resultContainer.classList.remove("results-container-hidden");
  }
}

const listenAddItems = () => {
  const items = document.querySelectorAll(".list__results-item");

  for (const item of items) {
    item.addEventListener("click", addFavoriteItem);
  }
};

function addFavoriteItem(event) {
  //Esto es para añadirle la clase con color al background
  const clickedSerie = event.currentTarget;
  //Obtengo el Id de la serie
  const clickedId = event.currentTarget.id;
  //Busco si el id del array de la búsqueda -series- es igual que el id del elemento clicado
  const object = series.find((serie) => serie.show.id === parseInt(clickedId));
  //Busco el index de la serie para saber si está en favoritos o no // Situar el id en el index
  const serieIndex = favourites.findIndex(
    (serie) => serie.show.id === parseInt(clickedId)
  );
  if (serieIndex === -1) {
    favourites.push(object);
    paintFavourites();
    setInLocalStorage();
  } else {
    favourites.splice(serieIndex, 1);
    paintFavourites();
    setInLocalStorage();
  }
}

//Mostrar listado de favoritos
function paintFavourites() {
  let favouritesResult = "";
  const resetBtn = document.querySelector(".js-reset-btn");
  for (let i = 0; i < favourites.length; i++) {
    const favourite = favourites[i];
    const src = favourite.show.image
      ? `${favourite.show.image.medium}`
      : "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    favouritesResult += `<li class="favourites__list-item" id="${favourite.show.id}">`;
    favouritesResult += `<div class="favourites__list-container">`;
    favouritesResult += `<img class="favourites__list-img" src="${src}" alt="${favourite.show.name}">`;
    favouritesResult += `<h2 class="favourites__list-title">${favourite.show.name}</h2>`;
    favouritesResult += "</div>";
    favouritesResult += "</li>";
  }
  // console.log(favouritesResult);
  favouritesList.innerHTML = favouritesResult;
  if (favourites.length === 0) {
    resetBtn.classList.add("reset-button-hidden");
  } else {
    resetBtn.classList.remove("reset-button-hidden");
  }
  listenFavouriteItems();
}

const listenFavouriteItems = () => {
  const favouriteItems = document.querySelectorAll(".favourites__list-item");
  const resetBtn = document.querySelector(".js-reset-btn");
  //Creo un for para recorrer cada elemento li y poder añadirle el evento click
  for (const favouriteItem of favouriteItems) {
    //Le pongo función para que quite de favoritos al item (li) que he clicado
    favouriteItem.addEventListener("click", removeFavouriteItem);
  }
  //En este botón añado el evento para borrar todos los favoritos
  resetBtn.addEventListener("click", removeAllFavorites);
};

function removeAllFavorites() {
  //Reinicio a 0 el listado de favoritos
  favourites = [];
  //Borro el localStorage
  localStorage.removeItem("favourites");
  //Borro en el html el listado que había creado antes
  favouritesList.innerHTML = "";
  paintFavourites();
}

//Crear función para quitar de favoritos: AQUÍ QUIERO IDENTIFICAR EL ELEMENTO CLICADO
function removeFavouriteItem(event) {
  //Obtengo el Id de la serie
  const clickedId = event.currentTarget.id;
  //Busco el index de la serie para saber si está en favoritos o no
  const serieIndex = favourites.findIndex(
    (serie) => serie.show.id === parseInt(clickedId)
  );

  favourites.splice(serieIndex, 1);
  //quitar clase del background de los elementos que no son favoritos
  //añadir clase del background favorito
  paintFavourites();
  setInLocalStorage();
}

//Recuperar lo que he guardado en favoritos al recargar la página
const getFromLocalStorage = () => {
  const LocalStoragefavourites = localStorage.getItem("favourites");
  if (LocalStoragefavourites !== null) {
    favourites = JSON.parse(LocalStoragefavourites);
  }
};

//Guardo favourites en el local storage, pasándolo antes a string
const setInLocalStorage = () => {
  const stringifyfavourites = JSON.stringify(favourites);
  localStorage.setItem("favourites", stringifyfavourites);
};

button.addEventListener("click", getResults);

//Start APP
getFromLocalStorage();
paintResults();
paintFavourites();
