const movieList = require('../db/movie-list.json');
const config = require('./config');

async function searchMovie(bot, msg) {
    const chatId = msg.chat.id;
    const title = msg.text.trim();

    try {
        const movie = movieList.find(movie => movie.name.toLowerCase() === title.toLowerCase());
        
        if (movie) {
            // Если фильм найден, формирование ссылки на фильм
            const link = `${baseUrl}${movie.id}`;
            
            // Отправка сообщения с ссылкой на фильм
            await bot.telegram.sendMessage(chatId, `Фильм найден! Вот ваша ссылка: ${link}`);
        } else {
            // Если фильм не найден, отправка сообщения об этом
            await bot.telegram.sendMessage(chatId, 'Извините, фильм не найден.');
        }
    } catch (error) {
        // Обработка ошибок и отправка сообщения об ошибке
        console.error(error);
        await bot.telegram.sendMessage(chatId, 'Произошла ошибка при поиске фильма.');
    }
}

module.exports = { searchMovie };
