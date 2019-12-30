const admin = require('firebase-admin');
let serviceAccount = require('./timer-d73c3-firebase-adminsdk-5cfp3-d839639965.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// export default admin
module.exports = admin