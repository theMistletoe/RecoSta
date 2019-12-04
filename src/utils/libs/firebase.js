import * as dotenv from 'dotenv';
dotenv.config()
import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: '',
  messagingSenderId: process.env.MESSAGING_SENDER_ID
}

firebase.initializeApp(config)

export default firebase