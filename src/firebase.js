import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
//   your config
};

const app = initializeApp(firebaseConfig)

const storage = getStorage(app);

const messaging = getMessaging(app);

export { storage, messaging }