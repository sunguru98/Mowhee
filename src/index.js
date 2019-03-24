import {getDomElements, apiKey, bringLoader, clearLoader, getConfigData, getGenres, recieveGenres} from './js/views/base';
import Search from './js/model/Search';
import Movie from './js/model/Movie';
import Favourite from './js/model/Favourite';
import * as searchView from './js/views/searchView';
import * as movieView from './js/views/movieView';
import * as favouriteView from './js/views/favouriteView';

let state = {};
window.state = state;

const capitaliseLetters = (string)=>{
    return string.charAt(0).toUpperCase().concat(string.slice(1));
}
/*------------------------------------------------ START OF PROGRAM FLOW ----------------*/

const getMoviesBasedOnCategory = async ()=>{
    let allGenres = recieveGenres().genres;
    let gId = allGenres.find(genre => genre.name == capitaliseLetters(window.location.hash.replace("#", ""))).id;
    state.categoryObj = new Search("category");
    searchView.clearMovies();
    bringLoader(getDomElements.moviesSpecific);
    await state.categoryObj.getCategoryMovies(gId);
    clearLoader();
    searchView.renderMoviesToUI(state.categoryObj.categoryMovies, capitaliseLetters(window.location.hash.replace("#", "")));
}

const getMoviesBasedOnBrowse = async(choice)=>{
    state.browseObj = new Search("Browse");
    searchView.clearMovies();
    bringLoader(getDomElements.moviesSpecific);
    state.receivedMovies = await state.browseObj.getBrowsedMovies(choice);
    clearLoader();
    searchView.renderMoviesToUI(state.receivedMovies, capitaliseLetters(window.location.hash.replace("#", "")));
}

const bringMainMenu = async ()=>{
    state.searchObj = new Search("loadingMovies");
    searchView.clearMovies();
    bringLoader( getDomElements.moviesNowPlaying);
    bringLoader(getDomElements.moviesTopRated);
    await state.searchObj.getTopRated();
    await state.searchObj.getNowPlaying();
    searchView.renderTopRatedToUI(state.searchObj.allTopRated);
    searchView.renderNowPlayingToUI(state.searchObj.allNowPlaying);
    clearLoader();
    clearLoader();
}
const getMovies = async (searchQuery)=>{
    
    if(searchQuery){
        state.searchObj = new Search(searchQuery);
        searchView.clearSearchField();
        searchView.clearMovies();
        bringLoader(getDomElements.moviesSpecific);
        await state.searchObj.getMovies();
        clearLoader();
        searchView.renderMoviesToUI(state.searchObj.allMovies, "Search Results");
    }
}


const getMovieDetails = async (hashId)=>{
    if(hashId){
        let id = parseInt(hashId.replace("#", ""));
        let movieObject = new Movie(id);
        state.movieObj = movieObject;
        searchView.clearMovies();
        movieView.clearMovies();
        bringLoader(getDomElements.moviesDetail);
        await state.movieObj.getMovieDetails();
        clearLoader();
        movieView.getMovieDetails(state.movieObj.movie, state.favouriteObj.isMovieFavourite(id));
    }
}

const addMovieToFavourite = ()=>{
    if(!state.favouriteObj) state.favouriteObj = new Favourite();
    let currentMovieId = state.movieObj.movie.id;
    let movieName = state.movieObj.movie.title;
        let movieGenre = state.movieObj.movie.genre;
        let moviePosterPath = state.movieObj.movie.posterPath;
        let movieUrl = JSON.parse(localStorage.getItem("configData")).baseUrl+JSON.parse(localStorage.getItem("configData")).images.poster_sizes[6]+moviePosterPath;
    
    if(!state.favouriteObj.isMovieFavourite(currentMovieId)){
        state.favouriteObj.addToFavourites(currentMovieId, movieName, movieUrl, movieGenre);
        favouriteView.toggleFavouriteAnimation(true);
        favouriteView.createFavouriteMovieInPanel(currentMovieId, movieName, movieUrl, movieGenre);
    }

    else{
        state.favouriteObj.deleteFavourites(currentMovieId);
        favouriteView.toggleFavouriteAnimation(false);
        favouriteView.deleteFavouriteMovieInPanel(currentMovieId);
    }

    favouriteView.showOrHideFavouritesPanel(state.favouriteObj.getAllMovies());
}


