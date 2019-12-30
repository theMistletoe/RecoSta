const createUser = require('./controllers/authcontroller.js');
const checkIfAuthenticated = require('./middlewares/auth-middleware.js');
const admin = require('./firebase-service.js')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // allow domain
    res.header("Access-Control-Allow-Origin", "https://timer-d73c3.web.app"); // allow domain
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authorization, Accept");
    next();
  });

// いい感じにaccountID入れる
// const userId = 'motoakiID'


let db = admin.firestore();

// curl -X POST -H "Content-Type: application/json" -d '{"email":"pxaxcxixfxixcxa@gmail.com", "phoneNumber":"+11234567890", "password":"password", "displayName":"John"}' http://localhost:3003/auth/signup
// curl -X POST -H "Content-Type: application/json" -d '{"email":"katachiwotodomete@gmail.com", "password":"password"}' http://localhost:3003/api/v1/auth/signup
app.post('/api/v1/auth/signup', createUser);

// curl http://localhost:3003/api/v1/studytime
app.get('/api/v1/studytime', checkIfAuthenticated, async (req, res, next) => {

    db.collection('main_studytimes').doc(req.authId).collection('sub_studytimes').get()
    .then((snapshot) => {
        var studytimes = new Array();
        snapshot.forEach((doc) => {
            studytimes.push(doc.data());
        });
        
        res.json(studytimes);
    })
    .catch((err) => {
        next(err);
    });
});

// curl -X POST -H "Content-Type: application/json" -d '{"id":"sensuikan1973", "date":"2011121", "studytime":"01:32:45"}' http://localhost:3003/api/v1/studytime
app.post('/api/v1/studytime', checkIfAuthenticated, async (req, res, next) => {
    var newData = req.body;
    console.log('authId:', req.authId);

    db.collection('main_studytimes').doc(req.authId).collection('sub_studytimes').add(newData).then(ref => {
        res.send('success')
    }).catch(function (error) {
        console.log(error);
        next(error);
    });

});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
