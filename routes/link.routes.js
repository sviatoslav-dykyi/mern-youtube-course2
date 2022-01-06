const { Router } = require('express');
const Link = require('../models/Link');
const router = Router();
const auth = require('../middleware/auth.middleware');
const shortid = require('shortid');
const config = require('config');

router.post('/generate', auth, async (req, res) => {
  console.log(333)
  try {       
    const baseUrl = config.get('baseUrl');    
    const { from } = req.body;    
    const code = shortid.generate();
    const existing = await Link.findOne({ from });
    
    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + '/t/' + code;
    
    const link = new Link({
      code, to, from, owner: req.user.userId
    });

    await link.save();
    // 201 - status created
    res.status(201).json({ link })

  } catch (e) {
    res.status(500).json({ message: 'Чтото пошло не так - поробуйте снова' })
  }
});

router.get('/', auth, async (req, res) => {
  try {   
    const links = await Link.find({ owner: req.user.userId }); // req.user - decoded Token { userId: 1q2w3e4r }
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: 'Чтото пошло не так - поробуйте снова' })
  }
});

router.get('/:id', auth, async (req, res) => {
  try {   
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: 'Чтото пошло не так - поробуйте снова' })
  }
});

module.exports = router;