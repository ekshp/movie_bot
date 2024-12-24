import fs from 'fs/promises';

const rawData = await fs.readFile(new URL('../db/movie-list.json', import.meta.url), 'utf-8');
const movieList = JSON.parse(rawData);

export async function searchMovieByName(bot, msg) {
  const chatId = msg.chat.id;
  const title = msg.text.trim().toLowerCase();
  try {
    const exactMatches = movieList.filter(movie => movie.name.toLowerCase() === title || movie.origin_name.toLowerCase() === title);
    const wholeWordMatches = movieList.filter(movie => {
      const nameWords = movie.name.toLowerCase().split(/\s+/);
      const originNameWords = movie.origin_name.toLowerCase().split(/\s+/);
      return (nameWords.includes(title) || originNameWords.includes(title)) && !exactMatches.includes(movie);
    });
    const combinedMatches = [...exactMatches, ...wholeWordMatches];
    
    if (combinedMatches.length > 0) {
      await filterMovies(bot, combinedMatches, chatId);
    } else {
      await bot.telegram.sendMessage(chatId, 'Извините, фильм не найден, попробуйте ввести ID с сайта Кинопоиск, так нам будет легче найти нужный фильм.');
    }
  } catch (error) {
    console.error(error);
    await bot.telegram.sendMessage(chatId, 'Произошла ошибка при поиске фильма. Попробуйте ввести название фильма более конкретно');
  }
}

async function filterMovies(bot, movies, chatId) {
  const links = movies.map(movie => `${movie.name}, ${movie.year} - ${movie.iframe_url}`).join('\n');
  const maxMessageLength = 4096; // Максимальная длина сообщения в Telegram
  if (links.length > maxMessageLength) {
    const parts = splitMessage(links, maxMessageLength);
    for (const part of parts) {
      await bot.telegram.sendMessage(chatId, part);
    }
  } else {
    await bot.telegram.sendMessage(chatId, links);
  }
}

function splitMessage(message, maxLength) {
  const parts = [];
  let currentPart = '';
  const lines = message.split('\n');
  for (const line of lines) {
    if (currentPart.length + line.length + 1 > maxLength) {
      parts.push(currentPart);
      currentPart = '';
    }
    currentPart += (currentPart.length > 0 ? '\n' : '') + line;
  }
  if (currentPart.length > 0) {
    parts.push(currentPart);
  }
  return parts;
}