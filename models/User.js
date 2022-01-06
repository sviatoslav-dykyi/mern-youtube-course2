const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  // Types.ObjectId - звязка моделі користувача та певних записів в БД, ref - до якої колекції ми привзязуємося
  links: [{type: Types.ObjectId, ref: 'Link'}] 
});

module.exports = model('User', schema); // даємо назву моделі та схему по якіій вона працює