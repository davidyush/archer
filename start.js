const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.MONGO, { useNewUrlParser: true });
mongoose.Promise = Promise;
mongoose.connection.on('error', (err) => {
  console.error('err',err.message);
});

const app = require('./app');

app.set('port', process.env.PORT || 3333);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running on port ${server.address().port}`);
});
