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

    // 🎵 COMPLETE KENNISBANK: ACCOUNT + PROFIEL + FORUM + POSTING + VRAAG & AANBOD + EXTENSIES
    window.chatsongDB = [
        {
            k: ["account", "registreren", "sign up", "inloggen", "login", "hoe aanmaken", "new account", "create account"],
            a: "📝 Klik **'Join Free'** op de homepage, vul in: e-mail, gebruikersnaam, wachtwoord, doorloop de Turnstile-captcha, klaar! Je kunt ook via Spotify inloggen. / Click **'Join Free'** on homepage, enter email, username, password, complete captcha, done! Or log in via Spotify."
        },
        {
            k: ["wachtwoord", "password vergeten", "forgot", "reset", "herstellen"],
            a: "🔑 Op de login-pagina: klik 'Forgot Password?', voer je e-mail in, controleer je inbox voor reset-link. Klik de link en voer nieuw wachtwoord in. Probleem? Vraag het in Live Music Room! / Click 'Forgot Password?' on login page, enter email, check inbox for reset link, set new password."
        },
        {
            k: ["spotify login", "social login", "verbinden", "connect"],
            a: "🎵 Bij 'Join Free': klik **'Login with Spotify'**, autoriseer Chatsong, klaar! Je profiel is direct actief. Super snel! / Click 'Login with Spotify' at signup, authorize Chatsong, done! Your profile is instantly active."
        },
        {
            k: ["profiel", "profile", "bio", "biografie", "bewerken", "edit profile"],
            a: "👤 **Klik je avatar** (rechtsboven) → **'Settings'** → **'Profile'**. Daar wijzig je: bio (max 200 tekens, 5 regels), avatar, beschrijving, links. Klik daarna op 'Save'. / Click your avatar (top right) → 'Settings' → 'Profile'. Edit bio, avatar, description, links. Click 'Save'."
        },
        {
            k: ["avatar", "profielfoto", "foto", "profile picture", "change avatar"],
            a: "🖼️ Settings → Profile → klik de ronde foto-placeholder. Upload je foto van je computer of plak een URL. Voorkeur: 400x400px, rond formaat. 'Save' en klaar! / Settings → Profile → click photo placeholder, upload from computer or paste URL."
        },
        {
            k: ["gastenboek", "guestbook", "guestbook bericht", "post a message", "comment on profile"],
            a: "💌 Op iemands **profiel**: scroll naar beneden, klik **'Post a Message ✉'**, typ je bericht, post! Berichten zijn openbaar, iedereen ziet ze. Perfecte plek voor collab-requests! / On someone's profile: scroll down, click 'Post a Message ✉', type, post! Public guestbook. Great for collab requests!"
        },
        {
            k: ["social media", "instagram", "youtube", "tiktok", "spotify", "soundcloud", "links toevoegen", "knoppen"],
            a: "📱 Settings → Profile → scroll naar 'Social Media'. Voeg links toe voor Instagram, YouTube, TikTok, Spotify, SoundCloud, enz. Klanten kunnen je daar direct bereiken! / Settings → Profile → scroll to 'Social Media'. Add Instagram, YouTube, TikTok, Spotify, SoundCloud links."
        },
        {
            k: ["taal", "language", "nederlands", "engels", "12 languages", "wisselen"],
            a: "🌍 **Bovenaan** de pagina: taal-dropdown (12+ talen beschikbaar). Kies Nederlands of Engels of je favoriete taal. Direct van toepassing! / Top of page: language dropdown (12+ languages). Choose Dutch, English, or your favorite language."
        },
        {
            k: ["dark mode", "donker", "thema", "theme", "nacht modus"],
            a: "🌙 Chatsong ondersteunt automatische Dark Mode gebaseerd op je apparaatinstellingen (Windows/Mac). Systeem → Instellingen → Donker/Licht → Dark Mode wordt automatisch geactiveerd. / Chatsong supports automatic Dark Mode based on your device settings."
        },
        {
            k: ["notificaties", "notifications", "alerts", "meldingen", "e-mail alerts"],
            a: "🔔 Settings → Notifications. Hier kies je: 'Someone mentions you', 'Reply to my post', 'New message', 'Post on guestbook', etc. Kies In-App, E-mail, of beide! / Settings → Notifications. Choose: 'Mentions you', 'Reply to post', 'Message', 'Guestbook post', etc."
        },
        {
            k: ["discussie", "topic", "thread", "post", "how to make", "hoe maak", "starten", "start discussion", "new thread"],
            a: "💬 **Stap 1:** Klik een **categorie** (bijv. Releases, Feedback, Support). **Stap 2:** Klik grote **'Start Discussion'** knop. **Stap 3:** Vul in: titel, optionele tags, en bericht. **Stap 4:** Klik **'Post'**. / Step 1: Click a category. Step 2: Click 'Start Discussion'. Step 3: Enter title, tags, message. Step 4: Click 'Post'."
        },
        {
            k: ["titel", "title", "discussie naam", "discussion name", "hoe goede titel"],
            a: "📋 **Goede titel:** Duidelijk, kort (5-10 woorden), beschrijf het onderwerp. ❌ SLECHT: 'Hoi'. ✅ GOED: 'Feedback op mijn new track - Electronic/House'. Goeie titel = meer reacties! / Good title: Clear, short (5-10 words), describes topic. Better title = more replies!"
        },
        {
            k: ["nummer posten", "release posten", "track posten", "muziek delen", "150 tekens", "bare link", "upload"],
            a: "⚠️ **BELANGRIJKSTE REGEL:** Bij releases (nummers/tracks): **GEEN BARE LINKS!** Formaat: **Artiestennaam - Nummernaam [Genre]**. VERPLICHT: min. 150 tekens verhaal/context toevoegen. Google kan niet luisteren, we nodig beschrijving voor SEO! / **KEY RULE:** No bare links! Format: **Artist - Song Title [Genre]**. MUST add 150+ characters of story/context."
        },
        {
            k: ["link fixer", "pre-save", "automatisch", "visual card", "distrokid", "spotify link"],
            a: "🔗 Plak gewoon je **Spotify/SoundCloud/DistroKid/YouTube-link** in je post. De ingebouwde **Link Fixer** herkent het AUTOMATISCH en maakt er een mooie visuele kaart van. Super! / Just paste your Spotify/SoundCloud/DistroKid/YouTube link. The built-in Link Fixer automatically converts to a visual card."
        },
        {
            k: ["reageren", "reply", "antwoord", "reactie", "respond", "how to reply", "how to comment"],
            a: "↩️ **Scroll naar beneden** in een discussie. Klik **'Reply'** knop. Typ je antwoord in de text box. Klik **'Post'**. Klaar! / Scroll down in a discussion. Click the 'Reply' button. Type your answer. Click 'Post'. Done!"
        },
        {
            k: ["citeren", "quote", "select text", "quoteren", "antwoord aan persoon"],
            a: "📋 Selecteer de **tekst** die je wilt citeren → Klik **'Quote'**. De tekst verschijnt gemarkeerd in je reply-box. Je kunt **meerdere quotes** in één bericht stapelen. / Select the text you want to quote → Click 'Quote'. Text appears highlighted in reply-box. You can stack multiple quotes."
        },
        {
            k: ["tag", "tags", "label", "hashtag", "#", "filtreren", "categories"],
            a: "🏷️ **Bij discussies:** bovenaan zie je tags (bijv. #Releases, #Feedback, #Collab). Klik een tag om **alle posts met die tag** te zien. Populaire tags: #Releases #Feedback #Collab #Support. / At top of discussion: tags. Click a tag to see all posts with that tag."
        },
        {
            k: ["categorie", "category", "forum", "section", "onderdeel", "releases", "feedback", "support"],
            a: "📂 **Forum categorieën:** 📎 Releases, 💭 Feedback, 🤝 Collab, ❓ Support, 💬 Offtopic, 🎵 Live Music Room. Klik een categorie in het menu om al die posts te zien! / Forum categories: Releases, Feedback, Collab, Support, Offtopic, Live Room."
        },
        {
            k: ["zoeken", "search", "vinden", "opzoeken", "how to find", "zoekbalk"],
            a: "🔍 **Bovenaan:** klik op **magneetglas-icoontje** (🔍) of zoekbalk. Typ artiestennaam, woord, of tag (#Releases). Klik 'Recent', 'Popular', 'Unanswered' om te sorteren. / Top of page: click search icon or search bar. Type artist name, word, tag. Sort by Recent, Popular, Unanswered."
        },
        {
            k: ["markdown", "opmaak", "vet", "bold", "schuin", "italic", "link", "formatting", "editor"],
            a: "✍️ Flarum ondersteunt **Markdown**: **vet** = `**tekst**`, *schuin* = `*tekst*`, ~~doorhalen~~ = `~~tekst~~`, [link](url), `> quote`. Preview-knop toont hoe het eruitziet! / Flarum supports Markdown for bold, italic, links, quotes, and previews."
        },
        {
            k: ["afbeelding", "image", "foto", "plaatje", "insert image", "upload image", "picture"],
            a: "🖼️ Klik het **foto-icoontje** in de editor. Upload van computer OF plak image-URL. Foto verschijnt direct in je post (max 5MB). Handig voor covers en screenshots! / Click photo icon in editor. Upload from computer OR paste image URL. Max 5MB."
        },
        {
            k: ["emoji", "emoticon", "smilie", "😊", "insert emoji"],
            a: "😊 Typ `:` dan woord, bijv. `:smile:` `:fire:` `:heart:` `:music:`. Flarum toont suggesties of gebruik de emoji-dropdown. / Type `:` then word, e.g. `:smile:` `:fire:` `:heart:`. Flarum shows suggestions."
        },
        {
            k: ["draft", "concept", "klad", "autosave", "save draft", "unsent"],
            a: "💾 Als je halverwege stopt zonder te posten, slaat Flarum je bericht AUTOMATISCH op als Draft. Klik later terug en je ziet 'Resume Draft'. / If you stop writing without posting, Flarum automatically saves as Draft."
        },
        {
            k: ["taggen", "@", "mention", "iemand noemen", "notify persoon", "tag someone"],
            a: "🔔 Typ **@gebruikersnaam** in je post. Die persoon krijgt direct **notificatie** dat je hen genoemd hebt! Werkt in discussies, replies, en guestbook. / Type @username in your post. That person gets instant notification!"
        },
        {
            k: ["upvote", "like", "👍", "reaction", "emoji reaction", "punten", "score"],
            a: "👍 Klik de **👍-knop** onder een post. Geeft de poster **punten** op het Leaderboard! Je kunt 1x per post upvoten. Goeie posts krijgen meer upvotes! / Click the 👍 button under a post. Gives poster points on Leaderboard!"
        },
        {
            k: ["volgen", "follow", "subscription", "subscribe", "watch thread", "notifications"],
            a: "⭐ Klik **'Follow'** onder discussie-titel. Je krijgt dan **notificaties** bij nieuwe reacties EN het verschijnt in je **'Following'** tab. / Click 'Follow' under discussion title. Get notifications on new replies and see in 'Following' tab."
        },
        {
            k: ["bookmark", "bladwijzer", "saved", "opslaan", "save", "mark for later"],
            a: "📌 Klik het **📌-icoontje** onder een post. Sla op in je persoonlijke **'Saved'** list (zie je in profielmenu). Perfect om interessante posts terug te vinden! / Click the 📌 icon under a post. Save to your personal 'Saved' list."
        },
        {
            k: ["bewerken", "edit", "wijzigen", "change", "aanpassen", "fix typo"],
            a: "✏️ Klik de **...** onder JE EIGEN post → Selecteer **'Edit'**. Je hebt meestal ~1 uur tijd om je post aan te passen. Klik 'Save' als je klaar bent! / Click the ... under YOUR OWN post → Select 'Edit'."
        },
        {
            k: ["verwijderen", "delete", "wissen", "remove", "erase post"],
            a: "🗑️ Klik de **...** onder JE post → Selecteer **'Delete'**. Je kunt je EIGEN posts meestal zelf verwijderen. Eenmaal weg = definitief weg! / Click ... under YOUR post → Select 'Delete'. Once gone = permanently gone!"
        },
        {
            k: ["rapporteren", "report", "flag", "spam", "hateful", "rule breaking", "inappropriate"],
            a: "⚠️ Zie je iets ongeldig (spam, haatzaai, nep)? Klik **...** → Selecteer **'Report'**. Beschrijf waarom. Moderators zien dit en nemen **snel actie**. / See something wrong? Click ... → Report. Describe why. Moderators act fast."
        },
        {
            k: ["inbox", "privé bericht", "dm", "direct message", "personal message", "private"],
            a: "✉️ Klik het **envelopje** (✉️) rechtsboven in navigatie. Daar zie je privé gesprekken. Klik iemands **profiel** → **'Send Message'** om nieuw PM te starten. / Click envelope (✉️) top right. See private conversations. Click someone's profile → 'Send Message'."
        },
        {
            k: ["mute", "block", "blokkeer", "negeren", "ignore user", "don't see posts"],
            a: "🔇 Klik iemands **profiel** → **'Mute'** om hun posts te verbergen. **'Block'** = geen privé berichten mogelijk EN hun content verdwijnt. / Click someone's profile → 'Mute' to hide posts. 'Block' = no PMs and content hidden."
        },
        {
            k: ["vraag en aanbod", "vragen en aanbod", "vraag & aanbod", "aanbod", "vraag", "verkoop", "koop", "service", "collab", "samenwerking"],
            a: "🧾 In Vraag & Aanbod kun je iets vragen of aanbieden: service, collab, track, mix, mastering, promotie of opdracht. Maak duidelijke titel en voeg tags toe zoals #Collab #Service. / In Questions & Offers you can request or offer services, collabs, tracks, mixes, mastering."
        },
        {
            k: ["live music room", "live chat", "soundboard", "vibe", "mood", "community chat", "supabase"],
            a: "🎵 In de live Music Room kun je in realtime chatten met andere leden, muziek delen, @mentions gebruiken en bijdragen aan de community. / In the live Music Room you can chat in real-time, share music, and connect with members."
        },
        {
            k: ["leaderboard", "ranglijst", "ranking", "top contributors", "hall of fame", "puntenlijst"],
            a: "🏆 Het leaderboard toont de meest actieve en waardevolle deelnemers. Je verdient punten door goede posts, reacties, feedback en helpende bijdragen. / Leaderboard shows top contributors earning points through helpful posts and replies."
        },
        {
            k: ["artiesten", "musicians", "browse", "discover", "a-z filter"],
            a: "🎸 Gebruik de artiesten- overzichtpagina om op naam te zoeken en nieuwe makers te ontdekken in de community. / Use the musicians overview page to search by name and discover new creators."
        },
        {
            k: ["veilig", "safety", "privacy", "kinderen", "pesten", "safe for kids", "moderators"],
            a: "🔒 Dit forum is bedoeld om veilig en respectvol te blijven. Moderators houden toezicht, pesten en misbruik worden niet getolereerd. / Forum is safe and respectful with active moderation against bullying."
        },
        {
            k: ["regels", "rules", "gedrag", "community guidelines", "wat mag", "wat niet"],
            a: "📋 Chatsong Forum Regels: Wees respectvol, geen spam, zet 150+ tekens bij releases (geen bare links!), geef constructieve feedback. Moderators handhaven dit! / Forum Rules: Be respectful, no spam, add 150+ chars to releases, give constructive feedback."
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
