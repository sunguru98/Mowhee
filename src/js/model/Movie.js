import axios from 'axios';
import { apiKey } from '../views/base';

class Movie{
    constructor(id){
        this.movie = {};
        this.movie.id = id;
    }

    async getMovieDetails(){
        let movieData = await axios(`https://api.themoviedb.org/3/movie/${this.movie.id}?api_key=${apiKey}&language=en-US&append_to_response=videos,credits`);
        movieData = movieData.data;
        let [year, month, day] = movieData.release_date.split("-");
        this.movie.backdropPath = movieData.backdrop_path;
        this.movie.posterPath = movieData.poster_path;
        this.movie.title = movieData.original_title;
        this.movie.rating = movieData.vote_average/2;
        if(movieData.genres.length > 0)
            this.movie.genre = movieData.genres[0].name;
        this.movie.runHrs = Math.floor(parseInt(movieData.runtime) / 60);
        this.movie.runMins = (movieData.runtime)-60*this.movie.runHrs;
        this.movie.releaseYear = year;
        this.movie.overView = movieData.overview;
        if(movieData.videos.results.length > 0)
            this.movie.trailerLink = "https://www.youtube.com/watch?v=".concat(movieData.videos.results[0].key);
        movieData.credits.cast.length > 5 ? this.movie.cast = movieData.credits.cast.slice(0, 6) : this.movie.cast = movieData.credits.cast;
        this.movie.direction = movieData.credits.crew.filter(crewObj => crewObj.job === "Director");
    }
}

export default Movie;