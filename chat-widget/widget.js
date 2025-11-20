// ===============================
// CONFIG — change this only
// ===============================
const API_URL = "https://YOUR-BACKEND-URL.com/api";
// When deployed on Render → replace above with actual URL.

// ===============================
// Widget Bootstrap
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    createWidget();
});

function createWidget() {
    const root = document.getElementById("samantha-widget-root");

    root.innerHTML = `
        <div id="samantha-launcher">
            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png" />
        </div>

        <div id="samantha-window">
            <div id="samantha-header">
                <h2>Samantha — AI Receptionist</h2>
            </div>
            <div id="samantha-messages"></div>

            <div id="samantha-input-bar">
                <input id="samantha-input" type="text" placeholder="Type your message..." />
                <button id="samantha-send">Send</button>
            </div>
        </div>
    `;

    // Event hooks
    document.getElementById("samantha-launcher").onclick = toggleChat;
    document.getElementById("samantha-send").onclick = sendMessage;
    document.getElementById("samantha-input").onkeydown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    addMessage("ai", "Hi there 👋 — I’m Samantha! How can I help you today?");
}

// ===============================
// UI Helpers
// ===============================
function toggleChat() {
    const win = document.getElementById("samantha-window");
    win.style.display = win.style.display === "flex" ? "none" : "flex";
}

function addMessage(sender, text) {
    const box = document.getElementById("samantha-messages");

    const bubble = document.createElement("div");
    bubble.className = `samantha-bubble samantha-${sender}`;
    bubble.textContent = text;

    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
}

// ===============================
// API Call to Your Backend
// ===============================
async function sendMessage() {
    const input = document.getElementById("samantha-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    try {
        const res = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: text,
                session_id: "web-session-1"
            })
        });

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullReply = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullReply += chunk;
        }

        addMessage("ai", fullReply);

    } catch (err) {
        console.error("Error talking to Samantha:", err);
        addMessage("ai", "⚠️ I’m having trouble reaching my system right now.");
    }
}
