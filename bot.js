const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const { searchMovieByName } = require('./handlers');
const { message } = require('telegraf/filters');

const bot = new Telegraf(config.token);

bot.start((msg) => {
    msg.reply('Добро пожаловать! Введите ключевое слово для поиска фильма:', Markup.keyboard([
        ['Поиск по ID', 'Поиск по названию'],
    ]).resize());
});

bot.on(message('text'), (msg) => {
    searchMovieByName(bot, msg);
});

bot.launch();

console.log("Бот запущен...");

