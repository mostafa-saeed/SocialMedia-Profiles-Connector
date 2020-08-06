const { connect } = require('mongoose');
const { DB_CONNECTION_STRING } = require('../config.js');

(async () => {
  await connect(DB_CONNECTION_STRING);
  console.log('CONNECTED!');
})();
