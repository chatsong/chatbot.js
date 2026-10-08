(function() {
    function initChatsongBot() {
        if (document.getElementById('chatsong-bot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatsong-bot-container';
        container.innerHTML = `
            <button id="cb-toggle-btn" onclick="toggleChatsongBot()">💬 Chatsong Hulp</button>
            <div id="cb-window" style="display:none;">
                <div id="cb-header">
                    <span>Chatsong Assistent 🎵</span>
                    <button onclick="toggleChatsongBot()">×</button>
                </div>
                <div id="cb-messages">
                    <div class="b-msg">Hoi! Welkom op Chatsong. Vraag me gerust alles in je eigen woorden (bijv. "hoe zet ik een nummer online", "waar vind ik mn profiel" of "wat mag wel/niet"). Ik help je op weg! 🎵</div>
                </div>
                <div id="cb-input-area">
                    <input type="text" id="cb-input" placeholder="Typ hier je vraag..." onkeypress="handleChatsongKey(event)">
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
            .b-msg { background: #e9ecef; padding: 10px 14px; border-radius: 8px; max-width: 90%; align-self: flex-start; color: #333; line-height: 1.4; word-wrap: break-word; }
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

    // 🎵 GIGANTISCHE LEKEN-KENNISBANK (VOL DATING MET DAGELIJKS TAALGEBRUIK)
    window.chatsongDB = [
        // PROFIEL & ACCOUNT (LEKEN-TAAL)
        {
            k: ["profiel", "account", "naam", "foto", "avatar", "bio", "instellingen", "settings", "ikzelf", "mijzelf", "wie ben ik", "wijzigen", "aanpassen"],
            a: "👤 **Je profiel instellen:** Klik rechtsboven op je ronde profielfoto (avatar) en kies **'Settings'**. Daar kun je:\n- Je **Profile** tab openen om een korte bio (max 200 tekens) te schrijven.\n- Je profielfoto aanpassen.\n- Je social media knoppen (Instagram, Spotify, TikTok, SoundCloud) toevoegen.\n- Klik onderaan op **'Save'** om het op te slaan!"
        },
        {
            k: ["usercard", "visitekaartje", "kaartje", "popup", "wie is dit"],
            a: "🪪 **UserCard:** Dat is het handige pop-up visitekaartje dat tevoorschijn komt zodra je op iemands naam of foto klikt. Je ziet daar direct iemands bio en social media kanalen."
        },

        // MUZIEK POSTEN & REGELS (LEKEN-TAAL)
        {
            k: ["nummer", "liedje", "track", "muziek", "posten", "delen", "uploaden", "plaatsen", "link", "bare link", "150", "tekens", "waarom", "fout", "verwijderd", "regels"],
            a: "⚠️ **Muziek posten & de regels:**\n1. Ga naar de juiste categorie (bijv. *Releases* of *Feedback*) en klik op **'Start Discussion'**.\n2. **Belangrijke regel:** Plaats nooit zomaar een kale link ('bare link'). \n3. Zet altijd de titel in het formaat: *Artiest - Titel [Genre]*.\n4. Schrijf **minimaal 150 tekens** aan tekst/uitleg over je track.\n5. Het forum maakt er daarna automatisch een mooie visuele speler van!"
        },

        // BERICHTEN TYPEN & EDITOR (LEKEN-TAAL)
        {
            k: ["typen", "schrijven", "tekst", "klaar", "post", "verzenden", "knop", "icoon", "plaatje", "foto toevoegen", "vet", "schuin", "opmaak"],
            a: "💬 **Bericht schrijven:**\n- Als je klaar bent met typen in het tekstvak, klik je onderaan op de knop **'Post'** of **'Publish'** om het online te zetten.\n- Onderin de balk vind je handige knopjes om tekst **vet** of *schuin* te maken, of om een plaatje/foto van je computer toe te voegen."
        },

        // NAVIGEREN & WEGWIJS (LEKEN-TAAL)
        {
            k: ["waar", "menu", "zoeken", "vind", "weg", "kwijt", "home", "categorie", "dropdown", "mobiel", "balk", "onderin"],
            a: "🧭 **Wegwijs op het forum:**\n- **Navigatie:** Gebruik het menu of de uitklapmenu's (dropdowns) om te filteren op recent of populair.\n- **Zoeken:** Klik bovenaan op het vergrootglas-icoon om te zoeken naar artiesten of tags (zoals `#Collab`).\n- **Mobiel:** De balk onderin je scherm geeft je directe knoppen naar de homepagina, zoekbalk en je profiel."
        },

        // CHATTEN & CONTACT (LEKEN-TAAL)
        {
            k: ["chat", "praten", "live", "room", "bericht", "dm", "privé", "collab", "samenwerken"],
            a: "🎵 **Contact & Extra's:**\n- **Live Music Room:** Om direct met andere leden te kletsen.\n- **Privéberichten (DM):** Klik op iemands profiel of het envelopje om een persoonlijk bericht te sturen.\n- **Vraag & Aanbod:** Voor het zoeken naar producers, mix/master of collabs."
        }
    ];

    window.toggleChatsongBot = function() {
        const win = document.getElementById('cb-window');
        if (!win) return;
        win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    };

    window.handleChatsongKey = function(e) {
        if (e.key === 'Enter') window.sendChatsongMsg();
    };

    // 🧠 SLIMME LEKEN-MATCHING MET EEN ULTIEME FALLBACK
    window.sendChatsongMsg = function() {
        const input = document.getElementById('cb-input');
        const messages = document.getElementById('cb-messages');
        const text = input ? input.value.trim() : '';
        if (!text || !messages) return;

        messages.innerHTML += `<div class="u-msg">${escapeHtml(text)}</div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        const userQuery = text.toLowerCase();
        const userWords = userQuery.split(/\s+/).filter(w => w.length > 1);

        // Ultieme leken-fallback als ze iets heel geks typen
        let bestAnswer = "Ik begrijp je vraag niet helemaal, maar geen paniek! Als leek kun je hier op het forum het beste even letten op:\n• **Profiel instellen:** Klik rechtsboven op je foto → Settings.\n• **Muziek delen:** Gebruik een titel + minstens 150 tekens uitleg (geen kale link).\n• **Hulp nodig?** Vraag het gerust even in de chat of aan een moderator! 🎵";
        let highestScore = 0;

        if (window.chatsongDB && Array.isArray(window.chatsongDB)) {
            window.chatsongDB.forEach(item => {
                let score = 0;
                item.k.forEach(keyword => {
                    const kw = keyword.toLowerCase();
                    if (userQuery.includes(kw)) {
                        score += kw.length * 4;
                    }
                    userWords.forEach(word => {
                        if (kw.includes(word) || word.includes(kw)) {
                            score += Math.min(kw.length, word.length) * 2;
                        }
                    });
                });

                if (score > highestScore) {
                    highestScore = score;
                    bestAnswer = item.a;
                }
            });
        }

        setTimeout(() => {
            messages.innerHTML += `<div class="b-msg" style="white-space: pre-line;">${escapeHtml(bestAnswer)}</div>`;
            messages.scrollTop = messages.scrollHeight;
        }, 300);
    };

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
})();
