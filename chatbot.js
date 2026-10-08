(function() {
    function initChatsongBot() {
        if (document.getElementById('chatsong-bot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatsong-bot-container';
        container.innerHTML = `
            <button id="cb-toggle-btn" onclick="toggleChatsongBot()">💬 Chatsong AI Hulp</button>
            <div id="cb-window" style="display:none;">
                <div id="cb-header">
                    <span>Chatsong AI Assistent 🎵</span>
                    <button onclick="toggleChatsongBot()">×</button>
                </div>
                <div id="cb-messages">
                    <div class="b-msg">Hoi! Welkom op Chatsong. Ik ben de AI-assistent en ken letterlijk alle functies, extensies en regels van ons forum. Stel hier al je vragen! 🎵</div>
                </div>
                <div id="cb-input-area">
                    <input type="text" id="cb-input" placeholder="Typ je vraag over het forum..." onkeypress="handleChatsongKey(event)">
                    <button onclick="sendChatsongMsg()">→</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.innerHTML = `
            #chatsong-bot-container { position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            #cb-toggle-btn { background: #8a2be2; color: #fff; border: none; padding: 12px 18px; border-radius: 30px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s ease; }
            #cb-toggle-btn:hover { transform: scale(1.05); }
            #cb-window { position: absolute; bottom: 60px; right: 0; width: 380px; height: 540px; background: #ffffff; border: 1px solid #ddd; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 10px 28px rgba(0,0,0,0.25); overflow: hidden; }
            #cb-header { background: #1a1a1a; color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 14px; }
            #cb-header button { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; }
            #cb-messages { flex: 1; padding: 12px; overflow-y: auto; font-size: 13px; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
            .b-msg { background: #e9ecef; padding: 10px 14px; border-radius: 8px; max-width: 90%; align-self: flex-start; color: #333; line-height: 1.4; word-wrap: break-word; white-space: pre-line; }
            .u-msg { background: #8a2be2; color: #fff; padding: 10px 14px; border-radius: 8px; max-width: 90%; align-self: flex-end; line-height: 1.4; word-wrap: break-word; }
            #cb-input-area { display: flex; border-top: 1px solid #ddd; padding: 8px; background: #fff; }
            #cb-input { flex: 1; border: 1px solid #ccc; padding: 10px; border-radius: 6px; outline: none; font-size: 13px; }
            #cb-input:focus { border-color: #8a2be2; }
            #cb-input-area button { background: #8a2be2; color: #fff; border: none; padding: 10px 16px; margin-left: 6px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        `;
        document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatsongBot);
    } else {
        initChatsongBot();
    }

    window.toggleChatsongBot = function() {
        const win = document.getElementById('cb-window');
        if (!win) return;
        win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    };

    window.handleChatsongKey = function(e) {
        if (e.key === 'Enter') window.sendChatsongMsg();
    };

    // 🚀 DYNAMISCHE AI-VERBINDING DIE ALLE BRONCODE & EXTENSIES BEGRIEPT
    window.sendChatsongMsg = async function() {
        const input = document.getElementById('cb-input');
        const messages = document.getElementById('cb-messages');
        const text = input ? input.value.trim() : '';
        if (!text || !messages) return;

        messages.innerHTML += `<div class="u-msg">${escapeHtml(text)}</div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        const typingId = 'typing-' + Date.now();
        messages.innerHTML += `<div id="${typingId}" class="b-msg">Even zoeken in alle forum-functies... 🎵</div>`;
        messages.scrollTop = messages.scrollHeight;

        try {
            // BELANGRIJK: Koppel dit aan je eigen beveiligde backend endpoint of serverless script 
            // dat je API-sleutel beschermt tegen diefstal uit de frontend source code.
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer JOUW_BEVEILIGDE_API_SLEUTEL_OF_BACKEND_ENDPOINT' 
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `Je bent de superintelligente forum-assistent van Chatsong.nl (een geavanceerd Flarum platform voor muzikanten en indie artists met allerlei maatwerk extensies, link-fixers, usercards, live chatrooms, mobile quick-nav bars, en release-regels zoals minstens 150 tekens en geen bare links). 
                            Nieuwe leden zijn vaak leken en stellen vage of praktische vragen over hoe alles werkt in de source code, profielen, instellingen, of muziek delen. 
                            Beantwoord elke mogelijke vraag direct, glashelder, vriendelijk en in het Nederlands, ongeacht welke extensie of functie ze bedoelen.`
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ],
                    max_tokens: 400
                })
            });

            const data = await response.json();
            const reply = data.choices && data.choices[0] ? data.choices[0].message.content : "Excuses, ik kon even geen verbinding maken met het forum-geheugen.";

            document.getElementById(typingId).remove();
            messages.innerHTML += `<div class="b-msg">${escapeHtml(reply)}</div>`;
        } catch (error) {
            document.getElementById(typingId).remove();
            messages.innerHTML += `<div class="b-msg">Oeps, er ging even iets mis bij het ophalen van het antwoord. Probeer het gerust nog een keer!</div>`;
        }

        messages.scrollTop = messages.scrollHeight;
    };

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
})();
