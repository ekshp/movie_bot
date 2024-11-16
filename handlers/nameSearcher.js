import fs from 'fs/promises';

const rawData = await fs.readFile(new URL('../db/movie-list.json', import.meta.url), 'utf-8');
const movieList = JSON.parse(rawData);

export async function searchMovieByName(bot, msg) {
  const chatId = msg.chat.id;
  const title = msg.text.trim();
  try {
    const moviesRuName = movieList.filter(movie => movie.name.toLowerCase().includes(title.toLowerCase()));
    const moviesOriginName = movieList.filter(movie => movie.origin_name.toLowerCase().includes(title.toLowerCase()));
    if (moviesRuName.length > 10) {
      await filterAndSortMovies(bot, moviesRuName, chatId);
    } else if (moviesOriginName.length > 10) {
      await filterAndSortMovies(bot, moviesOriginName, chatId);
    } else if (moviesRuName.length > 0) {
      await filterMovies(bot, moviesRuName, chatId);
    } else if (moviesOriginName.length > 0) {
      await filterMovies(bot, moviesOriginName, chatId);
    } else {
      await bot.telegram.sendMessage(chatId, 'Извините, фильм не найден, пропробуйте ввести ID с сайта Кинопоиск, так нам будет легче найти нужный фильм.');
    }
  } catch (error) {
    console.error(error);
    await bot.telegram.sendMessage(chatId, 'Произошла ошибка при поиске фильма. Попробуйте ввести название фильма более конкретно');
  }
}

async function filterMovies(bot, movies, chatId) {
  const links = movies.map(movie => `${movie.name}, ${movie.year} - ${movie.iframe_url}`).join('\n');
  await bot.telegram.sendMessage(chatId, `${links}`);
}

async function filterAndSortMovies(bot, movies, chatId) {
  const sortedMovieList = await movies.sort((a, b) => b.kinopoisk - a.kinopoisk);
  console.log(sortedMovieList);
  const links = sortedMovieList.slice(0, 10).map(movie => `${movie.name}, ${movie.year} - ${movie.iframe_url}`).join('\n');
  await bot.telegram.sendMessage(chatId, `${links}`);
}
