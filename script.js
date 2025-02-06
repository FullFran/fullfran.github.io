document.getElementById("chat-button").addEventListener("click", function() {
    var chatBox = document.getElementById("chat-box");
    chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
});

document.getElementById("send-button").addEventListener("click", async function() {
    var input = document.getElementById("chat-input");
    var message = input.value.trim();
    if (message) {
        var messages = document.getElementById("chat-messages");
        messages.innerHTML += "<div><strong>Tú:</strong> " + message + "</div>";
        input.value = "";

        // Enviar mensaje a la API del chatbot
        const response = await fetch("https://TU_API_URL/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        messages.innerHTML += "<div><strong>Chatbot:</strong> " + data.response + "</div>";
    }
});
