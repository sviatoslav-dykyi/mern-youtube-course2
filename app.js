const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

const app = express(); // майбутній сервер
const PORT = config.get('port') || 5000;

app  
  .use(express.json({ extended: true })) // бо сприймає body як простий стрім а не jSON
  .use('/api/auth', require('./routes/auth.routes'))
  .use('/api/link', require('./routes/link.routes'))
  .use('/t', require('./routes/redirect.routes'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
}  


async function start() {
  try {
    await mongoose.connect(config.get('mongoUrl'), {
      //useNewUrlParams: true,
      useUnifiedTopology: true,
      //useCreateIndex: true
    });
    app.listen(PORT, () => {
      console.log(`app have benn started...on port ${PORT}`);
    })
  } catch (e) {
    console.log('SErver Error', e.message);
    process.exit(1);
  }
}

start();

