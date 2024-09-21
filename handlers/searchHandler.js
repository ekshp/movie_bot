const fs = require('fs');
const path = require('path');
const movieList = require('../db/movie-list.json');
const config = require('../config');

async function searchMovieByName(bot, msg) {
    const chatId = msg.chat.id;
    const title = msg.text.trim();
    try {
        // const movies = movieList.filter(movie => {
        //     const movieName = movie.name.toLowerCase().split(/\s+/); 
        //     return movieName.includes(title.toLowerCase()); 
        // });
        const movies = movieList.filter(movie => movie.name.toLowerCase().includes(title.toLowerCase()));
        if (movies.length > 0) {
            const links = movies.map(movie => `${movie.name}, ${movie.year} - ${config.baseUrl}${movie.id}`).join('\n');
            await bot.telegram.sendMessage(chatId, `${links}`);
        } else {
            await bot.telegram.sendMessage(chatId, 'Извините, фильм не найден, пропробуйте ввести ID с сайта Кинопоиск, так нам будет легче найти нужный фильм.');
        }
    } catch (error) {
        console.error(error);
        await bot.telegram.sendMessage(chatId, 'Произошла ошибка при поиске фильма.');
        const logMessage = `${new Date().toISOString()} - Error: ${error.message}\nStack: ${error.stack}\nChat ID: ${chatId}\nTitle: ${title}\n\n`;
        fs.appendFile(path.join(__dirname, 'error.log'), logMessage, (err) => {
            if (err) {
                console.error('Ошибка при записи лога в файл:', err);
            }
        });
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

        const logMessage = `${new Date().toISOString()} - Error: ${error.message}\nStack: ${error.stack}\nChat ID: ${chatId}\nID: ${id}\n\n`;
        fs.appendFile(path.join(__dirname, 'error.log'), logMessage, (err) => {
            if (err) {
                console.error('Ошибка при записи лога в файл:', err);
            }
        });
    }
}

module.exports = { searchMovieByName, searchMovieById };
