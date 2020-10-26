"use strict";

const input = document.querySelector(".js-input");
const button = document.querySelector(".js-button");
const resultsList = document.querySelector(".js-results");
const favouritesList = document.querySelector(".js-favourites");

let series = [];
let favourites = [];

function getResults() {
  let inputValue = input.value;
  fetch(`//api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      series = data;

      paintResults();
      listenAddItems();
      paintFavourites();
    });
}

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
  const clickedSerie = event.currentTarget;
  const clickedId = event.currentTarget.id;
  const object = series.find((serie) => serie.show.id === parseInt(clickedId));
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
  for (const favouriteItem of favouriteItems) {
    favouriteItem.addEventListener("click", removeFavouriteItem);
  }
  resetBtn.addEventListener("click", removeAllFavorites);
};

function removeAllFavorites() {
  favourites = [];
  localStorage.removeItem("favourites");

  favouritesList.innerHTML = "";
  paintFavourites();
}

function removeFavouriteItem(event) {
  const clickedId = event.currentTarget.id;

  const serieIndex = favourites.findIndex(
    (serie) => serie.show.id === parseInt(clickedId)
  );

  favourites.splice(serieIndex, 1);
  paintFavourites();
  setInLocalStorage();
}

const getFromLocalStorage = () => {
  const LocalStoragefavourites = localStorage.getItem("favourites");
  if (LocalStoragefavourites !== null) {
    favourites = JSON.parse(LocalStoragefavourites);
  }
};

const setInLocalStorage = () => {
  const stringifyfavourites = JSON.stringify(favourites);
  localStorage.setItem("favourites", stringifyfavourites);
};

button.addEventListener("click", getResults);

//Start APP
getFromLocalStorage();
paintResults();
paintFavourites();
