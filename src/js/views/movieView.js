import {getDomElements, recieveConfigData, recieveGenres} from './base';

let configurationData = recieveConfigData();
let genresData = recieveGenres();

const renderCast = (movieCast)=>{
    let markup = ""; let name = ""; 
    let firstName = "", lastName = "";
    movieCast.forEach(cast=>{
        if(cast.name.split(" ").length > 1)
            [firstName, lastName] = cast.name.split(" ");
        else name = cast.name;
        let posterImagePath = configurationData.baseUrl+configurationData.images.profile_sizes[3];
        cast.profile_path? posterImagePath+=cast.profile_path : posterImagePath='/noposter.png';
        markup+= `<figure class="movies-detail__cast-detail--${cast.cast_id}">
            <img src="${posterImagePath}" alt="Picture ${cast.cast_id}">
            <figcaption>${cast.name.split(" ").length > 1 ? firstName+'<br>'+lastName: name }</figcaption>
        </figure>`
    });

    return markup;
}

const renderDirectors = (movieDirectors)=>{
    let markup = ``
    movieDirectors.forEach((director, index)=>{
        markup+=`<p class="movies-detail__direction--${index+1}">${director.name}</p>`
    });
    return markup;
}

const renderStars = (rating)=>{
    let markup = "";
    for(let count=0; count<rating; count++){
        markup+= `
        <svg class="title__stars-icon">
            <use xlink:href="sprite.svg"></use>
        </svg>`
    }
    for(let count=0; count<5-rating; count++){
        markup+= `
        <svg class="title__stars-icon grey">
            <use xlink:href="sprite.svg"></use>
        </svg>`
    }
    return markup;
}

export const getMovieDetails = (movieObject, isFavouriteMovie)=>{
  
    let favouriteButtonMessage;
    let favouriteButtonColor;
    let favouriteButtonBackgroundColor;

    if(isFavouriteMovie){
        favouriteButtonMessage = `<i class="fas fa-heart"></i>Added to Favorites`;
        favouriteButtonColor = "#fff";
        favouriteButtonBackgroundColor = "#EB2F06";
    }
    else{
        favouriteButtonMessage = `<i class="fas fa-heart"></i>Add to Favorites`;
        favouriteButtonColor = "#EB2F06";
        favouriteButtonBackgroundColor = "transparent";
    }
    
    let backdropImagePath = configurationData.baseUrl+configurationData.images.backdrop_sizes[3];
    let posterImagePath = configurationData.baseUrl+configurationData.images.poster_sizes[6];
    
    movieObject.backdropPath? backdropImagePath+=movieObject.backdropPath : backdropImagePath='/noposter.png';
    movieObject.posterPath? posterImagePath+=movieObject.posterPath : posterImagePath='/noposter.png';

    let elementMarkup = `
    <h1 class="movies-detail__title">${movieObject.title}</h1>
    <div class="movies-detail__description">
        <div class="movies-detail__rating">
            <div class="movies-detail__rating--stars">
                ${renderStars(Math.round(movieObject.rating))}
            </div>
            <div class="movies-detail__rating--number">
                <span class="movies-detail__stars--rating"><span class="white">${movieObject.rating}</span> /5</span>
            </div>
        </div>
        <div class="movies-detail__type">
            <span>Action &middot; ${movieObject.runHrs}hr ${movieObject.runMins}mins &middot; ${movieObject.releaseYear}</span>
        </div>
    </div>
    <div class="movies-detail__paragraph">
        <p>${movieObject.overView}</p>
    </div>
    <div class="movies-detail__links">
        <a href="${movieObject.trailerLink ? movieObject.trailerLink: '#'}" target="_blank" class="movies-detail__link movies-detail__link--trailer"><img src="play.svg" alt="Play icon"> ${movieObject.trailerLink ? 'Watch Trailer': 'Trailer Not Available'}</a>
        <button class="movies-detail__link movies-detail__link--favourite"><i class="fas fa-heart"></i>Add to Favorites</button>
    </div>
    <div class="movies-detail__cast">
        <h3 class="movies-detail__cast-title">Cast</h3>
        <div class="movies-detail__cast-detail">
            ${renderCast(movieObject.cast)}
        </div>
    </div>
    <div class="movies-detail__direction">
        <h3 class="movies-detail__direction-title">Directed By</h3>
        ${renderDirectors(movieObject.direction)}
    </div>
    <div class="movies-detail__poster">
        <img src="${posterImagePath}" alt="Movie Poster">
    </div>
    `
    
    getDomElements.moviesSection.classList.add("movies-detail");
    getDomElements.moviesSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.75)), url('${backdropImagePath}')`;
    getDomElements.moviesDetail.insertAdjacentHTML("afterbegin", elementMarkup);

    document.querySelector(".movies-detail__link--favourite").innerHTML = favouriteButtonMessage;
    document.querySelector(".movies-detail__link--favourite").style.color = favouriteButtonColor;
    document.querySelector(".movies-detail__link--favourite").style.background = favouriteButtonBackgroundColor;
}

export const clearMovies = ()=>{
    getDomElements.moviesSection.classList.remove("movies-detail");
    getDomElements.moviesSection.style.backgroundImage = ``;
    getDomElements.moviesDetail.innerHTML = "";
}