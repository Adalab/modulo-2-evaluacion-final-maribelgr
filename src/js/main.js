"use strict";

const input = document.querySelector(".js-input");
const button = document.querySelector(".js-button");
const results = document.querySelector(".js-results");

let series = [];

//Acceder a la URL para obtener los resultados de la búsqueda
function getResults() {
  let inputValue = input.value;
  fetch(`//api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      //Dar valor al array de series --> series = data.series; ver si es así o series = data;
      //Llamar aquí a la función que muestre los resultados showResults
      series = data;
      // console.log(series);
      showResults();
      // for (const character of data.results) {
      //   result.innerHTML += `<li>Tu personaje es ${character.name} y su género es ${character.gender}</li>`;
    });
}

//Crear funcion que muestre resultados
function showResults() {
  let result = "";
  for (const serie of series) {
    result += "<li>";
    result += `<div class="list__results-container">`;
    result += `<img class="list__results-img" src="${serie.show.image.medium}" alt="${serie.show.name}">`;
    result += `<h2 class="list__results-title">${serie.show.name}</h2>`;
    result += "</div>";
    result += "</li>";
  }
  // console.log(result);
  results.innerHTML = result;
}

button.addEventListener("click", getResults);

//con showResults voy a pintar los li a los que he accedido
//ahora quiero coger todos los li que he pintado en el html con el showResults (y Después del console log de pintar quiero coger
