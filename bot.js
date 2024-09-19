const { Telegraf, Markup } = require('telegraf');
const config = require('./config');
const { searchMovie, startCommand, helpCommand } = require('./handlers');

const bot = new Telegraf(config.token);

bot.start((msg) => {
    msg.reply('Добро пожаловать! Введите ключевое слово для поиска фильма:');
});

bot.on('message:text', (msg) => {
    searchMovie(bot, msg);
});

bot.launch();

console.log("Бот запущен...");

