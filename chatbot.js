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
                <div class="b-msg">Hoi! Welkom op Chatsong.nl. Vraag me alles over de community, registreren, de 150-tekens release-regel, profielen, Flarum of de Live Music Room!</div>
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

    // Uitgebreide Kennisbank op basis van de volledige Chatsong Flarum Gids
    window.chatsongDB = [
        {
            k: ["wat is chatsong", "missie", "doel", "gratis", "payola", "2017", "roy", "verschil", "anders", "kind", "beginner", "doelgroep"],
            a: "Chatsong.nl is in 2017 opgericht door Chatsong Roy met als belofte 'Real Music, Zero Bots!'. Het is een onafhankelijke, mensgedreven muziekcommunity zonder payola. In tegenstelling tot platforms met algoritmes, beoordelen echte mensen hier de muziek. Beginners, kinderen en ervaren artiesten zijn allemaal welkom!"
        },
        {
            k: ["account", "registreren", "aanmaken", "inloggen", "sign up", "join free", "wachtwoord", "spotify", "login", "turnstile", "captcha"],
            a: "Ga naar www.chatsong.nl, klik op 'Join Free' / 'Sign Up', vul je e-mail, gebruikersnaam en wachtwoord in en doorloop de Turnstile-captcha. Je kunt ook snel inloggen via beveiligde sociale koppelingen zoals Spotify."
        },
        {
            k: ["taal", "language", "engels", "nederlands", "talen", "thema", "dark mode", "donker", "instellingen"],
            a: "Bovenaan vind je de taal-dropdown met keuze uit 12 talen (waaronder Nederlands en Engels). De website schakelt automatisch over naar Dark Mode als je apparaat op een donker thema staat."
        },
        {
            k: ["profiel", "bio", "biografie", "avatar", "profielfoto", "social", "knoppen", "usercard", "settings"],
            a: "Je UserCard is je visitekaartje. Je bio mag maximaal 200 tekens en 5 regels lang zijn (te bewerken via je profiel/Settings). Via Settings kun je ook je avatar uploaden en social media knoppen (Instagram, Spotify, SoundCloud, YouTube, TikTok) toevoegen."
        },
        {
            k: ["nummer", "muziek", "uploaden", "plaatsen", "post", "topic", "regels", "150 tekens", "link", "titel", "bare link", "seo"],
            a: "⚠️ Belangrijke SEO-regel: Geen bare link dumping! Bij het plaatsen van een release (titelformaat: Artiestennaam - Nummer Titel [Genre]) ben je VERPLICHT om minimaal 150 tekens tekst of achtergrondverhaal toe te voegen. Omdat Google niet kan luisteren, wordt een topic met alleen een loske link zonder waarschuwing verwijderd."
        },
        {
            k: ["menu", "dropdown", "navigatie", "snelkoppeling", "mobiel", "balk", "onderbalk", "leaderboard", "ranglijst", "blog", "playlist", "top 40", "musicians"],
            a: "Het hoofdmenu ('All Discussions') bevat de blog, playlist submissions en Top 40. Bovenin en onderin op mobiel vind je snelle knoppen naar Home, Categories, Search, Notifications, Profile, het Leaderboard ([🏆 Leaderboard]) en de artiestengids ([🎸 Musicians])."
        },
        {
            k: ["reageren", "taggen", "@", "upvote", "punten", "gastenboek", "guestbook", "collab request", "citeren", "quote", "flarum"],
            a: "In Flarum reageer je via 'Reply', citeer je door tekst te selecteren en op 'Quote' te klikken, en tag je anderen met @gebruikersnaam. Upvotes geven punten voor het Leaderboard. Op elk profiel vind je een openbaar gastenboek ('Post a message ✉') voor collab requests."
        },
        {
            k: ["live music room", "chat", "ruimte", "vibe", "mood", "support", "team", "soundboard"],
            a: "Onderaan het scherm zweeft de Live Music Room waar je live kunt chatten en muzieklinks (SoundCloud/YouTube/Spotify) direct kunt afspelen. Bovendien kun je via het Vibe Panel je stemming (Mood), gedachten (Thoughts) of supportvragen (Support) delen."
        },
        {
            k: ["composer", "schrijven", "poll", "peiling", "draft", "concept", "markdown", "afbeeldingen"],
            a: "In de Flarum composer kun je Markdown gebruiken, afbeeldingen uploaden via fof-upload, peilingen (polls) tot 10 opties toevoegen en concepten automatisch laten opslaan onder Drafts."
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

        let bestAns = "Dat is een goede vraag over Flarum of Chatsong! Bekijk de gids op de website of vraag het gerust in de Live Music Room onderaan de pagina. Je kunt me vragen over registreren, muziek plaatsen (min. 150 tekens!), profielen, upvotes en meer!";
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
