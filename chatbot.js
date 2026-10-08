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
                <div class="b-msg">Hoi! Welkom op Chatsong.nl. Vraag me alles over je account, profiel, hoe je posts maakt, Flarum forum regels, tags, upvotes en meer! 🎵 / Hi! Ask me about your account, profile, posting, forum tags, and more! 💬</div>
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
        #cb-toggle-btn { background: #8a2be2; color: #fff; border: none; padding: 12px 18px; border-radius: 30px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s; }
        #cb-toggle-btn:hover { transform: scale(1.05); }
        #cb-window { position: absolute; bottom: 60px; right: 0; width: 380px; height: 540px; background: #ffffff; border: 1px solid #ddd; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 8px 24px rgba(0,0,0,0.25); overflow: hidden; }
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

    // 🎵 COMPLETE KENNISBANK: ACCOUNT + PROFIEL + FORUM + POSTING + COMMUNITY
    window.chatsongDB = [
        // ========== ACCOUNT & AANMELDEN ==========
        {
            k: ["account", "registreren", "sign up", "inloggen", "login", "hoe aanmaken", "new account", "create account"],
            a: "📝 Naar de homepage en klik **'Join Free'**. Vul in: e-mail, gebruikersnaam, wachtwoord, doorloop Turnstile-captcha, klaar! Je kunt ook via Spotify inloggen. / 📝 Click **'Join Free'** on homepage, enter email, username, password, complete captcha, done! Or log in via Spotify."
        },
        {
            k: ["wachtwoord", "password vergeten", "forgot", "reset", "herstellen"],
            a: "🔑 Op de login-pagina: klik 'Forgot Password?', voer je e-mail in, controleer je inbox voor reset-link. Klik de link en voer nieuw wachtwoord in. Probleem? Vraag het in Live Music Room! / 🔑 Click 'Forgot Password?' on login page, enter email, check inbox for reset link, set new password."
        },
        {
            k: ["spotify login", "social login", "verbinden", "connect"],
            a: "🎵 Bij 'Join Free': klik **'Login with Spotify'**, autoriseer Chatsong, klaar! Je profiel is direct actief. Super snel! / 🎵 Click 'Login with Spotify' at signup, authorize Chatsong, done! Your profile is instantly active."
        },

        // ========== PROFIEL & INSTELLINGEN ==========
        {
            k: ["profiel", "profile", "bio", "biografie", "bewerken", "edit profile"],
            a: "👤 **Klik je avatar** (rechtsboven) → **'Settings'** → **'Profile'**. Daar wijzig je: bio (max 200 tekens, 5 regels), avatar, beschrijving, links. Als je klaar bent, klik 'Save'. / 👤 Click your avatar (top right) → 'Settings' → 'Profile'. Edit: bio (max 200 chars), avatar, description, links. Click 'Save'."
        },
        {
            k: ["avatar", "profielfoto", "foto", "profile picture", "change avatar"],
            a: "🖼️ Settings → Profile → klik de ronde foto-placeholder. Upload je foto van je computer of plak een URL. Voorkeur: 400x400px, rond formaat. 'Save' en klaar! / 🖼️ Settings → Profile → click photo placeholder, upload from computer or paste URL. Best: 400x400px, round format. 'Save'."
        },
        {
            k: ["gastenboek", "guestbook", "guestbook bericht", "post a message", "comment on profile"],
            a: "💌 Op iemands **profiel**: scroll naar beneden, klik **'Post a Message ✉'**, typ je bericht, post! Berichten zijn openbaar, iedereen ziet ze. Perfecte plek voor collab-requests! / 💌 On someone's profile: scroll down, click 'Post a Message ✉', type, post! Public guestbook. Great for collab requests!"
        },
        {
            k: ["social media", "instagram", "youtube", "tiktok", "spotify", "soundcloud", "links toevoegen", "knoppen"],
            a: "📱 Settings → Profile → scroll naar 'Social Media'. Voeg links toe voor Instagram, YouTube, TikTok, Spotify, SoundCloud, enz. Klanten kunnen je daar direct bereiken! / 📱 Settings → Profile → scroll to 'Social Media'. Add Instagram, YouTube, TikTok, Spotify, SoundCloud links. Easy access!"
        },
        {
            k: ["taal", "language", "nederlands", "engels", "12 languages", "wisselen"],
            a: "🌍 **Bovenaan** de pagina: taal-dropdown (12+ talen beschikbaar). Kies Nederlands of Engels of je favoriete taal. Direct van toepassing! / 🌍 Top of page: language dropdown (12+ languages). Choose Dutch, English, or your favorite language. Instant!"
        },
        {
            k: ["dark mode", "donker", "thema", "theme", "nacht modus"],
            a: "🌙 Chatsong ondersteunt automatische Dark Mode gebaseerd op je apparaatinstellingen (Windows/Mac). Systeem → Instellingen → Donker/Licht → Dark Mode wordt automatisch geactiveerd. Gemak! / 🌙 Chatsong supports automatic Dark Mode based on your device settings. System → Settings → Dark Mode auto-activates."
        },
        {
            k: ["notificaties", "notifications", "alerts", "meldingen", "e-mail alerts"],
            a: "🔔 Settings → Notifications. Hier kies je: 'Someone mentions you', 'Reply to my post', 'New message', 'Post on guestbook', etc. Kies In-App, E-mail, of beide. Jouw controle! / 🔔 Settings → Notifications. Choose: 'Mentions you', 'Reply to post', 'Message', 'Guestbook post', etc. In-app, email, or both!"
        },

        // ========== FORUM BASICS: DISCUSSIES EN POSTS ==========
        {
            k: ["discussie", "topic", "thread", "post", "how to make", "hoe maak", "starten", "start discussion", "new thread"],
            a: "💬 **Stap 1:** Klik een **categorie** (bijv. Releases, Feedback, Support). **Stap 2:** Klik grote **'Start Discussion'** knop. **Stap 3:** Vul in: titel, optionele tags (#Releases #Feedback), en je bericht. **Stap 4:** Klik **'Post'**. Klaar! / 💬 **Step 1:** Click a category (Releases, Feedback, Support). **Step 2:** Click 'Start Discussion'. **Step 3:** Enter: title, optional tags, message. **Step 4:** Click 'Post'. Done!"
        },
        {
            k: ["titel", "title", "discussie naam", "discussion name", "hoe goede titel"],
            a: "📋 **Goede titel:** Duidelijk, kort (5-10 woorden), beschrijf het onderwerp. ❌ SLECHT: 'Hoi'. ✅ GOED: 'Feedback op mijn new track - Electronic/House'. ✅ GOED: 'Samenwerking gezocht - Drums & Bass Producer'. Goeie titel = meer reacties! / 📋 **Good title:** Clear, short (5-10 words), describes topic. ❌ BAD: 'Hi'. ✅ GOOD: 'Feedback on my new track - Electronic/House'. ✅ GOOD: 'Collab wanted - Drums & Bass Producer'. Better title = more replies!"
        },
        {
            k: ["nummer posten", "release posten", "track posten", "muziek delen", "150 tekens", "bare link", "upload"],
            a: "⚠️ **BELANGRIJKSTE REGEL:** Bij releases (nummers/tracks): **GEEN BARE LINKS!** Formaat: **Artiestennaam - Nummernaam [Genre]**. VERPLICHT: min. 150 tekens verhaal/context toevoegen. Google kan niet luisteren, dus we nodig beschrijving voor SEO! Anders wordt post verwijderd. / ⚠️ **KEY RULE:** No bare links! Format: **Artist - Song Title [Genre]**. MUST add 150+ characters of story/context. Google can't listen, we need descriptions for SEO! Post removed otherwise."
        },
        {
            k: ["link fixer", "pre-save", "automatisch", "visual card", "distrokid", "spotify link"],
            a: "🔗 Plak gewoon je **Spotify/SoundCloud/DistroKid/YouTube-link** in je post. De ingebouwde **Link Fixer** herkent het AUTOMATISCH en maakt er een mooie visuele kaart van. Super! Geen extra werk nodig. / 🔗 Just paste your **Spotify/SoundCloud/DistroKid/YouTube link**. The built-in **Link Fixer** automatically recognizes it and converts to a beautiful visual card. Awesome! No extra work."
        },
        {
            k: ["reageren", "reply", "antwoord", "reactie", "respond", "how to reply", "how to comment"],
            a: "↩️ **Scroll naar beneden** in een discussie. Klik **'Reply'** boton. Typ je antwoord in de text box. Klik **'Post'**. Klaar! Je reactie is zichtbaar voor iedereen. / ↩️ **Scroll down** in a discussion. Click the **'Reply'** button. Type your answer. Click **'Post'**. Done! Your reply is visible."
        },
        {
            k: ["citeren", "quote", "select text", "quoteren", "antwoord aan persoon"],
            a: "📋 Selecteer de **tekst** die je wilt citeren → Klik **'Quote'**. De tekst verschijnt gemarkeerd in je reply-box. Je kunt **meerdere quotes** in één bericht stapelen voor duidelijke discussie. Heel handig! / 📋 Select the text you want to quote → Click 'Quote'. Text appears highlighted in reply-box. You can stack **multiple quotes** in one message. Very useful!"
        },

        // ========== FORUM: TAGS & CATEGORIEËN ==========
        {
            k: ["tag", "tags", "label", "hashtag", "#", "filtren", "categories"],
            a: "🏷️ **Bij discussies:** bovenaan zie je tags (bijv. #Releases, #Feedback, #Collab). Klik een tag om **alle posts met die tag** te zien. Handig voor thema's zoeken! **Populaire tags:** #Releases #Feedback #Collab #Support #Showcase #Question. / 🏷️ At top of discussion: tags (e.g., #Releases, #Feedback, #Collab). Click a tag to see **all posts with that tag**. Popular: #Releases #Feedback #Collab #Support #Showcase #Question."
        },
        {
            k: ["categorie", "category", "forum", "section", "onderdeel", "releases", "feedback", "support"],
            a: "📂 **Forum categorieën** (meestal): 📎 Releases (posts over nummers), 💭 Feedback (vragen om feedback), 🤝 Collab (samenwerking zoeken), ❓ Support (hulp nodig), 💬 Offtopic (random chat), 🎵 Live Music Room (live chat). Klik een categorie in het menu om al die posts te zien! / 📂 **Forum categories** (typically): 📎 Releases (song posts), 💭 Feedback (feedback requests), 🤝 Collab (seeking collaborations), ❓ Support (need help), 💬 Offtopic (random chat), 🎵 Live (live chat). Click to view!"
        },
        {
            k: ["releases categorie", "feedback categorie", "collab categorie", "support categorie"],
            a: "📂 **Releases:** Post je nummers hier (150+ tekens, geen bare links!). **Feedback:** Vraag om feedback op je werk. **Collab:** Zoek samenwerkingspartners. **Support:** Technische vragen of hulp. **Offtopic:** Leuke random gesprekken. / 📂 **Releases:** Post your music (150+ chars, no bare links). **Feedback:** Ask for feedback. **Collab:** Find collaborators. **Support:** Tech questions/help. **Offtopic:** Random fun."
        },

        // ========== FORUM: ZOEKEN & NAVIGATIE ==========
        {
            k: ["zoeken", "search", "vinden", "opzoeken", "how to find", "zoekbalk"],
            a: "🔍 **Bovenaan:** klik op **magneetglas-icoontje** (🔍) of zoekbalk. Typ: artiestennaam, woord, tag (bijv. #Releases). Klik 'Recent', 'Popular', 'Unanswered' om sortering te veranderen. Snel gevonden! / 🔍 **Top of page:** click search icon or search bar. Type: artist name, word, tag (e.g., #Releases). Click 'Recent', 'Popular', 'Unanswered' to sort. Found quick!"
        },
        {
            k: ["recente posts", "latest", "newest", "recent", "what's new", "trending"],
            a: "📰 Standaard zie je de **meest recente** posts. Klik **'Latest'** voor nieuwste, **'Top'** voor populairste, **'Unanswered'** voor threads die reacties nodig hebben. Kies wat je wilt! / 📰 By default: **most recent** posts. Click 'Latest' for newest, 'Top' for popular, 'Unanswered' for threads needing replies."
        },

        // ========== FORUM: EDITOR & OPMAAK ==========
        {
            k: ["markdown", "opmaak", "vet", "bold", "schuin", "italic", "link", "formatting", "editor"],
            a: "✍️ Flarum ondersteunt **Markdown**: **vet** = `**tekst**`, *schuin* = `*tekst*`, ~~doorhalen~~ = `~~tekst~~`, [link](url), \n> quote = `> quote`. Preview-knop toont hoe het eruitziet voordat je post! / ✍️ Flarum supports **Markdown**: **bold** = `**text**`, *italic* = `*text*`, [link](url), > quote. Preview button shows how it looks before posting!"
        },
        {
            k: ["afbeelding", "image", "foto", "plaatje", "insert image", "upload image", "picture"],
            a: "🖼️ Klik het **foto-icoontje** in de editor. Upload van computer OF plak image-URL. Foto verschijnt direct in je post. Voorkeur: JPG/PNG, max 5MB. Handig voor album covers, screenshots! / 🖼️ Click photo icon in editor. Upload from computer OR paste image URL. Photo appears in your post. Max 5MB. Great for album covers, screenshots!"
        },
        {
            k: ["emoji", "emoticon", "smilie", "😊", "insert emoji"],
            a: "😊 Typ `:` dan woord, bijv. `:smile:` `:fire:` `:heart:` `:music:`. Flarum toont suggesties. OF klik emoji-icoontje voor dropdown. Maak je posts leuker! / 😊 Type `:` then word, e.g. `:smile:` `:fire:` `:heart:`. Flarum shows suggestions. Or click emoji icon for dropdown. Make posts fun!"
        },
        {
            k: ["draft", "concept", "klad", "autosave", "save draft", "unsent"],
            a: "💾 Als je halverwege stopt zonder te posten, slaat Flarum je bericht AUTOMATISCH op als Draft. Klik later terug en je ziet: 'Resume Draft'. Geen verlies van werk! / 💾 If you stop writing without posting, Flarum automatically saves as Draft. Click back later and see 'Resume Draft'. No lost work!"
        },

        // ========== FORUM: INTERACTIE ==========
        {
            k: ["taggen", "@", "mention", "iemand noemen", "notify persoon", "tag someone"],
            a: "🔔 Typ **@gebruikersnaam** in je post. Die persoon krijgt direct **notificatie** dat je hen genoemd hebt! Werkt in discussies, replies, en guestbook. Perfect om aandacht te trekken! / 🔔 Type **@username** in your post. That person gets instant **notification**! Works in discussions, replies, guestbook. Perfect for getting attention!"
        },
        {
            k: ["upvote", "like", "👍", "reaction", "emoji reaction", "punten", "score"],
            a: "👍 Klik de **👍-knop** onder een post. Geeft de poster **punten** op het Leaderboard! Je kunt 1x per post upvoten (je kunt terugdraaien). Goeie posts krijgen meer upvotes → meer punten! / 👍 Click the **👍 button** under a post. Gives poster **points** on Leaderboard! You can upvote once per post (can undo). Good posts get more upvotes → more points!"
        },
        {
            k: ["volgen", "follow", "subscription", "subscribe", "watch thread", "notifications"],
            a: "⭐ Klik **'Follow'** onder discussie-titel. Je krijgt dan **notificaties** bij nieuwe reacties EN het verschijnt in je **'Following'** tab. Handig voor threads die je wilt volgen! / ⭐ Click 'Follow' under discussion title. Get **notifications** on new replies AND see in your **'Following'** tab. Great for tracking threads!"
        },
        {
            k: ["bookmark", "bladwijzer", "saved", "opslaan", "save", "mark for later"],
            a: "📌 Klik het **📌-icoontje** onder een post. Sla op in je persoonlijke **'Saved'** list (zie je in profielmenu). Perfecte plek om interessante posts terug te vinden! / 📌 Click the **📌 icon** under a post. Save to your personal **'Saved'** list (in profile menu). Perfect for finding interesting posts later!"
        },

        // ========== FORUM: BEWERKEN & VERWIJDEREN ==========
        {
            k: ["bewerken", "edit", "wijzigen", "change", "aanpassen", "fix typo"],
            a: "✏️ Klik de **...** (drie puntjes) onder JE EIGEN post → Selecteer **'Edit'**. Je hebt meestal ~1 uur tijd om je post aan te passen. Moderators kunnen alles bewerken. Klik 'Save' als je klaar bent! / ✏️ Click the **...**(three dots) under YOUR OWN post → Select 'Edit'. You usually have ~1 hour to adjust. Moderators can edit anything. Click 'Save' when done!"
        },
        {
            k: ["verwijderen", "delete", "wissen", "remove", "erase post"],
            a: "🗑️ Klik de **...** onder JE post → Selecteer **'Delete'**. Je kunt je EIGEN posts meestal zelf verwijderen. Moderators kunnen alles verwijderen als het tegen regels is. Eenmaal weg = definitief weg! / 🗑️ Click **...** under YOUR post → Select 'Delete'. You can usually delete your own posts. Moderators delete rule-breaking posts. Once gone = permanently gone!"
        },
        {
            k: ["rapporteren", "report", "flag", "spam", "hateful", "rule breaking", "inappropriate"],
            a: "⚠️ Zie je iets ongeldig (spam, haatzaai, nep)? Klik **...** → Selecteer **'Report'**. Beschrijf waarom. Moderators zien dit en nemen **snel actie**. Niet zelf ingrijpen - reporteren gebruiken! / ⚠️ See something wrong (spam, hate speech, fake)? Click **...** → Select 'Report'. Describe why. Moderators see this and **act fast**. Don't intervene - use reporting!"
        },

        // ========== FORUM: INBOX & PRIVACY ==========
        {
            k: ["inbox", "privé bericht", "dm", "direct message", "personal message", "private"],
            a: "✉️ Klik het **envelopje** (✉️) rechtsboven in navigatie. Daar zie je privé gesprekken met andere leden. Klik iemands **profiel** → **'Send Message'** om nieuw privé bericht te starten. Privacy gegarandeerd! / ✉️ Click the **envelope** (✉️) top right in navigation. See private conversations. Click someone's profile → 'Send Message' to start new PM. Privacy guaranteed!"
        },
        {
            k: ["mute", "block", "blokkeer", "negeren", "ignore user", "don't see posts"],
            a: "🔇 Klik iemands **profiel** → **'Mute'** zodat je hun posts niet ziet. **'Block'** betekent: geen privé berichten mogelijk EN hun content verdwijnt. Handig als je iemand liever niet ziet! / 🔇 Click someone's profile → 'Mute' to hide their posts. 'Block' = no PMs possible AND their content hidden. Useful for avoiding someone!"
        },

        // ========== FORUM: REGELS & MODERATIE ==========
        {
            k: ["regels", "rules", "gedrag", "community guidelines", "wat mag", "wat niet", "forbidden"],
            a: "📋 **Chatsong Forum Regels:** ✅ Wees respectvol & vriendelijk. ✅ Geen spam/ads buiten je posts. ✅ Zet 150+ tekens bij releases (geen bare links!). ✅ Geef constructieve feedback. ✅ Volg taggen/categorie-regels. ❌ Geen haatzaai, pesten, discriminatie. ❌ Geen reclame in PMs. Moderators handhaven dit! / 📋 **Forum Rules:** ✅ Be respectful & kind. ✅ No spam/ads outside posts. ✅ Add 150+ characters to releases (no bare links!). ✅ Give constructive feedback. ❌ No hate speech, bullying, discrimination. Moderators enforce!"
        },
        {
            k: ["waarschuwing", "warning", "suspension", "ban", "verbannen", "gestraft"],
            a: "⚠️ Regels breken? Je krijgt waarschuwing (warning), dan suspension (even offline), dan permanente ban. Moderators proberen eerlijkheid, maar duidelijke schendingen = snel actie. Respecteer regels → geen probleem! / ⚠️ Break rules? Warning first, then suspension, then permanent ban. Moderators try fairness, but clear violations = quick action. Respect rules → no problem!"
        },

        // ========== LIVE MUSIC ROOM & COMMUNITY ==========
        {
            k: ["live music room", "live chat", "soundboard", "vibe", "mood", "support", "supabase"],
            a: "🎵🔴 **Onderaan scherm:** de **Live Music Chatroom** (realtime chat powered by Supabase). Hier: live chatten, @-mention anderen, muziek embeds (Spotify/SoundCloud/YouTube), Vibe Panel (stemming delen), Soundboard (support/vragen). WHERE IT HAPPENS! / 🎵🔴 **Bottom of screen:** **Live Music Chatroom** (real-time powered by Supabase). Chat live, @-mention, embed music, share vibes, ask for support. WHERE IT HAPPENS!"
        },
        {
            k: ["leaderboard", "ranglijst", "ranking", "top", "punten", "leaders", "hall of fame"],
            a: "🏆 **Leaderboard** toont TOP contributors gerangschikt op punten (upvotes). Verzamel punten door: goede posts, reacties, feedback geven. Top contributors win recognition! Klik 🏆 in menu om te zien! / 🏆 **Leaderboard** shows TOP contributors by points (upvotes). Earn points via: good posts, replies, feedback. Top contributors get recognition! Click 🏆 in menu!"
        },
        {
            k: ["artiesten", "musicians", "a-z filter", "filterbar", "browse", "discover"],
            a: "🎸 **A-Z Musicians Filterbar:** blader snel en alfabetisch door alle onafhankelijke artiesten op Chatsong. Perfect om nieuwe muzikanten te ontdekken! Klik 🎸 **Musicians** in het menu. / 🎸 **A-Z Musicians Filterbar:** browse all independent artists alphabetically. Perfect for discovering new musicians! Click 🎸 **Musicians** in menu."
        },

        // ========== VEILIGHEID & INCLUSIE ==========
        {
            k: ["veilig", "safety", "veiligheid", "privacy", "pesten", "ouder", "kinderen", "safe for kids"],
            a: "🔒 **Chatsong is 100% gratis EN veilig!** Je mag artiestennaam gebruiken (echte naam niet nodig). **Moderators** zorgen dat het netjes blijft, pesten wordt NIET getolereerd. Geschikt voor kinderen met toezicht! / 🔒 **Chatsong is 100% free AND safe!** Use artist names (no real name needed). Moderators keep it civil, bullying NOT tolerated. Kid-friendly with supervision!"
        },
        {
            k: ["alleen luisteren", "lurker", "geen muziek", "alleen chatten", "meepraten", "beginner"],
            a: "💬 **Iedereen is welkom!** Je hoeft NIET je eigen muziek te uploaden. Je kunt: 💭 Meepraten & feedback geven, 🎧 Alleen luisteren naar anderen, 🤝 Chatten in Live Music Room, 🙋 Vragen stellen, 📖 Leren. Geen drempel, iedereen mee! / 💬 **Everyone welcome!** You DON'T have to upload music. You can: 💭 Join & give feedback, 🎧 Just listen, 🤝 Chat in Live Room, 🙋 Ask questions, 📖 Learn. No barriers, join in!"
        },

        // ========== TIPS & TRICKS ==========
        {
            k: ["tips", "tricks", "hacks", "hints", "advice", "best practices", "how to succeed"],
            a: "💡 **Tips voor succes:** 1️⃣ Goede titel + 150+ tekens = meer reacties. 2️⃣ Upvote anderen → zij upvoten jou. 3️⃣ Specifieke tags gebruiken (#Releases #Feedback). 4️⃣ Respectvol zijn & feedback geven. 5️⃣ Actief in Live Room = beter gekend. 6️⃣ Geduld = community groeit langzaam. / 💡 **Success tips:** 1️⃣ Good title + 150+ chars = more replies. 2️⃣ Upvote others → they upvote you. 3️⃣ Use specific tags. 4️⃣ Be respectful & give feedback. 5️⃣ Active in Live Room = better known. 6️⃣ Patience!"
        }
    ];

    window.toggleChatsongBot = function() {
        const win = document.getElementById('cb-window');
        win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    };

    window.handleChatsongKey = function(e) {
        if (e.key === 'Enter') window.sendChatsongMsg();
    };

    // Fuzzy search function: berekent gelijkenis tussen twee strings
    function levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    // Betere matching algoritme
    function calculateScore(question, keywords) {
        let score = 0;
        const q = question.toLowerCase();
        
        keywords.forEach(keyword => {
            const kw = keyword.toLowerCase();
            
            // Exact match: sterke bonus
            if (q.includes(kw)) {
                score += kw.length * 3;
            }
            // Fuzzy match: zwakkere bonus
            else {
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
        const text = input.value.trim();
        if (!text) return;

        messages.innerHTML += `<div class="u-msg">${escapeHtml(text)}</div>`;
        const q = text.toLowerCase();
        input.value = '';

        let bestAns = "Dat is een goede vraag! 🤔 Probeer vragen over: account/login, profiel bewerken, hoe een discussie starten, releases posten, tags gebruiken, upvoten, forum regels, of stuur bericht in Live Music Room. / That's a great question! 🤔 Try asking about: account/login, edit profile, start discussion, post music, use tags, upvote, forum rules, or chat in Live Music Room.";
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
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
})();
