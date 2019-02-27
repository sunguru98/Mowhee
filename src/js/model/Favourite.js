import axios from 'axios';
import { apiKey } from '../views/base';

class Favourite{
    constructor(){
        this.favouriteMoviesArray = [];
    }

    addToFavourites(movieId, movieTitle, moviePosterImage, movieGenre){
        let likedMovie = { movieId, movieTitle, movieGenre, moviePosterImage};
        this.favouriteMoviesArray.push(likedMovie);
        this.storeFavourites();
    }

    deleteFavourites(movieId){
        let selectedMovieIndex = this.favouriteMoviesArray.findIndex(movie=>movie.movieId===movieId);
        this.favouriteMoviesArray.splice(selectedMovieIndex, 1);
        this.storeFavourites();
    }

    isMovieFavourite(movieId){
        return this.favouriteMoviesArray.findIndex(movie=>movie.movieId===movieId) != -1;
    }

    getAllMovies(){
        return this.favouriteMoviesArray.length;
    }

    storeFavourites(){
        localStorage.setItem("favourites", JSON.stringify(this.favouriteMoviesArray));
    }

    getFavourites(){
        let recievedFavouriteMovies = JSON.parse(localStorage.getItem("favourites"));
        if(recievedFavouriteMovies) this.favouriteMoviesArray = recievedFavouriteMovies;
    }
}

export default Favourite;