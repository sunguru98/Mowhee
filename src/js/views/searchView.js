import {getDomElements, recieveConfigData, recieveGenres} from './base';

let configurationData = recieveConfigData();
let genresData = recieveGenres();

export const clearSearchField = ()=>{
    getDomElements.searchText.value = "";
}
export const clearMovies = ()=>{
    getDomElements.moviesCategories.innerHTML = "";
    getDomElements.moviesSection.style.backgroundImage = ``;
    getDomElements.moviesDetail.innerHTML = "";
    getDomElements.moviesSpecific.innerHTML = "";
    getDomElements.moviesTopRated.innerHTML = "";
    getDomElements.moviesNowPlaying.innerHTML = "";
}

export const clearNowPlaying = ()=>{
    getDomElements.moviesNowPlaying.innerHTML = "";
}

export const clearTopRated = ()=>{
    getDomElements.moviesTopRated.innerHTML = ""; 
}

const renderMovies = (movies, cssClass)=>{
    let movieItem = "";
    let genre = {};
    movies.forEach(movie=>{
        let year, month, day;
        movie.first_air_date ? [year, month, day] = movie.first_air_date.split("-") : [year, month, day] = movie.release_date.split("-");
        let posterImagePath = configurationData.baseUrl+configurationData.images.poster_sizes[6];
        movie.poster_path? posterImagePath+=movie.poster_path : posterImagePath='/noposter.png';
        if(movie.genre_ids.length > 0){
            genre = genresData.genres.find(genreObject=> genreObject.id === movie.genre_ids[0]);
        }
        else { genre.id = 0; genre.name = "General"; }
        movieItem+=`<li class="movies__${cssClass}-item">
        <a href="#${movie.id}" class="movies__${cssClass}-link">
            <img src="${posterImagePath}" alt="Movie Poster Image" class="movies__${cssClass}-item--image">
        <h2 class="movies__${cssClass}-item--name">${movie.original_name ? movie.original_name : movie.title}</h2>
        <span class="movies__${cssClass}-item--description">${genre.name}</span>
        <span class="movies__${cssClass}-item--release-year">${year}</span>
        </a>
        </li>`
        genre = {};
    });
    return movieItem;
} 

//export const renderMoviesToUI 
//export const renderNowPlayingToUI
// export const renderTopRatedToUI

export const renderNowPlayingToUI = (movies, currentPageNumber=1, numberOfMoviesInOnePage=10)=>{
    let startingMovie = (currentPageNumber-1)*numberOfMoviesInOnePage;
    let endingMovie = currentPageNumber*numberOfMoviesInOnePage;
    let slicedMovies = movies.slice(startingMovie, endingMovie);
    let element = `
    <div class="movies__categories-nowplaying">
        <h1 class="primary-heading movies__categories-nowplaying-title">Now Playing</h1>
        <ul class="movies__categories-nowplaying-list">
            ${renderMovies(slicedMovies, "categories-nowplaying")}
        </ul>
    </div>
    <div class="movies__categories-button">
        ${renderButtons(currentPageNumber, movies.length, numberOfMoviesInOnePage, "categories")}
    </div>`
    getDomElements.moviesNowPlaying.insertAdjacentHTML("afterbegin", element);
}

export const renderTopRatedToUI = (movies, currentPageNumber=1, numberOfMoviesInOnePage=10)=>{
    let startingMovie = (currentPageNumber-1)*numberOfMoviesInOnePage;
    let endingMovie = currentPageNumber*numberOfMoviesInOnePage;
    let slicedMovies = movies.slice(startingMovie, endingMovie);
    let element = `
    <div class="movies__categories-recommended">
        <h1 class="primary-heading movies__categories-recommended-title">Top Rated</h1>
        <ul class="movies__categories-recommended-list">
        ${renderMovies(slicedMovies, "categories-recommended")}
        </ul>
    </div>
    <div class="movies__categories-button">
        ${renderButtons(currentPageNumber, movies.length, numberOfMoviesInOnePage, "categories")}
    </div>`
    getDomElements.moviesTopRated.insertAdjacentHTML("afterbegin", element);
}

export const renderMoviesToUI = (movies, h1Text, currentPageNumber=1, numberOfMoviesInOnePage=20)=>{
    let startingMovie = (currentPageNumber-1)*numberOfMoviesInOnePage;
    let endingMovie = currentPageNumber*numberOfMoviesInOnePage;
    let slicedMovies = movies.slice(startingMovie, endingMovie);
    let element = `
    <h1 class="primary-heading movies__specific-title">${h1Text}</h1>
    <ul class="movies__specific-list">
        ${renderMovies(slicedMovies, "specific")}
    </ul>
    <div class="movies__specific-button">
        ${renderButtons(currentPageNumber, movies.length, numberOfMoviesInOnePage, "specific")}
    </div>
    `;
    getDomElements.moviesSpecific.insertAdjacentHTML("beforeend", element);
}

const renderButtons =(currentPageNumber, totalMovies, numberOfMoviesInOnePage, cssClass)=>{
    let buttonToBeCreated;
    let totalNumberOfPages = Math.ceil(totalMovies/numberOfMoviesInOnePage);
    if(totalNumberOfPages > 1 && currentPageNumber == 1){
        buttonToBeCreated = createButton(currentPageNumber, "next", cssClass)
    }
    else if(currentPageNumber < totalNumberOfPages){
        buttonToBeCreated = `${createButton(currentPageNumber, 'prev', cssClass)}
         ${createButton(currentPageNumber, 'next', cssClass)}
        `
    }
    else if(totalNumberOfPages > 1 && currentPageNumber == totalNumberOfPages){
        buttonToBeCreated = createButton(currentPageNumber, "prev", cssClass)
    }
    else buttonToBeCreated = "";
    return buttonToBeCreated;
}

const createButton = (currentPageNumber, typeOfButton, cssClass)=>{
    let buttonMarkup = `
    <button class="btn-inline movies__${cssClass}-button--${typeOfButton}" data-gotoPage=${typeOfButton === 'next' ? currentPageNumber+1 : currentPageNumber-1}">
        <img src="${typeOfButton}.svg" alt="${typeOfButton} icon" class="button-icon">
    </button>
    `;
    return buttonMarkup;
}
