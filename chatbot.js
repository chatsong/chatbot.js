(function() {
    // Injecteer de HTML structuur en stijl van de widget
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
                <div class="b-msg">Hoi! Welkom op Chatsong.nl. Vraag me alles over de community, registreren, de 150-tekens release-regel, profielen, Flarum, de Live Music Room, de Instagram Story Generator of het Soundboard!</div>
            </div>
            <div id="cb-input-area">
                <input type="text" id="cb-input" placeholder="Typ je vraag hier..." onkeypress="handleChatsongKey(event)">
                <button onclick="sendChatsongMsg()">→</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const style = document.createElement('style');
    style.innerHTML = `
        #chatsong-bot-container { position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        #cb-toggle-btn { background: #8a2be2; color: #fff; border: none; padding: 12px 18px; border-radius: 30px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s; }
        #cb-toggle-btn:hover { transform: scale(1.05); }
        #cb-window { position: absolute; bottom: 60px; right: 0; width: 360px; height: 480px; background: #ffffff; border: 1px solid #ddd; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 8px 24px rgba(0,0,0,0.25); overflow: hidden; }
        #cb-header { background: #1a1a1a; color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 14px; }
        #cb-header button { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; }
        #cb-messages { flex: 1; padding: 12px; overflow-y: auto; font-size: 13px; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
        .b-msg { background: #e9ecef; padding: 10px 14px; border-radius: 8px; max-width: 85%; align-self: flex-start; color: #333; line-height: 1.4; }
        .u-msg { background: #8a2be2; color: #fff; padding: 10px 14px; border-radius: 8px; max-width: 85%; align-self: flex-end; line-height: 1.4; }
        #cb-input-area { display: flex; border-top: 1px solid #ddd; padding: 8px; background: #fff; }
        #cb-input { flex: 1; border: 1px solid #ccc; padding: 10px; border-radius: 6px; outline: none; font-size: 13px; }
        #cb-input:focus { border-color: #8a2be2; }
        #cb-input-area button { background: #8a2be2; color: #fff; border: none; padding: 10px 16px; margin-left: 6px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    `;
    document.head.appendChild(style);

    // Uitgebreide Kennisbank inclusief nieuwe community-functies
    window.chatsongDB = [
        {
            k: ["wat is chatsong", "missie", "doel", "gratis", "payola", "2017", "roy", "verschil", "anders", "kind", "beginner", "doelgroep"],
            a: "Chatsong.nl is in 2017 opgericht door Chatsong Roy met als belofte 'Real Music, Zero Bots!'. Het is een onafhankelijke, mensgedreven muziekcommunity zonder payola. In tegenstelling tot platforms met algoritmes, beoordelen echte mensen hier de muziek."
        },
        {
            k: ["account", "registreren", "aanmaken", "inloggen", "sign up", "join free", "wachtwoord", "spotify", "login", "turnstile", "captcha"],
            a: "Ga naar www.chatsong.nl, klik op 'Join Free' / 'Sign Up', vul je e-mail, gebruikersnaam en wachtwoord in en doorloop de Turnstile-captcha. Je kunt ook snel inloggen via beveiligde sociale koppelingen zoals Spotify."
        },
        {
            k: ["taal", "language", "engels", "nederlands", "talen", "thema", "dark mode", "donker", "instellingen"],
            a: "Bovenaan vind je de taal-dropdown met keuze uit 12 talen. De website beschikt over uitgebreide CSS-variabelen die naadloos schakelen tussen een lichte en een donkere modus (dark mode)."
        },
        {
            k: ["profiel", "bio", "biografie", "avatar", "profielfoto", "social", "knoppen", "usercard", "settings"],
            a: "Je UserCard is je visitekaartje. Je bio mag maximaal 200 tekens en 5 regels lang zijn. Via Settings kun je ook je avatar uploaden en social media knoppen toevoegen."
        },
        {
            k: ["nummer", "muziek", "uploaden", "plaatsen", "post", "topic", "regels", "150 tekens", "link", "titel", "bare link", "seo"],
            a: "⚠️ Belangrijke SEO-regel: Geen bare link dumping! Bij het plaatsen van een release ben je VERPLICHT om minimaal 150 tekens tekst of achtergrondverhaal toe te voegen, omdat Google niet kan luisteren."
        },
        {
            k: ["menu", "dropdown", "navigatie", "snelkoppeling", "mobiel", "balk", "onderbalk", "leaderboard", "ranglijst", "blog", "playlist", "top 40", "musicians"],
            a: "Het hoofdmenu bevat de blog, playlist submissions en Top 40. Via de navigatie vind je onder andere het Leaderboard en de artiestengids."
        },
        {
            k: ["reageren", "taggen", "@", "upvote", "punten", "gastenboek", "guestbook", "collab request", "citeren", "quote", "flarum"],
            a: "In Flarum reageer je via 'Reply' en tag je anderen met @gebruikersnaam. Upvotes geven punten voor het Leaderboard. Op elk profiel vind je bovendien een openbaar gastenboek voor collab requests."
        },
        {
            k: ["live music room", "chat", "ruimte", "vibe", "mood", "support", "team", "soundboard", "supabase", "embeds", "spotify", "soundcloud", "youtube", "beatport", "mixcloud"],
            a: "Onderaan het scherm zweeft de Live Music Chatroom (gekoppeld aan Supabase). Hier kun je live chatten, @-vermeldingen gebruiken en direct muziekspelers embedden (Spotify, SoundCloud, YouTube, Beatport, Mixcloud). Via het Vibe Panel en Soundboard deel je je stemming (mood), gedachten of supportvragen[cite: 13]."
        },
        {
            k: ["composer", "schrijven", "poll", "peiling", "draft", "concept", "markdown", "afbeeldingen"],
            a: "In de Flarum composer kun je Markdown gebruiken, afbeeldingen uploaden via fof-upload, peilingen tot 10 opties toevoegen en concepten automatisch laten opslaan."
        },
        {
            k: ["instagram story", "generator", "visual", "verhalen"],
            a: "Met de ingebouwde Instagram Story Generator kun je forumberichten automatisch omzetten in een deelbare visual voor je Instagram Stories[cite: 13]."
        },
        {
            k: ["a-z", "filterbar", "artiestenmap", "filter"],
            a: "De A-Z Filterbar is een handige navigatiebalk binnen de artiestenmap om snel en alfabetisch door alle onafhankelijke musici te bladeren[cite: 13]."
        },
        {
            k: ["link fixer", "pre-save", "distrokid", "socials"],
            a: "De Link- en Pre-save Fixer detecteert automatisch ruwe of niet-werkende links (zoals DistroKid pre-saves en social media) en zet deze om in nette, visuele kaarten[cite: 13]."
        }
    ];

    window.toggleChatsongBot = function() {
        const win = document.getElementById('cb-window');
        win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    };

    window.handleChatsongKey = function(e) {
        if (e.key === 'Enter') window.sendChatsongMsg();
    };

    window.sendChatsongMsg = function() {
        const input = document.getElementById('cb-input');
        const messages = document.getElementById('cb-messages');
        const text = input.value.trim();
        if (!text) return;

        messages.innerHTML += `<div class="u-msg">${escapeHtml(text)}</div>`;
        const q = text.toLowerCase();
        input.value = '';

        let bestAns = "Dat is een goede vraag over Flarum of Chatsong! Bekijk de gids op de website of vraag het gerust in de Live Music Room onderaan de pagina. Je kunt me vragen over registreren, de Live Music Chatroom, het Soundboard, de Instagram Story Generator en meer![cite: 13]";
        let highestScore = 0;

        window.chatsongDB.forEach(item => {
            let score = 0;
            item.k.forEach(keyword => {
                if (q.includes(keyword)) {
                    score += keyword.length * 2;
                }
            });
            if (score > highestScore) {
                highestScore = score;
                bestAns = item.a;
            }
        });

        setTimeout(() => {
            messages.innerHTML += `<div class="b-msg">${escapeHtml(bestAns)}</div>`;
            messages.scrollTop = messages.scrollHeight;
        }, 300);

        messages.scrollTop = messages.scrollHeight;
    };

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
})();
