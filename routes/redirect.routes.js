const { Router } = require('express');
const Link = require('../models/Link'); 
const router = Router();

module.exports = router;

router.get('/:code', async (req, res) => {
  try {   
    const link = await Link.findOne({ code: req.params.code });
    
    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }

    res.status(400).json({ message: 'Ссилка не найдена' })

  } catch (e) {
    res.status(500).json({ message: 'Чтото пошло не так - поробуйте снова' })
  }
});
