import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
const PORT = 3000;

const users = [
  { username: 'admin', password: 'admin12345' }
];

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

function checkAuth(req: Request, res: Response, next: NextFunction) {
  const username = req.cookies.username;

  if (!username) {
    return res.redirect('/login');
  }

  next();
}

app.get('/', (req: Request, res: Response) => {
  const username = req.cookies.username;
  res.render('index', { username });
});

app.get('/login', (req: Request, res: Response) => {
  res.render('login', { error: null });
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!foundUser) {
    return res.render('login', { error: 'Invalid credentials' });
  }

  res.cookie('username', username);
  res.redirect('/profile');
});

app.get('/profile', checkAuth, (req: Request, res: Response) => {
  const username = req.cookies.username;
  res.render('profile', { username });
});

app.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('username');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});