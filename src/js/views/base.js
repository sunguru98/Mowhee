import axios from "axios";

export const getDomElements = {
    // For basic animation requirements
    moviesLogoSideBar: document.querySelector(".sidebar .sidebar__logo"),
    moviesLogoUserPanel: document.querySelector(".movies__user-panel .sidebar__logo"),
    moviesSection: document.querySelector(".movies"),
    moviesNowPlaying: document.querySelector(".movies__categories--1"),
    moviesTopRated: document.querySelector(".movies__categories--2"),
    moviesDetailClass: document.querySelector(".movies-detail"),
    searchText: document.querySelector(".movies__search--text"),
    searchButton: document.querySelector(".movies__search--btn"),
    favouriteButton: document.querySelector(".movies-detail__link--favourite"),
    userPanel: document.querySelector(".movies__user-panel"),
    navBtn: document.querySelector(".navigation__button"),
    nav: document.querySelector(".movies__navigation"),
    overlayDiv: document.querySelector('.overlay'),
    html: document.getElementsByTagName('html')[0],
    moviesSpecific: document.querySelector(".movies__specific"),
    moviesFavouritesPanel: document.querySelector('.movies__likes'),
    moviesSpecificButton : document.querySelector(".movies__specific-button"),
    moviesDetail: document.querySelector(".movies-detail__group"),
    moviesCategories: document.querySelector('.movies__categories'),
    moviesLikesList: document.querySelector('.movies__likes-list')
};
export let apiKey = "7d0cf763ad63814289ad165396c4738d";

export const recieveConfigData = ()=>{
   return JSON.parse(localStorage.getItem("configData"));
}

export const recieveGenres = ()=>{
    console.log(JSON.parse(localStorage.getItem("genresData")));
    return JSON.parse(localStorage.getItem("genresData"));
}

export const bringLoader = (position)=>{
    let element = `
    <div class="loader">
    </div>
    `;
    position.insertAdjacentHTML("afterbegin", element);
}

export const clearLoader = ()=>{
    let loader = document.querySelector(".loader");
    if(loader) loader.parentNode.removeChild(loader);
}

export const getConfigData = async ()=>{
    let configData = await axios(`https://api.themoviedb.org/3/configuration?api_key=${apiKey}`);
    return {
        changeKeys: configData.data.change_keys,
        images: configData.data.images,
        baseUrl: configData.data.images.secure_base_url
    }
}

export const getGenres = async ()=>{
    let genresMovie = await axios(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
    let genresTv = await axios(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=en-US`);
    let genres = {
        data:{
            genres:null
        }
    };
    genres.data.genres = Array.from(new Set([...genresMovie.data.genres, ...genresTv.data.genres]));
    return genres.data;
} 