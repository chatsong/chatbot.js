(function() {
    function initChatsongBot() {
        if (document.getElementById('chatsong-bot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatsong-bot-container';
        container.innerHTML = `
            <button id="cb-toggle-btn" onclick="toggleChatsongBot()">💬 Chatsong AI Hulp</button>
            <div id="cb-window" style="display:none;">
                <div id="cb-header">
                    <span>Chatsong Assistant 🎵</span>
                    <button onclick="toggleChatsongBot()">×</button>
                </div>
                <div id="cb-messages">
                    <div class="b-msg">Hoi! Welkom op Chatsong.nl. Ik ben je forumassistent en weet alles over profielen, usercards, mobile tabs, de composer, uploaden, regels en navigatie. Vraag me gerust alles! 🎵</div>
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

    // 🎵 ALLESOMVATTENDE KENNISBANK: PROFIEL, USERCARD, MOBILE TABS, COMPOSER, TOPICS & NAVIGATIE
    window.chatsongDB = [
        // --- PROFIEL & SETTINGS ---
        {
            k: ["hoe kom ik bij profiel", "waar is mijn profiel", "profiel openen", "settings vinden", "instellingen"],
            a: "👤 Klik rechtsboven (of in je mobile menu) op je **avatar (profielfoto)** → Kies **'Settings'**. Daar vind je al je account-instellingen en je **Profile** tab om je gegevens aan te passen."
        },
        {
            k: ["wat kan ik met mijn profiel", "profiel opties", "wat staat er op profiel"],
            a: "📋 Op je profiel zie je jouw bio, avatar, social media links, je gastenboek waar anderen berichten achterlaten, en je 'Activity'-tab met al je gestarte discussies en reacties."
        },
        {
            k: ["hoe schrijf ik een bio", "biografie", "wat zet ik in bio", "tekst op profiel"],
            a: "✍️ Ga naar Settings → Profile. In het veld 'Bio' typ je een korte omschrijving van jezelf (max 200 tekens, ongeveer 5 regels). Vertel iets over je muziekstijl of instrumenten!"
        },
        {
            k: ["hoe save ik de tekst", "opslaan", "save knop", "wijzigingen opslaan", "bewaren"],
            a: "💾 Klaar met het aanpassen van je bio of profiel? Scroll helemaal naar beneden op de pagina en klik op de knop **'Save'** of **'Save Changes'**. Je wijzigingen worden direct opgeslagen."
        },
        {
            k: ["social media profielen invullen", "instagram link", "spotify toevoegen", "soundcloud", "tiktok", "links op profiel"],
            a: "📱 In Settings → Profile, scroll naar het kopje **'Social Media'**. Plak daar de volledige URL's van je Instagram, YouTube, TikTok, Spotify of SoundCloud profielen en klik op Save."
        },

        // --- USERCARD ---
        {
            k: ["usercard", "wat is een usercard", "wat betekent usercard", "waar vind ik die usercard", "visitekaartje"],
            a: "🪪 Je **UserCard** is jouw digitale visitekaartje op Chatsong! Als iemand op jouw gebruikersnaam of avatar klikt, verschijnt deze pop-upkaart met je bio, avatar en social media links."
        },

        // --- MOBILE TAB & QUICK NAV ---
        {
            k: ["mobile tab", "mobiele navigatie", "cs-mobile-quick-nav", "snelle knoppen onderin", "mobiel menu"],
            a: "📱 De mobile quick-nav bar onderaan je scherm is speciaal gemaakt voor mobiele gebruikers. Je vindt er snelle knoppen om direct naar de Home, Categorieën, Zoekbalk, Notificaties en je Profiel te springen!"
        },

        // --- COMPOSER & POSTEN (ICONS, UPLOAD, KLAAR) ---
        {
            k: ["hoe start ik een topic", "nieuwe discussie", "start discussion", "onderwerp beginnen", "bericht maken"],
            a: "💬 Klik op een categorie (bijv. Releases of Feedback) en klik op de knop **'Start Discussion'**. Vul een duidelijke titel in en type je bericht in de tekstbox."
        },
        {
            k: ["wat druk ik op als ik klaar ben", "posten", "publiceren", "verzenden", "klaar met typen", "publiceer knop"],
            a: "🚀 Ben je klaar met typen en controleren? Kijk onderaan de tekstbox (composer) en klik op de knop **'Post'** of **'Publish'**. Je discussie of reactie staat direct online!"
        },
        {
            k: ["iconen onderin de tekst", "editor knoppen", "wat betekent dat icoon", "vet", "schuin", "link icoon", "formatting"],
            a: "🔤 Onderin of bovenin de tekstbox zie je handige knoppen: **B** = vet, *I* = schuin, ketting-icoon = link invoegen, en het foto-icoon = afbeelding uploaden. Hiermee maak je je tekst mooi op!"
        },
        {
            k: ["wat gebeurt er als ik op upload druk", "hoe upload ik", "foto toevoegen", "afbeelding uploaden", "bestand uploaden"],
            a: "🖼️ Als je op het upload/foto-icoon drukt, kun je een afbeelding (zoals een trackcover of screenshot van max 5MB) kiezen vanaf je apparaat. Het forum plaatst automatisch de juiste code in je tekst zodat de foto zichtbaar wordt."
        },
        {
            k: ["nummer posten", "release posten", "150 tekens", "bare link", "geen kale link", "muziek delen"],
            a: "⚠️ **Belangrijke regel bij Releases:** Plaats nooit een 'bare link' (alleen een kale link). Gebruik het formaat *Artiest - Titel [Genre]* en schrijf **minimaal 150 tekens aan context/verhaal** erbij! De ingebouwde Link Fixer maakt er daarna automatisch een mooie visuele kaart van."
        },

        // --- NAVIGATIE & DROPDOWNS ---
        {
            k: ["hoe navigeer ik op het forum", "navigatie", "waar vind ik alles", "menu gebruiken", "waar is wat"],
            a: "🧭 Bovenin of in het zijmenu vind je het hoofdmenu. Je kunt schakelen tussen categorieën (Releases, Feedback, Collab, Support, Live Room), de zoekbalk gebruiken of je notificaties bekijken."
        },
        {
            k: ["dropdowns", "wat betekenen dropdowns", "uitklapmenu", "filteren", "sorteren", "talen menu"],
            a: "📋 Dropdowns zijn uitklapmenu's (pijltjes naar beneden). Je gebruikt ze om te sorteren op 'Recent' of 'Popular', om categorieën te kiezen, of om de taal van het forum te wijzigen (12+ talen beschikbaar)."
        },
        {
            k: ["zoeken", "search", "hoe vind ik iets", "zoekbalk", "vergrootglas"],
            a: "🔍 Klik bovenaan op het **vergrootglas-icoon** (of de zoekbalk). Typ een artiestennaam, onderwerp of tag in (bijv. `#Releases`) om direct te vinden wat je zoekt."
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

    // 🧠 SLIMME SCORE-FUNCTIE VOOR EXACTE MATCHING ZONDER FOUTEN
    window.sendChatsongMsg = function() {
        const input = document.getElementById('cb-input');
        const messages = document.getElementById('cb-messages');
        const text = input ? input.value.trim() : '';
        if (!text || !messages) return;

        messages.innerHTML += `<div class="u-msg">${escapeHtml(text)}</div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        const userQuery = text.toLowerCase();
        let bestAnswer = "Dat is een goede vraag! 🤔 Probeer te vragen over: profielen, usercards, mobile tabs, de composer, uploaden, topics starten, of navigatie op het forum. / Good question! Try asking about profiles, usercards, composer, uploading, topics, or navigation.";
        let highestScore = 0;

        if (window.chatsongDB && Array.isArray(window.chatsongDB)) {
            window.chatsongDB.forEach(item => {
                let score = 0;
                item.k.forEach(keyword => {
                    const kw = keyword.toLowerCase();
                    if (userQuery.includes(kw)) {
                        // Hoe langer het trefwoord, hoe specifieker de match
                        score += kw.length * 3;
                    }
                });

                if (score > highestScore) {
                    highestScore = score;
                    bestAnswer = item.a;
                }
            });
        }

        setTimeout(() => {
            messages.innerHTML += `<div class="b-msg">${escapeHtml(bestAnswer)}</div>`;
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
