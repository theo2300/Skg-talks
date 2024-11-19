// Firebase Config (replace with your Firebase project details)
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
const storage = firebase.storage();

// DOM Elements
const usernameInput = document.getElementById('username');
const themeColorInput = document.getElementById('themeColor');
const applySettingsButton = document.getElementById('applySettings');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const imageInput = document.getElementById('imageInput');
const openImageInputButton = document.getElementById('openImageInput');
const sendMessageButton = document.getElementById('sendMessage');

// User Settings
let username = 'Anonymous';
let themeColor = '#ffcc00';

// Apply settings
applySettingsButton.addEventListener('click', () => {
  username = usernameInput.value || 'Anonymous';
  themeColor = themeColorInput.value;
});

// Open image input
openImageInputButton.addEventListener('click', () => {
  imageInput.click();
});

// Send message
sendMessageButton.addEventListener('click', async () => {
  const message = messageInput.value.trim();
  const image = imageInput.files[0];

  if (!message && !image) return;

  let imageUrl = null;

  if (image) {
    const storageRef = storage.ref(`images/${Date.now()}_${image.name}`);
    const snapshot = await storageRef.put(image);
    imageUrl = await snapshot.ref.getDownloadURL();
  }

  const encryptedMessage = CryptoJS.AES.encrypt(message, 'secret-key').toString();

  db.collection('messages').add({
    username,
    color: themeColor,
    message: encryptedMessage,
    imageUrl,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  messageInput.value = '';
  imageInput.value = '';
});

// Real-time message updates
db.collection('messages')
  .orderBy('timestamp')
  .onSnapshot((snapshot) => {
    messagesDiv.innerHTML = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      const decryptedMessage = CryptoJS.AES.decrypt(data.message, 'secret-key').toString(CryptoJS.enc.Utf8);

      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');
      messageDiv.style.backgroundColor = data.color;

      const content = `
        <strong>${data.username}</strong><br>
        <p>${decryptedMessage}</p>
      `;

      if (data.imageUrl) {
        messageDiv.innerHTML = `${content}<img src="${data.imageUrl}" alt="Image">`;
      } else {
        messageDiv.innerHTML = content;
      }

      messagesDiv.appendChild(messageDiv);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });