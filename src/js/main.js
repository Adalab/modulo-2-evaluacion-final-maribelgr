"use strict";

const input = document.querySelector(".js-input");
const button = document.querySelector(".js-button");
const results = document.querySelector(".js-results");

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
      //console.log(series);
      //Lamo a la función que ha añadido un evento click a cada li
      listenAddItems();
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
    result += `<li class="list__results-item" data-id="${serie.show.id}">`;
    result += `<div class="list__results-container">`;
    result += `<img class="list__results-img" src="${src}" alt="${serie.show.name}">`;
    result += `<h2 class="list__results-title">${serie.show.name}</h2>`;
    result += "</div>";
    result += "</li>";
  }
  console.log(result);
  results.innerHTML = result;
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
  // const itemId = event.currentTarget.id;
  console.log(event.currentTarget.dataset.id);
}

button.addEventListener("click", getResults);
