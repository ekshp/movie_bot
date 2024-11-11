import movieList from '../db/movie-list.json';
import { baseUrl } from '../config.js';


async function searchMovieById(bot, msg) {
  const chatId = msg.chat.id;
  const id = parseInt(msg.text.trim());  
  try {
      const movie = movieList.find(movie => movie.id === id);
      if (movie) {
          const link = `${movie.name}, ${movie.year} - ${baseUrl}${movie.id}`;
          await bot.telegram.sendMessage(chatId, `Фильм найден! Вот ваша ссылка: ${link}`);
      } else {
          await bot.telegram.sendMessage(chatId, 'Извините, кажется это новый фильм и мы еще не успели добавить его в раздачу.');
      }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
      await bot.telegram.sendMessage(chatId, 'Произошла ошибка при поиске фильма.');
  }
}

export default { searchMovieById };
