const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const { searchMovieByName, searchMovieById } = require('./handlers');
const { message } = require('telegraf/filters');

const bot = new Telegraf(config.token);

bot.start((msg) => {
    msg.reply('Добро пожаловать! Введите ключевое слово для поиска фильма:', Markup.keyboard([
        ['Поиск по ID', 'Поиск по названию'],
    ]).resize());
});

bot.hears('Поиск по ID', (msg) => {
    msg.reply('Введите ID фильма:');
    bot.on(message('text'), (msg) => {
        searchMovieById(bot, msg);
    });
});

bot.hears('Поиск по названию', (msg) => {
    msg.reply('Введите название фильма:');
    bot.on(message('text'), (msg) => {
        searchMovieByName(bot, msg);
    });
});

bot.launch();

console.log("Бот запущен...");

