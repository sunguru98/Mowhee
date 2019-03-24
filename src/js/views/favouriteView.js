import {getDomElements, recieveConfigData, recieveGenres} from './base';

export const toggleFavouriteAnimation = (isFavourite)=>{
    if(isFavourite){
        document.querySelector(".movies-detail__link--favourite").style.color = "#fff";
        document.querySelector(".movies-detail__link--favourite").style.background = "#EB2F06";
        document.querySelector(".movies-detail__link--favourite").innerHTML = `<i class="fas fa-heart"></i>Added to Favorites`;
    }
    else{
        document.querySelector(".movies-detail__link--favourite").style.color = "#EB2F06";
        document.querySelector(".movies-detail__link--favourite").style.background = "transparent";
        document.querySelector(".movies-detail__link--favourite").innerHTML = `<i class="fas fa-heart"></i>Add to Favorites`;
    }
}

export const createFavouriteMovieInPanel = (movieId, movieTitle, moviePosterImage, movieGenre)=>{
    let element = `
    <li class="movies__likes-item">
        <a href="#${movieId}" class="movies__likes-link">
            <img src="${moviePosterImage}" alt="${movieTitle}" class="movies__likes-link--img">
            <div class="movies__likes-link-data">
                <h3 class="movies__likes-link-data--name">${movieTitle}</h3>
                <p class="movies__likes-link-data--author">${movieGenre}</p>   
            </div>
        </a>
        <span class="movies__likes-delete">
            <img src="/cross.svg" alt="Delete Like" class="movies__likes-delete-icon">
        </span>
    </li>
    `
    getDomElements.moviesLikesList.insertAdjacentHTML("afterbegin", element)
}

export const deleteFavouriteMovieInPanel = (movieId)=>{
    let element = document.querySelector(`.movies__likes-link[href='#${movieId}']`).parentElement;
    element.parentNode.removeChild(element);
}

export const showOrHideFavouritesPanel = (numberOfFavourites)=>{
    getDomElements.moviesFavouritesPanel.style.display = numberOfFavourites > 0 ? "block" : "none";
}

