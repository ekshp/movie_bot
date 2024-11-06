import movieList from '../db/movie-list';
import { baseUrl } from '../config';

async function searchMovieByGenre(bot, msg, genre) {
    const chatId = msg.chat.id;
    const genreKey = Object.keys(genre).find(key => genre[key] === genre);
    const filteredMovies = movieList.filter(movie => movie.genre === genreKey && movie.kinopoisk > 6);    
    const randomMovie = filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
    const movieInfo = `${randomMovie.name}, ${randomMovie.year} - ${baseUrl}${randomMovie.id}\nРейтинг: ${randomMovie.kinopoisk}`;
    await bot.telegram.sendMessage(chatId, `Случайный фильм в жанре "${genre}":\n${movieInfo}`);   
}

export default { searchMovieByGenre };
