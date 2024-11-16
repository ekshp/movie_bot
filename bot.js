import { Telegraf, Markup } from 'telegraf';
import { token } from './config.js';
import movieBot from './index.js';

const { searchMovieByName, searchMovieById, searchMovieByGenre } = movieBot;

const bot = new Telegraf(token);

let currentState = 'mainMenu';

const mainMenu = (msg) => {
    currentState = 'mainMenu';
    msg.reply('Добро пожаловать! Введите ключевое слово для поиска фильма:', Markup.keyboard([
        ['Поиск по ID', 'Поиск по названию'],
        ['Рандомный фильм по жанру']
    ]).resize());
};

bot.start((msg) => {
    mainMenu(msg);
});

bot.hears('Поиск по ID', (msg) => {
    currentState = 'searchById';
    msg.reply('Введите ID фильма:');
});

bot.hears('Поиск по названию', (msg) => {
    currentState = 'searchByName';
    msg.reply('Введите название фильма:');
});

bot.hears('Рандомный фильм по жанру', (msg) => {
    currentState = 'searchByGenre';
    msg.reply('Выберите жанр фильма:', Markup.keyboard([
        ['Мелодрама', 'Драма'],
        ['Комедия', 'Триллер'],
        ['Ужасы', 'Боевик'],
        ['Главное меню']
    ]).resize());
});

bot.hears('Главное меню', (msg) => {
    mainMenu(msg);
});

bot.on('text', (msg) => {
    if (currentState === 'searchById') {
        searchMovieById(bot, msg);
    } else if (currentState === 'searchByName') {
        searchMovieByName(bot, msg);
    } else if (currentState === 'searchByGenre') {
        const genre = msg.message.text;
        if (genre === 'Главное меню') {
            mainMenu(msg);
        } else {
            searchMovieByGenre(bot, msg, genre);
        }
    }
});

bot.launch();

console.log("Бот запущен...");

