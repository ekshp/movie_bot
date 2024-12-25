import movieList from '../db/movie-list.json' assert { type: 'json' };

export async function searchMovieByGenre(bot, msg, genre) {
  const chatId = msg.chat.id;
  const genreKeys = {
    "8": "Мелодрама",
    "19": "Комедия",
    "7": "Драма",
    "13": "Триллер",
    "26": "Ужасы",
    "17": "Боевик"
  };
  
  const genreKey = Object.keys(genreKeys).find(key => genreKeys[key].toLowerCase() === genre.toLowerCase());
  
  if (!genreKey) {
    await bot.telegram.sendMessage(chatId, `Извините, жанр "${genre}" не найден.`);
    return;
  }
  
  const filteredMovies = movieList.filter(movie => 
    movie.genre && Object.keys(movie.genre).includes(genreKey) && movie.kinopoisk > 6
  );
  
  if (filteredMovies.length === 0) {
    await bot.telegram.sendMessage(chatId, `Извините, не найдено фильмов в жанре "${genre}" с рейтингом выше 6.`);
    return;
  }
  
  const randomMovie = filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
  const movieInfo = `${randomMovie.name}, ${randomMovie.year} - ${randomMovie.iframe_url}\nРейтинг: ${randomMovie.kinopoisk}`;
  await bot.telegram.sendMessage(chatId, `Случайный фильм в жанре "${genre}":\n${movieInfo}`);   
}