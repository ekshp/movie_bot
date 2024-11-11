import movieList from '../db/movie-list.json' assert { type: 'json' };
import { baseUrl } from '../config.js';

async function searchMovieByName(bot, msg) {
  const chatId = msg.chat.id;
  const title = msg.text.trim();
  try {
    const moviesRuName = movieList.filter(movie => movie.name.toLowerCase().includes(title.toLowerCase()));
    console.log(moviesRuName);
    const moviesOriginName = movieList.filter(movie => movie.origin_name.toLowerCase().includes(title.toLowerCase()));
    console.log(moviesOriginName);
    if (moviesRuName.length > 0) {
      const links = moviesRuName.map(movie => `${movie.name}, ${movie.year} - ${baseUrl}${movie.id}`).join('\n');
      await bot.telegram.sendMessage(chatId, `${links}`);
    } else if (moviesOriginName.length > 0) {
      const links = moviesOriginName.map(movie => `${movie.origin_name}, ${movie.year} - ${baseUrl}${movie.id}`).join('\n');
      await bot.telegram.sendMessage(chatId, `${links}`);
    } else {
      await bot.telegram.sendMessage(chatId, 'Извините, фильм не найден, пропробуйте ввести ID с сайта Кинопоиск, так нам будет легче найти нужный фильм.');
    }
  } catch (error) {
    console.error(error);
    await bot.telegram.sendMessage(chatId, 'Произошла ошибка при поиске фильма. Попробуйте ввести название фильма более конкретно');
  }
}


export default { searchMovieByName };
