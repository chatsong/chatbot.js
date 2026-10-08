(function() {
    function initChatsongBot() {
        if (document.getElementById('chatsong-bot-container')) return;

        const container = document.createElement('div');
        container.id = 'chatsong-bot-container';
        container.innerHTML = `
            <button id="cb-toggle-btn" onclick="toggleChatsongBot()">💬 Chatsong Help</button>
            <div id="cb-window" style="display:none;">
                <div id="cb-header">
                    <span>Chatsong Assistant 🎵</span>
                    <button onclick="toggleChatsongBot()">×</button>
                </div>
                <div id="cb-messages">
                    <div class="b-msg">Hoi! 👋 Welkom op Chatsong! Ik ben hier om je te helpen. Vraag me over: account setup, profiel, categoriën, muziek posten, feedback geven, collab zoeken, leaderboard, regels, live chat, en meer! / Hi! 👋 Welcome to Chatsong! Ask me about account, profile, posting music, categories, feedback, collabs, leaderboard, rules, and more!</div>
                </div>
                <div id="cb-input-area">
                    <input type="text" id="cb-input" placeholder="Vraag je vraag hier / Ask your question..." onkeypress="handleChatsongKey(event)">
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

    // 🎵 CHATSONG COMPLETE KENNISBANK - ALLE CATEGORIEËN & VRAGEN
    window.chatsongDB = [
        // ============ ACCOUNT & REGISTRATIE ============
        {
            k: ["account", "registreren", "join", "sign up", "inloggen", "login", "hoe aanmaken", "new account"],
            a: "📝 **Account aanmaken:** Klik 'Join' op de homepage → Vul e-mail, username, wachtwoord → Klaar! Je bent lid! Je kunt ook **direct via Spotify inloggen** voor sneller registreren. / **Create account:** Click 'Join' → Enter email, username, password → Done! Or use Spotify login!"
        },
        {
            k: ["spotify", "spotify login", "spotify inloggen", "connect spotify"],
            a: "🎵 **Spotify Login:** Klik 'Login with Spotify' bij signup → Autoriseer → Klaar! Je profiel is direct actief. Super snel! / **Spotify Login:** Click 'Login with Spotify' → Authorize → Done! Profile instantly active!"
        },
        {
            k: ["wachtwoord", "password", "forgot", "reset", "vergeten"],
            a: "🔑 **Wachtwoord vergeten?** Login pagina → 'Forgot Password?' → Voer e-mail in → Check inbox → Klik reset link → Nieuw wachtwoord. / **Forgot password?** Login page → 'Forgot Password?' → Enter email → Check inbox → Reset!"
        },

        // ============ PROFIEL SETUP ============
        {
            k: ["profiel", "profile", "usercard", "bio", "bewerken", "edit profile", "mijn profiel"],
            a: "👤 **Profiel Setup:** Klik je avatar (rechtsboven) → **Settings** → **Profile** → Wijzig: bio (max 200 tekens, 5 regels), avatar, beschrijving → **Save**! / **Edit Profile:** Click avatar → Settings → Profile → Edit bio, avatar, description → Save!"
        },
        {
            k: ["avatar", "profielfoto", "foto", "profile picture", "avatar uploaden"],
            a: "🖼️ **Avatar Upload:** Settings → Profile → Klik foto-placeholder → Upload van computer OF plak URL → Voorkeur: 400x400px → **Save** → Klaar! / **Change Avatar:** Settings → Profile → Click photo → Upload or paste URL → Save!"
        },
        {
            k: ["bio", "biografie", "beschrijving", "about me", "usercard"],
            a: "📝 **Bio toevoegen:** Settings → Profile → Bio veld → Max **200 tekens, 5 regels** → Vertel over jezelf, je muziek, links → **Save**! / **Add Bio:** Settings → Profile → Bio field → Max 200 chars, 5 lines → Describe yourself → Save!"
        },
        {
            k: ["social media", "instagram", "youtube", "tiktok", "soundcloud", "spotify links", "social links"],
            a: "📱 **Social Links toevoegen:** Settings → Profile → **Social Media** → Voeg toe: Instagram, YouTube, TikTok, Spotify, SoundCloud, etc. → **Save**! Fans kunnen je direct bereiken! / **Add Social Links:** Settings → Profile → Social Media → Add Instagram, YouTube, TikTok, Spotify → Save!"
        },
        {
            k: ["gastenboek", "guestbook", "post message", "message on profile", "comment profiel"],
            a: "💌 **Gastenboek:** Klik iemands profiel → Scroll naar beneden → **Post a Message** → Typ bericht → **Post** → Klaar! Openbaar voor iedereen. Perfect voor collab requests! / **Guestbook:** Click someone's profile → Scroll down → Post a Message → Type → Post! Public messages!"
        },

        // ============ CATEGORIEËN & FORUM STRUCTUUR ============
        {
            k: ["categorie", "category", "section", "forum", "where to post", "waar posten"],
            a: "📂 **Chatsong Categorieën:** 🎸 **Musicians** (profielen), 🔥 **New music** (releases), 💬 **Feedback** (feedback geven), 🤝 **Team up** (collab zoeken), 🏷️ **All topics** (overzicht), 🏆 **Leaderboard** (top contributoren). Klik categorie om posts te zien! / **Categories:** Musicians, New music, Feedback, Team up, All topics, Leaderboard!"
        },
        {
            k: ["new music", "releases", "track posten", "nummer posten", "muziek delen", "upload"],
            a: "🔥 **New Music Categorie:** Hier post je je **releases, tracks, covers**. Format: **Artiestennaam - Nummernaam [Genre]**. Voeg 150+ tekens context toe! Link Fixer maakt mooie kaart van je Spotify/YouTube/SoundCloud link. / **New Music:** Post your releases! Format: Artist - Track [Genre]. Add 150+ chars description!"
        },
        {
            k: ["150 tekens", "150 characters", "description", "verhaal", "context", "minimum"],
            a: "⚠️ **150 Tekens Regel:** Bij elke release VERPLICHT min. **150 tekens** verhaal/beschrijving toevoegen! Waarom? Beter voor SEO, meer context, beter engagement! / **150 Chars Rule:** MANDATORY for releases! Add min. 150 chars of story/context for better SEO & engagement!"
        },
        {
            k: ["feedback", "feedback geven", "reviews", "comments", "constructieve feedback"],
            a: "💬 **Feedback Categorie:** Hier geef je **feedback op anderen's muziek**. Wees constructief! Zeg wat goed is, wat beter kan, geef tips. Respectvol toon = meer waardering! / **Feedback:** Give constructive feedback on others' music. Be kind, be specific, give tips!"
        },
        {
            k: ["team up", "collab", "collaboration", "samenwerking", "partner zoeken", "featured artists"],
            a: "🤝 **Team up Categorie:** Hier zoek je **collaborators**: producers, singers, rappers, etc. Post wat je zoekt, je stijl, je vibe. Networken + making music together! / **Team up:** Find collaborators! Post what you're looking for, your style, vibe. Network & make music!"
        },
        {
            k: ["musicians", "artiesten", "artists", "profiles", "discover"],
            a: "🎸 **Musicians Categorie:** Browse & discover **andere artiesten**. Zie hun profiels, volg interessante makers, vind collaborators. Perfecte plek om de community te leren kennen! / **Musicians:** Browse & discover other artists! See profiles, follow makers, find collaborators!"
        },
        {
            k: ["all topics", "alle topics", "overzicht", "alles zien"],
            a: "🏷️ **All Topics:** Overzicht van **alle posts** uit alle categorieën. Handig om alles te zien! Gebruik zoekbalk of filter op tags. / **All Topics:** Overview of all posts. Use search or filter by tags!"
        },

        // ============ MUSIC POSTING & LINK FIXER ============
        {
            k: ["link fixer", "spotify link", "youtube link", "soundcloud link", "embed", "automatisch"],
            a: "🔗 **Link Fixer (Automatisch):** Plak gewoon je **Spotify/YouTube/SoundCloud-link** in je post → Link Fixer herkent het AUTOMATISCH → Mooie visuele kaart met cover! Geen bare links nodig! / **Link Fixer:** Just paste Spotify/YouTube/SoundCloud link → Auto-converts to beautiful card!"
        },
        {
            k: ["track posten", "track uploaden", "release", "single", "album", "hoe post ik"],
            a: "🎶 **Track Posten (Correct):** 1) Klik **New music** 2) Titel: **Artiestennaam - Nummernaam [Genre]** 3) Beschrijving: Min. **150 tekens** (verhaal/context!) 4) Plak je Spotify/YouTube/SoundCloud link 5) **Post**! / **Post Track:** 1) New music category 2) Title: Artist - Track [Genre] 3) Add 150+ char description 4) Paste link 5) Post!"
        },
        {
            k: ["bare link", "naked link", "link alleen", "alleen url"],
            a: "⚠️ **GEEN Bare Links!** Alleen een link posten = niet allowed! Je MOET: **artiestennaam - nummernaam + 150 tekens context** toevoegen! Dit helpt SEO & engagement. / **NO bare links!** You MUST add: Artist - Track name + 150+ chars description!"
        },
        {
            k: ["cover", "remix", "mashup", "freestyle", "collab track"],
            a: "🎵 **Covers & Remixes:** Mag je posten in **New music**! Zelfde regel: **150+ tekens** context. Zeg duidelijk: 'Cover van [origineel]' of 'Remix van [track]'. Respect voor origineel! / **Covers & Remixes:** Post in New music! Add 150+ chars. Say 'Cover of [original]' or 'Remix of [track]'!"
        },

        // ============ INTERACTIES & ENGAGEMENT ============
        {
            k: ["upvote", "like", "👍", "reaction", "punten", "score", "vote"],
            a: "👍 **Upvoten:** Klik **👍-knop** onder een post/track → Geeft poster **punten** op Leaderboard! Je kunt 1x per post upvoten. Goeie posts = meer upvotes = hoger op Leaderboard! / **Upvote:** Click 👍 button → Give poster points! Vote once per post → Good posts climb leaderboard!"
        },
        {
            k: ["leaderboard", "ranking", "top contributoren", "punten", "score", "hall of fame"],
            a: "🏆 **Leaderboard:** Zie de **meest actieve & waardevolle leden**. Je verdient punten door: goede posts, reacties, upvotes, constructieve feedback. Actief bijdragen = hoger op leaderboard! / **Leaderboard:** Top active members! Earn points: good posts, replies, upvotes, feedback!"
        },
        {
            k: ["reageren", "reply", "antwoord", "response", "comment", "reactie"],
            a: "↩️ **Reageren:** Klik op een post → **Scroll naar beneden** → Klik **Reply** → Typ antwoord → **Post** → Klaar! Jouw reactie is zichtbaar. / **Reply:** Click post → Scroll down → Click Reply → Type answer → Post!"
        },
        {
            k: ["citeren", "quote", "select text", "quote reply"],
            a: "📋 **Citeren:** Selecteer **tekst** die je wilt citeren → Klik **Quote** → Tekst verschijnt gemarkeerd in reply-box → Je kunt **meerdere quotes** stapelen. / **Quote:** Select text → Click Quote → Appears in reply-box!"
        },
        {
            k: ["bookmark", "saved", "opslaan", "mark for later", "later lezen"],
            a: "📌 **Bookmarks:** Klik **📌-icoontje** onder post → Sla op in je **Saved** list → Zie je in je profielmenu. Perfect voor later teruglezen! / **Bookmark:** Click 📌 icon → Save to Saved list → Access in profile menu!"
        },
        {
            k: ["volgen", "follow", "subscription", "subscribe", "thread abonneren"],
            a: "⭐ **Volgen:** Klik **Follow** onder post-titel → Krijg **notificaties** bij nieuwe reacties → Post verschijnt in je **Following** tab. Makkelijk interessante discussions volgen! / **Follow:** Click Follow → Get notifications → See in Following tab!"
        },
        {
            k: ["tag", "tags", "label", "hashtag", "#", "filter"],
            a: "🏷️ **Tags:** Zie tags bovenaan posts (bijv. #NewMusic, #Feedback, #Collab). Klik een tag → Zie **alle posts met die tag**. Perfect voor filteren! / **Tags:** Click tag to see all posts with that tag. Great for filtering!"
        },

        // ============ LIVE CHAT ============
        {
            k: ["live chat", "live chatroom", "realtime", "live room", "chat"],
            a: "💬 **Live Chatroom:** Onderaan pagina zie je **live chat** → Realtime met andere leden → Deel muziek, @mentions, vibe! Geen lange discussies, quick & fun! / **Live Chat:** Bottom of page → Real-time chat → Share music, @mentions, quick vibes!"
        },
        {
            k: ["@mention", "mention", "@", "taggen", "iemand noemen"],
            a: "🔔 **@Mentions:** Typ **@gebruikersnaam** in post of chat → Die persoon krijgt **notificatie**! Werkt overal: posts, replies, chat. Perfect om attention te krijgen! / **@Mentions:** Type @username → They get instant notification!"
        },

        // ============ VEILIGHEID & REGELS ============
        {
            k: ["regels", "rules", "guidelines", "community guidelines", "wat mag", "wat niet"],
            a: "📋 **Chatsong Community Regels:** ✅ Wees respectvol. ✅ Bij releases: 150+ tekens + geen bare links. ✅ Constructieve feedback. ✅ Geen spam/hate. ❌ Geen inappropriate content. Moderators handhaven dit! / **Rules:** Be respectful. 150+ chars for releases. Constructive feedback. No spam/hate. Mods enforce!"
        },
        {
            k: ["spam", "report", "inappropriate", "hateful", "rapporteren"],
            a: "⚠️ **Content Rapporteren:** Zie iets fout? Klik **...** (drie puntjes) → **Report** → Beschrijf waarom → Moderators nemen actie! Dank je voor community veilig houden! / **Report:** See something wrong? Click ... → Report → Describe why → Mods act fast!"
        },
        {
            k: ["moderator", "admin", "support", "hulp", "help"],
            a: "🛡️ **Moderators & Support:** Heb je vragen? Post in **Support** categorie of DM een mod/admin. Wij helpen je graag! Community is hier voor support. / **Mods & Support:** Post in Support category or DM a mod! We're here to help!"
        },

        // ============ NOTIFICATIONS & SETTINGS ============
        {
            k: ["notificaties", "notifications", "alerts", "meldingen", "email"],
            a: "🔔 **Notificaties:** Klik je avatar → **Settings** → **Notifications** → Kies: mentions, replies, new posts, etc. → Selecteer: In-App, E-mail, beide! / **Notifications:** Settings → Notifications → Choose mentions, replies, posts → Select In-App, Email, or both!"
        },
        {
            k: ["inbox", "privé bericht", "dm", "direct message", "messages"],
            a: "✉️ **Privé Berichten:** Klik **envelope** (✉️) rechtsboven → Zie privé chats → Om **nieuw PM**: klik profiel → **Send Message**! / **Private Messages:** Click envelope (✉️) → Start new PM from profile!"
        },
        {
            k: ["dark mode", "theme", "donker", "light mode"],
            a: "🌙 **Dark Mode:** Chatsong support automatische Dark Mode gebaseerd op je apparaatinstellingen! / **Dark Mode:** Chatsong auto-detects system dark mode!"
        },
        {
            k: ["taal", "language", "nederlands", "english"],
            a: "🌍 **Taal:** Bovenaan pagina → **Language dropdown** → Kies Nederlands, Engels, of andere taal! / **Language:** Top of page → Language dropdown → Choose Dutch, English, etc!"
        },

        // ============ TIPS & BEST PRACTICES ============
        {
            k: ["tips", "advice", "pro tips", "how to succeed", "hoe succesvol"],
            a: "💡 **Pro Tips:** 1) **Goede titel** = meer engagement. 2) **150+ tekens** bij releases. 3) **Constructieve feedback** = waarde. 4) **Regelmatig posten** = hoger op leaderboard. 5) **Volg discussies** = up-to-date. / **Pro Tips:** Good titles, 150+ chars, constructive feedback, post regularly, follow discussions!"
        },
        {
            k: ["netwerken", "networking", "collaboratie", "collab", "vrienden"],
            a: "🤝 **Netwerken:** 1) Volg interessante posts → Geef feedback → Build relationships. 2) Gebruik **Team up** voor collaborators. 3) Klik **guestbook** voor persoonlijke berichten. 4) Wees actief in **live chat**! / **Networking:** Follow posts, give feedback, use Team up, post in live chat!"
        },
        {
            k: ["feedback geven", "constructive", "criticism", "review"],
            a: "⭐ **Constructieve Feedback:** 1) Wees **specifiek**. 2) Zeg wat **goed** is. 3) Geef **actionable tips**. 4) Wees **vriendelijk**! Goeie feedback = respect & appreciation! / **Constructive Feedback:** Be specific, say what's good, give tips, be kind!"
        },

        // ============ FALLBACK ============
        {
            k: ["help", "hulp", "huh", "wat", "idk"],
            a: "💬 **Hoe kan ik helpen?** Vraag over: **account setup, profiel, categorieën, track posten, feedback, collab, leaderboard, regels, live chat, notificaties, netwerken, tips**. Wat wil je weten? / **How can I help?** Ask about: account, profile, categories, posting, feedback, collab, leaderboard, rules, chat, networking!"
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

        let bestAns = "Dat is een goeie vraag! 🤔 Vraag over: account, profiel, categories, track posten, feedback, collab, leaderboard, regels, live chat, netwerken, tips. Wat wil je weten? / That's a great question! 🤔 Ask about account, profile, posting, feedback, collab, leaderboard, rules, chat, or tips!";
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
