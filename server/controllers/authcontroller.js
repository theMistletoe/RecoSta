const admin = require('./../firebase-service.js')
const nodemailer = require("nodemailer");

module.exports = createUser = async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  admin.auth().createUser({
    email,
    password,
  })
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for
      // this URL must be whitelisted in the Firebase Console.
      url: 'http://localhost:3000',
    };
  
    admin.auth().generateEmailVerificationLink(userRecord.email, actionCodeSettings)
    .then((link) => {
  
      var smtp = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'studytimerformail@gmail.com',
          pass: 'Studytimer4mail'
        }
      });
  
      var message = {
        from: 'studytimerformail@gmail.com',
        to: userRecord.email,
        subject: 'StudyTImer アカウント確認用メール',
        text: `StudyTImerのアカウント確認用メールです。\n下記リンクをクリックしてアカウントを確認してください。\n${link}!`
      };
  
      try{
        smtp.sendMail(message, function(error, info){
          // エラー発生時
          if(error){
              console.log("send failed");
              console.log(error.message);
              return next(error);
          }
          
          // 送信成功
          console.log("send successful");
          console.log(info.messageId);
        });
      }catch(e) {
          console.log("Error",e);
          return next(e);
      }
      
      // return sendCustomVerificationEmail(user.email, user.email, link);
    })
    .catch((error) => {
      // Some error occurred.
      console.log(error);
      return next(error);
    });
  
      // const customToken = await admin.auth().createCustomToken(sentUser.uid);
      // await firebase.auth().signInWithCustomToken(customToken);
      // const mycurrentUser = firebase.auth().currentUser;
      // await mycurrentUser.sendEmailVerification();
      // res.locals.data = mycurrentUser;
  
      return res.send(userRecord);
  })
  .catch(function(error) {
    console.log('Error creating new user:', error);
    return next(error);
  });

}
