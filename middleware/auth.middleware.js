/* middleware - це звичайна функція, яка допомагає перехватувати певні дані та робити логіку 
*/
const jwt = require('jsonwebtoken');
const config = require('config');

// next- позволяє пролдовжити виконання запиту
module.exports = (req, res, next) => {
  // Options - спец метод в REST API який провіряє доступність сервера
  if (req.method === 'OPTIONS') { 
    // то продовжуємо робити запит
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' });
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded;
    
    next();

  } catch (e) {
    //console.log(res);
    res.status(401).json({ message: 'Нет авторизации' });
  }
}