// // // Import the functions you need from the SDKs you need
// // // import { initializeApp } from 'firebase-admin/app';
// // // import { getDatabase } from 'firebase-admin/database';
// // // import { getAuth } from 'firebase-admin/auth';
// import * as admin from 'firebase-admin';
// import credentials from '../credentials.json';

// admin.initializeApp({
//   credential: admin.credential.cert(credentials as admin.ServiceAccount),
//   databaseURL:
//     'https://area-25011-default-rtdb.europe-west1.firebasedatabase.app',
// });

// export const db = admin.database();
// export const auth = admin.auth();

// export interface Action {
//   id: string;
//   name: string;
//   description: string;
//   service_id: string;
// }

// export interface Service {
//   id: string;
//   name: string;
//   description: string;
// }

// export const getData = async (path: string) => {
//   const dataSnapshot = await db.ref(path).once('value');
//   return dataSnapshot.val();
// };

// export const getUsers = async () => {
//   return getData('users');
// };

// export const getServices = async () => {
//   return getData('services');
// };
