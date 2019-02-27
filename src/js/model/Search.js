import axios from 'axios';
import { apiKey } from '../views/base';
class Search {
    constructor(query){
        this.query = query;
        this.allMovies = [];
        this.allNowPlaying = [];
        this.allTopRated = [];
        this.categoryMovies = [];
        this.tvOnTheAirMovies = [];
        this.upcomingMovies = [];
        this.popularMovies = [];
    }

    async getBrowsedMovies(choice){
        switch(choice){
            case "top": { await this.getTopRated(); return this.allTopRated; }
            case "tv": { await this.getTvOnTheAirMovies(); return this.tvOnTheAirMovies; }
            case "popular": { await this.getPopularMovies(); return this.popularMovies; }
            case "upcoming": { await this.getUpcomingMovies(); return this.upcomingMovies; }
        }
    }

    async getTvOnTheAirMovies(){
        try{
            let movieData = await axios(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&page=1&language=en-US`);
            movieData.data.results.map(result => this.tvOnTheAirMovies.push(result));
            let totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
            for(let pageNumber=2; pageNumber<=totalPages; pageNumber++){
                movieData =  await axios(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=en-US&page=${pageNumber}`);
                movieData.data.results.map(result => this.tvOnTheAirMovies.push(result));
            }
            }
            catch(error){
                alert(error);
            }
    }
    
    async getUpcomingMovies(){
        try{
            let movieData = await axios(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&page=1&language=en-US`);
            movieData.data.results.map(result => this.upcomingMovies.push(result));
            let totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
            for(let pageNumber=2; pageNumber<=totalPages; pageNumber++){
                movieData =  await axios(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${pageNumber}`);
                movieData.data.results.map(result => this.upcomingMovies.push(result));
            }
            }
            catch(error){
                alert(error);
            }
    }

    async getPopularMovies(){
        try{
            let movieData = await axios(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1&language=en-US`);
            movieData.data.results.map(result => this.popularMovies.push(result));
            let totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
            for(let pageNumber=2; pageNumber<=totalPages; pageNumber++){
                movieData =  await axios(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`);
                movieData.data.results.map(result => this.popularMovies.push(result));
            }
            }
            catch(error){
                alert(error);
        }
    }

    async getCategoryMovies(genreId){
        try{
            let movieData = await axios(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1&language=en-US&with_genres=${genreId}`);
            movieData.data.results.map(result => this.categoryMovies.push(result));
            let totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
            for(let pageNumber=2; pageNumber<=totalPages; pageNumber++){
                movieData =  await axios(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${pageNumber}&language=en-US&with_genres=${genreId}`);
                movieData.data.results.map(result => this.categoryMovies.push(result));
            }
            }
            catch(error){
                alert(error);
            }
    }


    async getMovies(){
        try{
            let movieData = await axios(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${this.query}&page=1&include_adult=false`);
            movieData.data.results.map(result => this.allMovies.push(result));
            let totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
            for(let pageNumber=2; pageNumber<=totalPages; pageNumber++){
                movieData =  await axios(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${this.query}&page=${pageNumber}&include_adult=false`);
                movieData.data.results.map(result => this.allMovies.push(result));
            }
            }
            catch(error){
                alert(error);
            }
  
    }

    async getTopRated(){
        try{
            let movieData = await axios(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1&language=en-US`);
            movieData.data.results.map(result => this.allTopRated.push(result));
            let totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
            for(let pageNumber=2; pageNumber<=totalPages; pageNumber++){
                movieData =  await axios(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${pageNumber}`);
                movieData.data.results.map(result => this.allTopRated.push(result));
            }
            }
            catch(error){
                alert(error);
            }
    }

    async getNowPlaying(){
        try{
            let movieData = await axios(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=1&language=en-US`);
            movieData.data.results.map(result => this.allNowPlaying.push(result));
            let totalPages = movieData.data.total_pages > 5 ? 5 : movieData.data.total_pages;
            for(let pageNumber=2; pageNumber<=totalPages; pageNumber++){
                movieData =  await axios(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${pageNumber}&language=en-US`);
                movieData.data.results.map(result => this.allNowPlaying.push(result));
            }
            }
            catch(error){
                alert(error);
            }
    }
}

export default Search;

