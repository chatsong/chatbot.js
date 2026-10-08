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
                    <div class="b-msg">Hoi! Welkom op Chatsong.nl 🎵 Ik ben hier om je te helpen met account, profiel, forum, posten, tags, reacties, upvotes, regels, Vraag & Aanbod, en meer! Vraag me alles! / Hi! Welcome to Chatsong.nl 🎵 I'm here to help with account, profile, forum, posting, tags, reactions, upvotes, rules, and more! Ask me anything!</div>
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
            #cb-toggle-btn { background: #8a2be2; color: #fff; border: none; padding: 12px 18px; border-radius: 30px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: all 0.3s ease; }
            #cb-toggle-btn:hover { transform: scale(1.05); }
            #cb-window { position: absolute; bottom: 60px; right: 0; width: 380px; height: 540px; background: #ffffff; border: 1px solid #ddd; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 5px 25px rgba(0,0,0,0.15); }
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

    // 🎵 COMPLETE KENNISBANK: ACCOUNT + PROFIEL + FORUM + POSTING + INTERACTIES + VRAAG & AANBOD + REGELS + INSTELLINGEN
    window.chatsongDB = [
        // ============ REGISTRATIE & ACCOUNT ============
        {
            k: ["account", "registreren", "sign up", "inloggen", "login", "hoe aanmaken", "new account", "create account", "account maken"],
            a: "📝 **Registratie:** Klik **'Join Free'** op de homepage → Vul in: e-mail, gebruikersnaam, wachtwoord → Doorloop de Turnstile-captcha → Klaar! Je profiel is direct actief. Alternatief: **Login with Spotify** (super snel!). / **Sign up:** Click 'Join Free' on homepage → Enter: email, username, password → Complete Turnstile captcha → Done! Or use 'Login with Spotify'."
        },
        {
            k: ["wachtwoord", "password vergeten", "forgot", "reset", "herstellen", "passwoord wijzigen"],
            a: "🔑 **Wachtwoord vergeten?** Login-pagina → Klik **'Forgot Password?'** → Voer e-mail in → Controleer inbox voor reset-link → Klik link en voer **nieuw wachtwoord** in. Probleem? Vraag hulp in forum of contacteer support. / **Forgot password?** Login page → Click 'Forgot Password?' → Enter email → Check inbox for reset link → Click link → Enter new password."
        },
        {
            k: ["spotify login", "social login", "verbinden", "connect spotify", "spotify"],
            a: "🎵 **Spotify Login:** Bij 'Join Free' of 'Login': klik **'Login with Spotify'** → Autoriseer Chatsong → Klaar! Je profiel is direct actief en gekoppeld aan je Spotify account. Super snel en veilig! / **Spotify Login:** At signup or login: Click 'Login with Spotify' → Authorize Chatsong → Done! Your profile is immediately active and linked to Spotify."
        },

        // ============ PROFIEL & INSTELLINGEN ============
        {
            k: ["profiel", "profile", "bio", "biografie", "bewerken", "edit profile", "mijn profiel"],
            a: "👤 **Profiel Bewerken:** Klik je **avatar** (rechtsboven) → **'Settings'** → **'Profile'** → Wijzig: bio (max 200 tekens, 5 regels), avatar, beschrijving, links → Klik **'Save'**. / **Edit Profile:** Click your avatar (top right) → 'Settings' → 'Profile' → Change bio, avatar, description, links → Save."
        },
        {
            k: ["avatar", "profielfoto", "foto", "profile picture", "change avatar", "afbeelding profiel"],
            a: "🖼️ **Avatar Wijzigen:** Settings → Profile → Klik ronde foto-placeholder → Upload foto van computer OF plak image-URL → Voorkeur: 400x400px, rond formaat → **'Save'** → Klaar! / **Change Avatar:** Settings → Profile → Click photo placeholder → Upload or paste URL → Preferred: 400x400px, round format → Save."
        },
        {
            k: ["gastenboek", "guestbook", "guestbook bericht", "post a message", "comment on profile", "bericht op profiel"],
            a: "💌 **Gastenboek:** Klik iemands **profiel** → Scroll naar beneden → Klik **'Post a Message ✉'** → Typ je bericht → **'Post'** → Klaar! Berichten zijn openbaar, iedereen ziet ze. Perfect voor collab-requests en feedback! / **Guestbook:** Click someone's profile → Scroll down → Click 'Post a Message ✉' → Type message → Post → Done! Messages are public."
        },
        {
            k: ["social media", "instagram", "youtube", "tiktok", "spotify", "soundcloud", "links toevoegen", "knoppen", "social links"],
            a: "📱 **Social Media Links:** Settings → Profile → Scroll naar 'Social Media' → Voeg links toe: Instagram, YouTube, TikTok, Spotify, SoundCloud, etc. → **'Save'** → Klanten kunnen je daar direct bereiken! / **Social Media:** Settings → Profile → Scroll to 'Social Media' → Add links for Instagram, YouTube, TikTok, Spotify, SoundCloud → Save."
        },
        {
            k: ["taal", "language", "nederlands", "engels", "12 languages", "wisselen", "language change"],
            a: "🌍 **Taal Wijzigen:** **Bovenaan** de pagina: klik taal-dropdown (12+ talen beschikbaar) → Kies Nederlands, Engels, of je favoriete taal → Direct van toepassing op hele platform! / **Change Language:** Top of page: click language dropdown (12+ languages) → Select Dutch, English, or favorite → Applies immediately."
        },
        {
            k: ["dark mode", "donker", "thema", "theme", "nacht modus", "light mode"],
            a: "🌙 **Dark Mode:** Chatsong ondersteunt automatische Dark Mode gebaseerd op je apparaatinstellingen (Windows/Mac). Ga naar Systeem → Instellingen → Donker/Licht → Dark Mode wordt automatisch geactiveerd op Chatsong! / **Dark Mode:** Chatsong auto-detects system dark mode settings. Go to System → Settings → Dark/Light → Dark Mode applies automatically."
        },
        {
            k: ["notificaties", "notifications", "alerts", "meldingen", "e-mail alerts", "notification settings"],
            a: "🔔 **Notificaties:** Settings → **Notifications** → Kies uit: 'Someone mentions you', 'Reply to my post', 'New message', 'Post on guestbook', etc. → Kies per optie: **In-App**, **E-mail**, of **beide** → **'Save'**! / **Notifications:** Settings → Notifications → Choose: mentions, replies, messages, guestbook posts, etc. → Select: In-App, Email, or both."
        },

        // ============ FORUM BASICS & CATEGORIËN ============
        {
            k: ["discussie", "topic", "thread", "post", "how to make", "hoe maak", "starten", "start discussion", "new thread", "discussie starten"],
            a: "💬 **Discussie Starten:** **Stap 1:** Klik een **categorie** (bijv. Releases, Feedback, Support, Collab) → **Stap 2:** Klik grote **'Start Discussion'** knop → **Stap 3:** Vul in: titel, optionele tags, en bericht → **Stap 4:** Klik **'Post'** → Klaar! / **Start Discussion:** Step 1: Click category (e.g., Releases, Feedback) → Step 2: Click 'Start Discussion' button → Step 3: Enter title, tags, message → Step 4: Click 'Post' → Done!"
        },
        {
            k: ["titel", "title", "discussie naam", "discussion name", "hoe goede titel", "good title"],
            a: "📋 **Goede Titel:** Duidelijk, kort (5-10 woorden), beschrijf het onderwerp. ❌ SLECHT: 'Hoi'. ✅ GOED: 'Feedback op mijn new track - Electronic/House'. Goeie titel = meer reacties en views! / **Good Title:** Be clear, short (5-10 words), describe topic. ❌ BAD: 'Hi'. ✅ GOOD: 'Feedback on my new track - Electronic/House'. Good titles = more engagement!"
        },
        {
            k: ["categorie", "category", "forum", "section", "onderdeel", "releases", "feedback", "support", "categories"],
            a: "📂 **Forum Categorieën:** 📎 **Releases** (muziek posten), 💭 **Feedback** (feedback geven/krijgen), 🤝 **Collab** (samenwerkingspartners zoeken), ❓ **Support** (vragen stellen), 💬 **Offtopic** (algemeen praten), 🎵 **Live Music Room** (realtime chat). Klik categorie in menu → Zie alle posts! / **Forum Categories:** Releases, Feedback, Collab, Support, Offtopic, Live Music Room. Click category in menu → See all posts!"
        },
        {
            k: ["releases", "release posten", "nummer posten", "track posten", "muziek delen", "150 tekens", "bare link", "upload"],
            a: "⚠️ **RELEASES POSTEN - BELANGRIJKSTE REGEL:** Bij releases (nummers/tracks): **GEEN BARE LINKS!** Formaat: **Artiestennaam - Nummernaam [Genre]**. VERPLICHT: min. 150 tekens verhaal/context toevoegen. Link Fixer zorgt voor mooie visuele kaart! / **RELEASES - KEY RULE:** No bare links! Format: **Artist - Track [Genre]**. REQUIRED: min. 150 characters description. Link Fixer creates beautiful card."
        },
        {
            k: ["link fixer", "pre-save", "automatisch", "visual card", "distrokid", "spotify link", "auto link"],
            a: "🔗 **Link Fixer (Automatisch):** Plak gewoon je **Spotify/SoundCloud/DistroKid/YouTube-link** in je post → De ingebouwde **Link Fixer** herkent het AUTOMATISCH → Maakt mooie visuele kaart met cover, artiestennaam, etc. → Super handige feature! / **Link Fixer (Auto):** Just paste Spotify/SoundCloud/YouTube link in post → Link Fixer auto-detects → Creates beautiful card with cover art!"
        },

        // ============ REAGEREN & INTERACTIES ============
        {
            k: ["reageren", "reply", "antwoord", "reactie", "respond", "how to reply", "how to comment"],
            a: "↩️ **Reageren op Discussie:** **Scroll naar beneden** in een discussie → Klik **'Reply'** knop → Typ je antwoord in text box → Klik **'Post'** → Klaar! Jouw reactie verschijnt zichtbaar voor iedereen. / **Reply to Discussion:** Scroll down in discussion → Click 'Reply' button → Type your answer → Click 'Post' → Done! Your reply is visible to all."
        },
        {
            k: ["citeren", "quote", "select text", "quoteren", "antwoord aan persoon", "quote reply"],
            a: "📋 **Citeren/Quoting:** Selecteer de **tekst** die je wilt citeren → Klik **'Quote'** → Tekst verschijnt gemarkeerd in je reply-box → Je kunt **meerdere quotes** in één bericht stapelen → Handig voor feedback! / **Quote:** Select text you want to quote → Click 'Quote' → Text appears marked in reply box → Can stack multiple quotes → Great for feedback!"
        },
        {
            k: ["taggen", "@", "mention", "iemand noemen", "notify persoon", "tag someone"],
            a: "🔔 **@Mentions (Taggen):** Typ **@gebruikersnaam** in je post/reactie → Die persoon krijgt direct **notificatie** dat je hen genoemd hebt → Werkt in discussies, replies, gastenboek, en privé berichten → Super handige manier om iemand te roepen! / **@Mentions:** Type @username in post/reply → That person gets instant notification → Works in discussions, replies, guestbook, PMs → Great way to get attention!"
        },
        {
            k: ["upvote", "like", "👍", "reaction", "emoji reaction", "punten", "score", "vote"],
            a: "👍 **Upvoten:** Klik de **👍-knop** onder een post → Geeft de poster **punten** op het Leaderboard → Je kunt **1x per post upvoten** → Goeie posts krijgen meer upvotes = meer punten! Perfect voor community waardering. / **Upvote:** Click 👍 button under post → Gives poster points on Leaderboard → Vote once per post → Good posts get more votes = more points!"
        },
        {
            k: ["volgen", "follow", "subscription", "subscribe", "watch thread", "notifications", "thread abonneren"],
            a: "⭐ **Discussie Volgen:** Klik **'Follow'** onder discussie-titel → Je krijgt **notificaties** bij elke nieuwe reactie → Discussie verschijnt in je **'Following'** tab → Makkelijk om interessante discussies te volgen! / **Follow Discussion:** Click 'Follow' under title → Get notifications for each reply → Appears in your 'Following' tab → Easy to track interesting discussions!"
        },
        {
            k: ["bookmark", "bladwijzer", "saved", "opslaan", "save", "mark for later"],
            a: "📌 **Bookmark (Opslaan):** Klik het **📌-icoontje** onder een post → Sla op in je persoonlijke **'Saved'** list → Zie je in je profielmenu → Perfect om interessante posts, tutorials, en resources later terug te vinden! / **Bookmark:** Click 📌 icon under post → Saved to your 'Saved' list → Access in profile menu → Perfect for saving interesting posts & resources!"
        },
        {
            k: ["bewerken", "edit", "wijzigen", "change", "aanpassen", "fix typo", "edit post"],
            a: "✏️ **Post Bewerken:** Klik de **...** (drie puntjes) onder **JE EIGEN post** → Selecteer **'Edit'** → Je hebt meestal **~1 uur** tijd om je post aan te passen → Klik **'Save'** als je klaar bent → Klaar! / **Edit Post:** Click ... (three dots) under YOUR OWN post → Select 'Edit' → Usually ~1 hour to edit → Click 'Save' when done."
        },
        {
            k: ["verwijderen", "delete", "wissen", "remove", "erase post", "delete post"],
            a: "🗑️ **Post Verwijderen:** Klik de **...** onder **JE post** → Selecteer **'Delete'** → Je kunt je EIGEN posts meestal zelf verwijderen → **Eenmaal weg = definitief weg!** / **Delete Post:** Click ... under YOUR post → Select 'Delete' → You can delete your own posts → Once deleted = permanently gone!"
        },
        {
            k: ["rapporteren", "report", "flag", "spam", "hateful", "rule breaking", "inappropriate", "report post"],
            a: "⚠️ **Post Rapporteren:** Zie je iets ongeldig (spam, haatzaai, nep, inappropriate)? Klik **...** → Selecteer **'Report'** → Beschrijf waarom → Moderators zien dit en nemen **snel actie**! Dank je voor helpen community veilig houden! / **Report Post:** See something wrong (spam, hate, fake)? Click ... → Select 'Report' → Describe why → Moderators take fast action! Thanks for keeping community safe!"
        },

        // ============ FORMATTING & OPMAAK ============
        {
            k: ["markdown", "opmaak", "vet", "bold", "schuin", "italic", "link", "formatting", "editor"],
            a: "✍️ **Markdown Formatting:** Flarum ondersteunt **Markdown**: **vet** = `**tekst**`, *schuin* = `*tekst*`, ~~doorhalen~~ = `~~tekst~~`, [link](url), `> quote`. Klik preview-knop om te zien hoe het eruitziet! / **Markdown:** Use `**bold**`, `*italic*`, `~~strikethrough~~`, `[link](url)`, `> quote`. Click preview to see result!"
        },
        {
            k: ["afbeelding", "image", "foto", "plaatje", "insert image", "upload image", "picture"],
            a: "🖼️ **Afbeelding Toevoegen:** Klik het **foto-icoontje** in de editor → Upload foto van computer OF plak image-URL → Foto verschijnt direct in je post → Max 5MB → Handig voor covers, screenshots, en artwork! / **Add Image:** Click photo icon in editor → Upload or paste URL → Image appears in post → Max 5MB → Great for covers & screenshots!"
        },
        {
            k: ["emoji", "emoticon", "smilie", "😊", "insert emoji", "emoji toevoegen"],
            a: "😊 **Emoji Invoegen:** Typ `:` dan woord, bijv. `:smile:` `:fire:` `:heart:` `:music:` `:star:` → Flarum toont suggesties → Of gebruik emoji-dropdown → Maakt posts leuker en expres iever! / **Insert Emoji:** Type `:` then word, e.g. `:smile:` `:fire:` `:heart:` `:music:` → See suggestions or use emoji dropdown."
        },
        {
            k: ["draft", "concept", "klad", "autosave", "save draft", "unsent"],
            a: "💾 **Drafts (Automatisch Opslaan):** Als je halverwege **stopt zonder te posten**, slaat Flarum je bericht AUTOMATISCH op als **Draft** → Klik later terug → Je ziet **'Resume Draft'** → Perfecte manier om niet je werk te verliezen! / **Drafts (Auto-Save):** Stop writing without posting → Flarum auto-saves as Draft → Click back later → Click 'Resume Draft' → Never lose your work!"
        },

        // ============ ZOEKEN & FILTERING ============
        {
            k: ["zoeken", "search", "vinden", "opzoeken", "how to find", "zoekbalk"],
            a: "🔍 **Zoeken:** **Bovenaan pagina:** klik **magneetglas-icoontje** (🔍) of zoekbalk → Typ artiestennaam, woord, of tag (bijv. #Releases) → Klik **'Recent'**, **'Popular'**, of **'Unanswered'** om te sorteren → Vind precies wat je zoekt! / **Search:** Top of page: click 🔍 icon → Type artist name, keyword, or tag → Sort by Recent, Popular, Unanswered → Find exactly what you need!"
        },
        {
            k: ["tag", "tags", "label", "hashtag", "#", "filtreren", "categories", "tag filter"],
            a: "🏷️ **Tags & Filtreren:** Bij discussies: zie je tags bovenaan (bijv. #Releases, #Feedback, #Collab) → Klik een tag → Zie **alle posts met die tag** → Perfect voor filteren! Populaire tags: #Releases #Feedback #Collab #Support #Mastering #Mixing. / **Tags:** Click tag on post (e.g., #Releases) → See ALL posts with that tag → Perfect for filtering! Popular tags: #Releases #Feedback #Collab."
        },

        // ============ PRIVÉ COMMUNICATIE ============
        {
            k: ["inbox", "privé bericht", "dm", "direct message", "personal message", "private", "pm"],
            a: "✉️ **Privé Berichten (PMs):** Klik het **envelopje** (✉️) **rechtsboven** in navigatie → Daar zie je al je privé gesprekken → Om **nieuw PM** te starten: klik iemands **profiel** → **'Send Message'** → Typ bericht → Klaar! / **Private Messages:** Click envelope (✉️) top right → See all conversations → To start NEW PM: Click someone's profile → 'Send Message' → Type message."
        },
        {
            k: ["mute", "block", "blokkeer", "negeren", "ignore user", "don't see posts"],
            a: "🔇 **Muten vs. Blokkeren:** **Mute:** Klik profiel → **'Mute'** = hun posts verbergen (jij ziet ze niet meer). **Block:** Klik profiel → **'Block'** = geen privé berichten PLUS hun content verdwijnt. / **Mute vs Block:** **Mute:** Click profile → 'Mute' = hide their posts. **Block:** Click profile → 'Block' = no PMs + content hidden."
        },

        // ============ VRAAG & AANBOD + SPECIALS ============
        {
            k: ["vraag en aanbod", "vragen en aanbod", "vraag & aanbod", "aanbod", "vraag", "verkoop", "koop", "service", "collab", "samenwerking"],
            a: "🧾 **Vraag & Aanbod Categorie:** In **Vraag & Aanbod** kun je iets **vragen** of **aanbieden**: service (mix, master, promo), collab, track, beats, design, etc. → Maak duidelijke titel → Voeg tags toe: **#Collab** **#Service** **#Production** → Beschrijf wat je zoekt/aanbiedt → Super voor business! / **Ask & Offer:** Post services, collabs, beats, production help. Make clear title → Add tags: #Collab #Service → Describe what you need/offer → Perfect for business!"
        },
        {
            k: ["live music room", "live chat", "soundboard", "vibe", "mood", "community chat", "supabase"],
            a: "🎵 **Live Music Room:** In de **Live Music Room** kun je in **realtime chatten** met andere leden → Muziek delen → @mentions gebruiken → Bijdragen aan de community → Lekker vibe, geen lange discussies → Perfect voor quick connects en feedback! / **Live Music Room:** Chat in real-time with community → Share music → Use @mentions → Quick & fun vibe → No long threads → Great for quick feedback!"
        },
        {
            k: ["leaderboard", "ranglijst", "ranking", "top contributors", "hall of fame", "puntenlijst"],
            a: "🏆 **Leaderboard:** Het **Leaderboard** toont de **meest actieve en waardevolle deelnemers**. Je verdient punten door: goede posts, helpende reacties, constructieve feedback, upvotes. Klim omhoog door actief en nuttig bij te dragen! / **Leaderboard:** Shows top active members. Earn points by: good posts, helpful replies, constructive feedback, getting upvotes. Climb by being active & helpful!"
        },
        {
            k: ["artiesten", "musicians", "browse", "discover", "a-z filter"],
            a: "🎸 **Artiesten/Musicians Pagina:** Gebruik de **artiesten-overzichtpagina** om op naam te zoeken → Nieuwe makers ontdekken → A-Z filter → Perfect voor networking en collaborations! / **Musicians Page:** Use artists overview page → Search by name → Discover makers → A-Z filter → Great for networking & collabs!"
        },

        // ============ VEILIGHEID & REGELS ============
        {
            k: ["veilig", "safety", "privacy", "kinderen", "pesten", "safe for kids", "moderators"],
            a: "🔒 **Veiligheid & Privacy:** Dit forum is bedoeld om **veilig en respectvol** te blijven. **Moderators houden toezicht**, pesten en misbruik worden **NIET getolereerd**. Privacy: je gegevens zijn veilig. Report inappropriate content → Moderators nemen actie! / **Safety & Privacy:** Forum designed to be safe & respectful. Moderators actively monitor. Harassment & abuse NOT tolerated. Report issues → Fast action!"
        },
        {
            k: ["regels", "rules", "gedrag", "community guidelines", "wat mag", "wat niet"],
            a: "📋 **Chatsong Forum Regels:** ✅ Wees respectvol naar alle leden. ✅ Geen spam of repetitieve posts. ✅ Bij releases: 150+ tekens + geen bare links. ✅ Geef constructieve feedback (helpvol!). ❌ Geen haatzaai, discriminatie. ❌ Geen promotie van illegale content. Moderators handhaven dit! / **Forum Rules:** Be respectful. No spam. 150+ chars for releases (no bare links). Constructive feedback only. No hate/discrimination. No illegal promotion. Mods enforce!"
        },

        // ============ ADVANCED & TIPS ============
        {
            k: ["tips", "advice", "pro tips", "best practices", "hoe word ik beter"],
            a: "💡 **Pro Tips voor Succes:** 1) **Goede titels** = meer engagement. 2) **Tags gebruiken** = beter gevonden. 3) **Constructieve feedback** = waardering van community. 4) **Regelmatig posten** = hogere score op leaderboard. 5) **@mentions** = sneller antwoord. 6) **Follow interessante threads** = up-to-date blijven! / **Pro Tips:** 1) Good titles = more views. 2) Use tags = found easier. 3) Constructive feedback = community love. 4) Post regularly = higher score. 5) @mentions = faster responses. 6) Follow threads = stay updated!"
        },
        {
            k: ["netwerken", "networking", "collaboratie", "collab", "samenwerking", "vrienden"],
            a: "🤝 **Netwerken & Collaboratie:** 1) Volg interessante posts → Geef feedback → Build relationships. 2) Gebruik **Vraag & Aanbod** om samenwerkingspartners te vinden. 3) Klik **Gastenboek** voor persoonlijke berichten. 4) **Join Live Music Room** voor real-time chat. 5) **Upvote goede posts** van anderen → Zij doen hetzelfde! / **Networking & Collab:** 1) Follow posts → Give feedback → Build relationships. 2) Use Ask & Offer for partners. 3) Use Guestbook for personal messages. 4) Join Live Music Room. 5) Upvote others → They upvote you!"
        },
        {
            k: ["feedback geven", "constructieve feedback", "critici", "reviews", "comments", "how to give feedback"],
            a: "⭐ **Constructieve Feedback Geven:** 1) Wees **specifiek** (zeg wat goed is EN wat beter kan). 2) Wees **vriendelijk** (motiveer, steun). 3) Geef **actionable tips** (help ze verbeteren). 4) Zeg wat je **ervan houdt**! 5) Vermijd **negatieve kritiek** zonder oplossingen. Goeie feedback = waardering & respect! / **Constructive Feedback:** Be specific. Be kind. Give actionable tips. Say what you like! Avoid pure negativity. Good feedback = respect & gratitude!"
        },

        // ============ FALLBACK / DEFAULT ============
        {
            k: ["help", "hulp", "info", "informatie", "vraag"],
            a: "💬 **Hoe kan ik je helpen?** Ik kan je helpen met: **Account & Profiel** (registreren, wachtwoord, avatar, instellingen), **Forum Basics** (discussies starten, reageren, tags), **Posten** (releases, formatting, links), **Interacties** (upvotes, bookmarks, mentions), **Veiligheid** (regels, rapporteren), **Vraag & Aanbod**, **Netwerken & Tips**. Vraag me alles! / **How can I help?** I can assist with: Account & Profile, Forum Basics, Posting, Interactions, Safety, Ask & Offer, Networking. Ask me anything!"
        },
        {
            k: ["anders", "iets anders", "meer info", "ander onderwerp"],
            a: "😊 Goeie vraag! Ik heb info over: Account, Profiel, Instellingen, Forum, Discussies, Reageren, Tags, Zoeken, Privé berichten, Vraag & Aanbod, Live Room, Regels, Tips & Netwerken. Stel je vraag en ik help je! / Good question! I have info on: Account, Profile, Settings, Forum, Discussions, Replies, Tags, Search, Private messages, Ask & Offer, Rules, Tips & Networking. Ask away!"
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

        let bestAns = "Dat is een goede vraag! 🤔 Probeer vragen over: registratie, profiel, forum, posten, tags, reageren, upvotes, regels, vraag & aanbod, live room, netwerken, of tips! / That's a good question! 🤔 Try asking about: signup, profile, forum, posting, tags, replies, upvotes, rules, ask & offer, live room, networking, or tips!";
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