document.addEventListener('keypress', (event)=>{
    if(event.keyCode === 13 && event.target.value){
        getMovies(event.target.value);
        history.pushState("", document.title, window.location.pathname
        + window.location.search);
    }
});



//Initial Basic Settings 
window.addEventListener("load", async ()=>{
    getDomElements.overlayDiv.style.display = "none";
    getDomElements.html.style.overflow = "visible";
    
    state.favouriteObj = new Favourite();
    state.favouriteObj.getFavourites(); 

    if(localStorage.getItem("hasCodeRunThrough") === null ){
        //Recieve the config data
        let configData = await getConfigData();
        //Recieve all genres
        let genres = await getGenres();
        //Save the config data to local storage
        localStorage.setItem("configData", JSON.stringify(configData));
        localStorage.setItem("genresData", JSON.stringify(genres));
        //Make sure it doesnt load again and waste resources
        localStorage.setItem("hasCodeRunThrough", true);

    }
    if(getDomElements.moviesDetailClass || window.location.hash){
        if(["#action", "#comedy", "#drama", "#family", "#horror", "#music", "#thriller"].findIndex(cat => cat == window.location.hash)===-1){
            if(["#top", "#tv", "#popular", "#upcoming"].findIndex(cat => cat == window.location.hash)===-1){
                getMovieDetails(window.location.hash);
            }
            else{
                getMoviesBasedOnBrowse(window.location.hash.replace("#", ""));
            }     
        }
        else{ getMoviesBasedOnCategory(); }
    }
    else{
         bringMainMenu();
    }

    favouriteView.showOrHideFavouritesPanel(state.favouriteObj.getAllMovies());
    
    state.favouriteObj.favouriteMoviesArray.forEach(movie => {
        favouriteView.createFavouriteMovieInPanel(movie.movieId, movie.movieTitle, movie.moviePosterImage, movie.movieGenre)
    });
    
});

//Functional Listeners 

getDomElements.moviesSpecific.addEventListener('click', (event)=>{
    if(event.target.matches('.btn-inline, .btn-inline *')){
    let pageNumber = parseInt(event.target.closest(".btn-inline").dataset.gotopage);
    searchView.clearMovies();
    // if("#action" || "#comedy" || "#drama" || "#family" || "#horror" || "#music" || "#thriller" || "#top" || "#tv" || "#popular" || "#upcoming" in window.location.hash)
    //     searchView.renderNowPlayingToUI(state.searchObj.allNowPlaying, pageNumber)
    // else
    //     searchView.renderNowPlayingToUI(state.searchObj.allNowPlaying, pageNumber);
    // }
    if(["#action", "#comedy", "#drama", "#family", "#horror", "#music", "#thriller"].findIndex(cat => cat == window.location.hash)===-1){
        if(["#top", "#tv", "#popular", "#upcoming"].findIndex(cat => cat == window.location.hash)===-1){
            searchView.renderMoviesToUI(state.searchObj.allMovies, "Search Results", pageNumber);
        }
        else{ searchView.renderMoviesToUI(state.receivedMovies, capitaliseLetters(window.location.hash.replace("#", "")), pageNumber) }
    }
    else{ searchView.renderMoviesToUI(state.categoryObj.categoryMovies, capitaliseLetters(window.location.hash.replace("#", "")), pageNumber) }
    }
});

