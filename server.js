const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка парсера для JSON
app.use(bodyParser.json());
app.use(express.static('public'));

// Создание бота
const token = '7802207571:AAEtyYS0xqzXn6K8GoYzas77qJPg5RF4Zlc'; // Замените на токен вашего бота
const bot = new TelegramBot(token, { polling: true });

// Данные пользователя, которые будут отображаться на странице
let userData = {};

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, 'Добро пожаловать! Нажмите кнопку, чтобы отправить ваши данные.', {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: "Отправить данные",
						callback_data: "send_data"
					}
				]
			]
		}
	});
});

// Обработка нажатия кнопки
bot.on('callback_query', (callbackQuery) => {
	const chatId = callbackQuery.message.chat.id;

	if (callbackQuery.data === 'send_data') {
		// Формируем данные пользователя
		userData = {
			id: callbackQuery.from.id,
			first_name: callbackQuery.from.first_name,
			last_name: callbackQuery.from.last_name || 'Не указана',
			username: callbackQuery.from.username || 'Не указан'
		};

		// Уведомляем пользователю
		bot.sendMessage(chatId, "Данные успешно отправлены!");
	}
});

// Главный маршрут
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка POST запросов на '/api/data'
app.get('/api/data', (req, res) => {
	res.json(userData); // Отправляем данные пользователя в формате JSON
});

// Запуск сервера
app.listen(PORT, () => {
	console.log(`Сервер запущен на http://localhost:${PORT}`);
});
