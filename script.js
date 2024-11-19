// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0uQK8EvD51XOQiguG4GIlc5IFOLWEhHU",
  authDomain: "skg-talks.firebaseapp.com",
  projectId: "skg-talks",
  storageBucket: "skg-talks.firebasestorage.app",
  messagingSenderId: "709491386308",
  appId: "1:709491386308:web:d74caca451f3570bc82691",
  measurementId: "G-0YJ8C93HWL"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

// Send a message to Firestore
sendButton.addEventListener("click", function () {
    const messageText = messageInput.value;
    if (messageText.trim() !== "") {
        db.collection("messages").add({
            text: messageText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = ""; // Clear input
    }
});

// Fetch messages from Firestore
db.collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
    messagesDiv.innerHTML = ""; // Clear previous messages
    snapshot.forEach(doc => {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = doc.data().text;
        messagesDiv.appendChild(messageDiv);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
});
