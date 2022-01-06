const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); 
const router = Router();

// router
//   .use(bodyParser.urlencoded({ extended: false }))
//   .use(bodyParser.json());

// /api/auth/register  - підготовлюємо два ендпоінти з якими будемо працювати
router.post(
  '/register', 
  // передаємо масив міделвеєрів які будуть робити валідацію
  [
    check('email', 'Некоректний email').isEmail(),
    check('password', 'Минимальная длина пароля - 6 симоволов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
  try {
    
    const errors = validationResult(req); // express валідує вхідні поля тут
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректние дание при регистрации' 
      })
    }
    console.log('req.body', req.body)
    const { email, password } = req.body;    
    const candidate = await User.findOne({ email });
    
    if (candidate) {
      return res.status(400).json({ message: 'Такий користувач уже існує' })
    }
    
    const haashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: haashedPassword });
    
    await user.save();
    
    res.status(200).json({ message: 'Користувач створений' });

  } catch (e) {
    res.status(500).json({ message: 'Чтото пошло не так - поробуйте снова' })
  }
});

// /api/auth/login
router.post(
  '/login', 
  [
    check('email', 'Введите коректний email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req); // express валідує вхідні поля тут

    if (!errors.isEmpty) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некоректние дание при входе в систему' 
      })
    }
    
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: 'Користувач не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'неверний пароль, попробуйте еше раз' });
    }

    const token = jwt.sign(
      // дані які будуть зашифровані в токені
      { userId: user.id },
      // секретний ключ
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user.id })

    

  } catch (e) {
    res.status(500).json({ message: 'Чтото пошло не так - поробуйте снова' })
  }
});

module.exports = router;

