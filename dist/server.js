"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3000;
const users = [
    { username: 'admin', password: 'admin12345' }
];
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../src/views'));
function checkAuth(req, res, next) {
    const username = req.cookies.username;
    if (!username) {
        return res.redirect('/login');
    }
    next();
}
app.get('/', (req, res) => {
    const username = req.cookies.username;
    res.render('index', { username });
});
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const foundUser = users.find((u) => u.username === username && u.password === password);
    if (!foundUser) {
        return res.render('login', { error: 'Invalid credentials' });
    }
    res.cookie('username', username);
    res.redirect('/profile');
});
app.get('/profile', checkAuth, (req, res) => {
    const username = req.cookies.username;
    res.render('profile', { username });
});
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/login');
});
app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});
