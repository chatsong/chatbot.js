
(function() {
    function initChatsongBot() {
        if (document.getElementById('chatsong-bot-container')) return;

        // Injecteer de HTML structuur van de widget
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
                    <div class="b-msg">Hoi! Welkom op Chatsong.nl. Vraag me alles over je account, profiel, hoe je posts maakt, Flarum forum regels, tags, upvotes, vraag & aanbod, extensies en meer! 🎵 / Hi! Ask me about your account, profile, posting, Flarum rules, tags, upvotes, questions & offers, extensions and more! 🎵</div>
                </div>
                <div id="cb-input-area">
                    <input type="text" id="cb-input" placeholder="Typ je vraag hier / Type your question..." onkeypress="handleChatsongKey(event)">
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

    // Kennisbank
    window.chatsongDB = [
        {
            k: ["flarum", "forum", "hoe werkt forum", "wat is flarum", "forum uitleg", "hoe werkt dit", "welkom"],
            a: "💬 Dit forum werkt met Flarum. Je kunt hier discussies starten, vragen stellen, feedback krijgen, tags gebruiken, upvoten, volgen, reageren en deelnemers helpen. Klik een categorie, kies 'Start Discussion', vul titel + tekst in en publiceer."
        },
        {
            k: ["vraag en aanbod", "vragen en aanbod", "vraag & aanbod", "aanbod", "vraag", "verkoop", "koop", "service", "opdracht", "collab", "samenwerking"],
            a: "🧾 In Vraag & Aanbod kun je iets vragen of aanbieden: een service, collab, track, mix, mastering, promotie, opdracht of hulp. Klik op de juiste categorie, maak een duidelijke titel, vertel wat je wilt, en voeg eventueel tags zoals #Collab #Service #Feedback toe."
        },
        {
            k: ["account", "registreren", "sign up", "inloggen", "login", "aanmaken", "create account", "new account"],
            a: "📝 Ga naar de homepage en klik op 'Join Free'. Vul je e-mail, gebruikersnaam en wachtwoord in, voltooi de captcha en je account is klaar. Je kunt ook met Spotify inloggen."
        },
        {
            k: ["wachtwoord", "password", "forgot", "reset", "vergeten", "herstellen"],
            a: "🔑 Op de loginpagina klik je op 'Forgot Password?', vul je e-mailadres in, controleer je inbox en volg de reset-link. Daarna kun je een nieuw wachtwoord instellen."
        },
        {
            k: ["profiel", "profile", "bio", "biografie", "bewerken", "edit profile", "avatar", "foto", "profile picture"],
            a: "👤 Klik rechtsboven op je avatar en ga naar 'Settings' → 'Profile'. Daar kun je bio, avatar, beschrijving, links en social media toevoegen. Klik daarna op 'Save'."
        },
        {
            k: ["gastenboek", "guestbook", "bericht op profiel", "post a message", "comment on profile"],
            a: "💌 Open iemand zijn profiel, scroll naar beneden en klik 'Post a Message'. Typ je bericht, laat het zien en plak het. Dit is handig voor collab-requests en korte welkomsberichten."
        },
        {
            k: ["discussie", "topic", "thread", "start discussion", "nieuw topic", "nieuw forum bericht", "hoe maak ik een post", "post starten", "new thread"],
            a: "💬 Klik eerst een categorie zoals Releases, Feedback, Support of Vraag & Aanbod. Daarna klik je op 'Start Discussion'. Vul een duidelijke titel in, schrijf je bericht en klik op 'Post'."
        },
        {
            k: ["releases", "release posten", "nummer posten", "track posten", "muziek delen", "150 tekens", "bare link", "upload"],
            a: "⚠️ Bij een releasepost is het belangrijk: geen bare link plaatsen zonder context. Gebruik een duidelijke titel en geef minimaal 150 tekens context: wat is het nummer, welke stijl, wat is de bedoeling, welk verhaal zit erin."
        },
        {
            k: ["link fixer", "pre-save", "spotify link", "soundcloud", "youtube", "distrokid", "visual card"],
            a: "🔗 Plak gewoon je Spotify-, SoundCloud-, YouTube- of DistroKid-link in je post. De ingebouwde Link Fixer maakt daar automatisch een visuele kaart van, zodat het er netjes uit ziet in de discussie."
        },
        {
            k: ["tags", "tag", "label", "hashtag", "filter", "categorie tags", "gevonden"],
            a: "🏷️ Tags helpen om soortgelijke posts te vinden. Klik op tags zoals #Releases, #Feedback, #Collab of #Support om alle posts met hetzelfde thema te zien. Gebruik relevante tags zodat je meer juiste reacties krijgt."
        },
        {
            k: ["upvote", "like", "👍", "reaction", "punten", "leaderboard", "score", "vote"],
            a: "👍 Klik op de 👍-knop onder een post. Daarmee geef je punten of waardering en help je de poster zichtbaar te worden. Goede posts krijgen vaak meer aandacht en meer reacties."
        },
        {
            k: ["live music room", "live chat", "soundboard", "vibe", "mood", "community chat", "supabase"],
            a: "🎵 In de live Music Room kun je in realtime chatten met andere leden, muziek delen, mention maken en bijdragen aan de community. Dit is ideaal voor sfeer, feedback en contact."
        },
        {
            k: ["leaderboard", "ranglijst", "ranking", "top contributors", "hall of fame", "puntenlijst"],
            a: "🏆 Het leaderboard toont de meest actieve en waardevolle deelnemers. Je verdient punten door goede posts, reacties, feedback en helpende bijdragen."
        },
        {
            k: ["artiesten", "musicians", "browse", "discover", "a-z filter", "filterbar"],
            a: "🎸 Gebruik de artiesten- of musicians-overzichtpagina om op naam te zoeken en nieuwe makers te ontdekken. Dit is handig om gelijkgestemde artiesten, producers of communityleden te vinden."
        },
        {
            k: ["veilig", "safety", "privacy", "kinderen", "pesten", "safe for kids", "moderators"],
            a: "🔒 Dit forum is bedoeld om veilig en respectvol te blijven. Moderators houden toezicht, pesten en misbruik worden niet getolereerd. Je kunt altijd een moderator of team aanspreken als iets niet goed voelt."
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

    function levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                }
            }
        }
        return matrix[b.length][a.length];
    }

    function calculateScore(question, keywords) {
        let score = 0;
        const q = question.toLowerCase();
        keywords.forEach(keyword => {
            const kw = keyword.toLowerCase();
            if (q.includes(kw)) {
                score += kw.length * 3;
            } else {
                const distance = levenshteinDistance(q, kw);
                const similarity = 1 - (distance / Math.max(q.length, kw.length));
                if (similarity > 0.7) {
                    score += similarity * kw.length * 1.5;
                }
            }
        });
        return score;
    }

    window.sendChatsongMsg = function() {
        const input = document.getElementById('cb-input');
        const messages = document.getElementById('cb-messages');
        const text = input ? input.value.trim() : '';
        if (!text || !messages) return;

        messages.innerHTML += `<div class="u-msg">${escapeHtml(text)}</div>`;
        input.value = '';

        let bestAns = "Dat is een goede vraag! 🤔 Probeer vragen over: account/login, profiel, forum basics, tags, reacties, upvoten, regels, of vraag & aanbod. / That's a good question! 🤔 Try asking about account/login, profile, forum basics, tags, replies, upvotes, rules, or questions & offers.";
        let highestScore = 0;

        window.chatsongDB.forEach(item => {
            const score = calculateScore(text, item.k);
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
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
})();
