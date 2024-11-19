const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = function(event) {
    const msgData = JSON.parse(event.data);
    const messagesContainer = document.getElementById('messages');
    const msgElement = document.createElement('div');
    msgElement.innerText = `${msgData.username}: ${msgData.message}`;
    messagesContainer.appendChild(msgElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
};

function sendMessage() {
    const username = document.getElementById('username').value || 'Anonymous';
    const messageInput = document.getElementById('messageInput');
    const msg = messageInput.value;

    if (msg) {
        socket.send(JSON.stringify({ username, message: msg }));
        messageInput.value = '';
    }
}
