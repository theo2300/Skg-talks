document.getElementById("send").addEventListener("click", function() {
    const messageInput = document.getElementById("message");
    const messageText = messageInput.value;
    
    if (messageText) {
        const messageDiv = document.createElement("div");
        messageDiv.textContent = messageText;
        document.getElementById("messages").appendChild(messageDiv);
        messageInput.value = ""; // Clear the input
        messageDiv.scrollIntoView(); // Scroll to the newest message
    }
});
