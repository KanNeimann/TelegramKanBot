import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import serviceAccount from '../src/telegram-kan-bot-firebase-adminsdk-m0r3j-d5ca61db4c.json'

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore();

const docRef = db.collection('users').doc('alovelace');

/* await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
}); */

/* const snapshot = await db.collection('users').get();
snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
}); */

const firstUser = db.collection('users').doc('alovelace');
const doc = await firstUser.get();
if (!doc.exists) {
    console.log('No such document!');
} else {
    console.log('Document data:', doc.data());
}