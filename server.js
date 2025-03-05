const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const token = '7802207571:AAEtyYS0xqzXn6K8GoYzas77qJPg5RF4Zlc';
const bot = new TelegramBot(token, { polling: true });

let chatId = null;
let userData = {};
let messageHistory = [];

bot.onText(/\/start/, (msg) => {
	chatId = msg.chat.id;
	userData = {
		id: msg.from.id,
		first_name: msg.from.first_name,
		last_name: msg.from.last_name || 'Нет',
		username: msg.from.username || 'Нет'
	};
	bot.sendMessage(chatId, 'Добро пожаловать!');
});

bot.on('message', (msg) => {
	if (msg.chat.id === chatId && msg.text) {
		messageHistory.push({ sender: 'user', text: msg.text });
		bot.sendMessage(chatId, "Ваше сообщение получено!");
	}
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/bot', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'bot.html'));
});

app.get('/api/data', (req, res) => {
	const userInfo = { userData, messageHistory };
	res.json(userInfo);
});

app.post('/api/message', (req, res) => {
	const { message } = req.body;
	if (message && chatId) {
		messageHistory.push({ sender: 'bot', text: message });
		bot.sendMessage(chatId, message);
		return res.status(200).send('Сообщение отправлено в Telegram.');
	}
	res.status(400).send('Сообщение отсутствует или Chat ID недоступен.');
});

app.listen(PORT, () => {
	console.log(`Сервер запущен на http://localhost:${PORT}`);
});