getDomElements.moviesTopRated.addEventListener('click', (event)=>{
    if(event.target.matches('.btn-inline, .btn-inline *')){
        console.log("clicked");
    let pageNumber = parseInt(event.target.closest(".btn-inline").dataset.gotopage);
    searchView.clearTopRated();
    searchView.renderTopRatedToUI(state.searchObj.allTopRated, pageNumber);
    }
});

getDomElements.moviesNowPlaying.addEventListener('click', (event)=>{
    if(event.target.matches('.btn-inline, .btn-inline *')){
    let pageNumber = parseInt(event.target.closest(".btn-inline").dataset.gotopage);
    searchView.clearNowPlaying();
    searchView.renderNowPlayingToUI(state.searchObj.allNowPlaying, pageNumber);
    }
});

getDomElements.moviesLogoUserPanel.addEventListener("click", ()=>{
    history.pushState("", document.title, window.location.pathname
    + window.location.search);
    bringMainMenu();
});

getDomElements.moviesLogoSideBar.addEventListener("click", ()=>{
    history.pushState("", document.title, window.location.pathname
    + window.location.search);
    bringMainMenu();
});

getDomElements.moviesSection.addEventListener("click", (event)=>{
    if(event.target.matches('.movies-detail__link--favourite')){
        addMovieToFavourite();   
    }
})

getDomElements.userPanel.addEventListener("click", (event)=>{
    if(event.target.matches(".movies__likes-delete, .movies__likes-delete *")){
    let currentMovieId = state.movieObj.movie.id;
        state.favouriteObj.deleteFavourites(currentMovieId);
        if(getDomElements.moviesDetail.contains(document.querySelector(".movies__detail-group .movies__detail-link--favourite"))){
            favouriteView.toggleFavouriteAnimation(false);
        }
        favouriteView.deleteFavouriteMovieInPanel(currentMovieId);
        favouriteView.showOrHideFavouritesPanel(state.favouriteObj.getAllMovies());
    }
});

window.addEventListener('hashchange',  ()=>{
    if(["#action", "#comedy", "#drama", "#family", "#horror", "#music", "#thriller"].findIndex(cat => cat == window.location.hash)===-1){     
        if(["#top", "#tv", "#popular", "#upcoming"].findIndex(cat => cat == window.location.hash)===-1){
            getMovieDetails(window.location.hash);
        }
        else{
            getMoviesBasedOnBrowse(window.location.hash.replace("#", ""));
        }
    }
    else{ getMoviesBasedOnCategory(); }
    
});

//All other Listeners for styling

getDomElements.searchButton.addEventListener('click', ()=>{
    getDomElements.searchText.style.width = "25rem";
    getDomElements.searchText.style.paddingRight = "3.0rem";
    getDomElements.searchText.style.marginRight = "-3.0rem";
    getDomElements.searchText.focus();
    getDomElements.searchText.style.cursor = "text";
    
    getDomElements.searchText.setAttribute('placeholder', "Search here. Press Enter to search.");
});

getDomElements.searchText.addEventListener('focusout', ()=>{
    getDomElements.searchText.style.width = "4.0rem";
    getDomElements.searchText.style.marginRight = "-2.75rem";
    //document.querySelector(".movies__search--info").textContent = "";
    getDomElements.searchText.style.paddingRight = "2rem";
    getDomElements.searchText.value = "";
});

getDomElements.overlayDiv.addEventListener('click', ()=>{
    getDomElements.overlayDiv.style.display = "none";
    getDomElements.navBtn.classList.toggle('active');
});

getDomElements.nav.addEventListener('click', ()=>{ 
    getDomElements.html.style.overflow = document.getElementsByTagName('html')[0].style.overflow === "visible" ? 'hidden' : 'visible';
    getDomElements.overlayDiv.style.display = document.querySelector('.overlay').style.display === 'none' ? 'block' : 'none';
    getDomElements.overlayDiv.classList.toggle("addFadeIn");
    getDomElements.navBtn.classList.toggle('active');
});

