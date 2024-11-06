const fs = require('fs');
const path = require('path');
const movieList = require('../db/movie-list.json');
const config = require('../config');

async function searchMovieByName(bot, msg) {
    const chatId = msg.chat.id;
    const title = msg.text.trim();
    try {
        const moviesRuName = movieList.filter(movie => movie.name.toLowerCase().includes(title.toLowerCase()));
        console.log(moviesRuName);
        const moviesOriginName = movieList.filter(movie => movie.origin_name.toLowerCase().includes(title.toLowerCase()));
        console.log(moviesOriginName);
        if (moviesRuName.length > 0) {
            const links = moviesRuName.map(movie => `${movie.name}, ${movie.year} - ${config.baseUrl}${movie.id}`).join('\n');
            await bot.telegram.sendMessage(chatId, `${links}`);
        } else if (moviesOriginName.length > 0) {
            const links = moviesOriginName.map(movie => `${movie.origin_name}, ${movie.year} - ${config.baseUrl}${movie.id}`).join('\n');
            await bot.telegram.sendMessage(chatId, `${links}`);
        } else {
            await bot.telegram.sendMessage(chatId, 'Извините, фильм не найден, пропробуйте ввести ID с сайта Кинопоиск, так нам будет легче найти нужный фильм.');
        }
    } catch (error) {
        console.error(error);
        await bot.telegram.sendMessage(chatId, 'Произошла ошибка при поиске фильма. Попробуйте ввести название фильма более конкретно');
    }
}

async function searchMovieById(bot, msg) {
    const chatId = msg.chat.id;
    const id = parseInt(msg.text.trim());  
    try {
        const movie = movieList.find(movie => movie.id === id);
        if (movie) {
            const link = `${movie.name}, ${movie.year} - ${config.baseUrl}${movie.id}`;
            await bot.telegram.sendMessage(chatId, `Фильм найден! Вот ваша ссылка: ${link}`);
        } else {
            await bot.telegram.sendMessage(chatId, 'Извините, кажется это новый фильм и мы еще не успели добавить его в раздачу.');
        }
    } catch (error) {
        await bot.telegram.sendMessage(chatId, 'Произошла ошибка при поиске фильма.');
    }
}

async function searchMovieByGenre(bot, msg, genre) {
    const chatId = msg.chat.id;
    const genreKey = Object.keys(genre).find(key => genre[key] === genre);
    const filteredMovies = movieList.filter(movie => movie.genre === genreKey && movie.kinopoisk > 6);    
    const randomMovie = filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
    const movieInfo = `${randomMovie.name}, ${randomMovie.year} - ${config.baseUrl}${randomMovie.id}\nРейтинг: ${randomMovie.kinopoisk}`;
    await bot.telegram.sendMessage(chatId, `Случайный фильм в жанре "${genre}":\n${movieInfo}`);   
}

module.exports = { searchMovieByName, searchMovieById, searchMovieByGenre };
