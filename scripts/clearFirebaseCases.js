import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9OLBAGSL649cwzkDNAXsk0V-o-xIkYbY",
  authDomain: "sentinel-id-46bf9.firebaseapp.com",
  databaseURL: "https://sentinel-id-46bf9-default-rtdb.firebaseio.com",
  projectId: "sentinel-id-46bf9",
  storageBucket: "sentinel-id-46bf9.firebasestorage.app",
  messagingSenderId: "753089309330",
  appId: "1:753089309330:web:e41c777abeecb21e63544b",
  measurementId: "G-T1VKX2XT4L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearFirebaseCases() {
  console.log("Fetching all documents from Firebase Firestore 'cases' collection...");
  try {
    const snap = await getDocs(collection(db, "cases"));
    console.log(`Found ${snap.docs.length} cases in Firebase Firestore.`);
    for (const docSnap of snap.docs) {
      await deleteDoc(doc(db, "cases", docSnap.id));
      console.log(`✓ Deleted case from Firebase: ${docSnap.id}`);
    }
    console.log("SUCCESS: All cases successfully deleted from Firebase Firestore!");
  } catch (err) {
    console.error("ERROR deleting cases from Firebase:", err);
    process.exit(1);
  }
}

clearFirebaseCases();
