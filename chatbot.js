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
                <div class="b-msg">Hoi! Welkom op Chatsong.nl. Vraag me alles over de community, je profiel, de 150-tekens rule, Flarum, de Live Music Room of het Soundboard! 🎵 / Hi! Ask me anything about profiles, releases, Flarum features, or the Live Music Room! 💬</div>
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
        #cb-window { position: absolute; bottom: 60px; right: 0; width: 360px; height: 520px; background: #ffffff; border: 1px solid #ddd; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 8px 24px rgba(0,0,0,0.25); overflow: hidden; }
        #cb-header { background: #1a1a1a; color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 14px; }
        #cb-header button { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; }
        #cb-messages { flex: 1; padding: 12px; overflow-y: auto; font-size: 13px; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
        .b-msg { background: #e9ecef; padding: 10px 14px; border-radius: 8px; max-width: 85%; align-self: flex-start; color: #333; line-height: 1.4; word-wrap: break-word; }
        .u-msg { background: #8a2be2; color: #fff; padding: 10px 14px; border-radius: 8px; max-width: 85%; align-self: flex-end; line-height: 1.4; word-wrap: break-word; }
        #cb-input-area { display: flex; border-top: 1px solid #ddd; padding: 8px; background: #fff; }
        #cb-input { flex: 1; border: 1px solid #ccc; padding: 10px; border-radius: 6px; outline: none; font-size: 13px; }
        #cb-input:focus { border-color: #8a2be2; }
        #cb-input-area button { background: #8a2be2; color: #fff; border: none; padding: 10px 16px; margin-left: 6px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    `;
    document.head.appendChild(style);

    // 🎵 ULTIEME KENNISBANK: FLARUM + CHATSONG + PROFIEL + KIDS/BEGINNERS (NEDERLANDS & ENGELS)
    window.chatsongDB = [
        // ========== WELKOM & GETTING STARTED ==========
        {
            k: ["wat nu", "klaar", "profiel aangemaakt", "starten", "eerste stap", "opties", "what to do", "profile created", "wat kan ik doen", "now what"],
            a: "🎉 Gefeliciteerd met je nieuwe profiel! Dit kun je nu allemaal doen: 1) **UserCard & Gastenboek** - Voeg socialmediaknoppen toe en ontvang collab-verzoeken. 2) **Muziek Delen** - Post je tracks (vergeet de 150-tekens regel niet!). 3) **Live Music Room** - Chat live en luister naar ingebedde muziek. 4) **Leaderboard** - Verzamel punten via upvotes. 5) **Flarum Forum** - Start discussies, reageer en tag anderen. / 🎉 Congratulations on your new profile! You can now: 1) **UserCard & Guestbook** - Add social media buttons and receive collab requests. 2) **Share Music** - Post your tracks (remember the 150-character rule!). 3) **Live Music Room** - Chat and listen to embedded music. 4) **Leaderboard** - Earn points through upvotes. 5) **Join Discussions** - Start threads and reply to others."
        },
        {
            k: ["wat is chatsong", "missie", "doel", "gratis", "payola", "2017", "roy", "verschil", "anders", "kind", "beginner", "doelgroep", "about", "mission", "who", "real music zero bots"],
            a: "🎵 Chatsong.nl is in 2017 opgericht door Chatsong Roy met als belofte 'Real Music, Zero Bots!'. Het is een onafhankelijke, mensgedreven muziekcommunity zonder payola. Echte mensen beoordelen de muziek in plaats van algoritmes. Beginners, kinderen en ervaren artiesten zijn welkom! / 🎵 Chatsong.nl was founded in 2017 by Chatsong Roy with the promise 'Real Music, Zero Bots!'. It's an independent, human-driven music community without payola. Real people judge the music, not algorithms. Beginners, kids, and experienced artists are all welcome!"
        },
        {
            k: ["account", "registreren", "aanmaken", "inloggen", "sign up", "join free", "wachtwoord", "spotify", "login", "turnstile", "captcha", "register", "how to sign up", "create account"],
            a: "📝 Ga naar de homepage en klik 'Join Free'. Vul je e-mail, gebruikersnaam en wachtwoord in, doorloop de Turnstile-captcha, en je bent klaar! Je kunt ook via Spotify inloggen. / 📝 Go to the homepage and click 'Join Free'. Enter your email, username, and password, complete the Turnstile-captcha, and you're done! You can also log in via Spotify."
        },
        {
            k: ["taal", "language", "engels", "nederlands", "talen", "thema", "dark mode", "donker", "instellingen", "settings", "change language", "theme"],
            a: "🌍 Bovenaan vind je een taal-dropdown met 12 talen (Nederlands, Engels, etc.). De website ondersteunt automatische Dark Mode op basis van je apparaatinstellingen. / 🌍 Find the language dropdown at the top with 12 languages (Dutch, English, etc.). The website supports automatic Dark Mode based on your device settings."
        },

        // ========== PROFIEL & USERCARD ==========
        {
            k: ["profiel", "bio", "biografie", "avatar", "profielfoto", "social", "knoppen", "usercard", "profile", "make profile", "create profile", "edit profile", "my profile"],
            a: "👤 Je UserCard is je visitekaartje. Je bio mag max. 200 tekens en 5 regels zijn. Ga naar Settings om je avatar en socialmediaknoppen (Instagram, Spotify, SoundCloud, YouTube, TikTok) toe te voegen. Klik op je profiel en 'Edit Profile'. / 👤 Your UserCard is your digital business card. Your bio can be max. 200 characters and 5 lines. Go to Settings to add your avatar and social media buttons (Instagram, Spotify, SoundCloud, YouTube, TikTok). Click your profile and 'Edit Profile'."
        },
        {
            k: ["gastenboek", "guestbook", "collab", "bericht op profiel", "samenwerken", "collab request", "post message", "leave message"],
            a: "💌 Op elk profiel vind je een openbaar gastenboek ('Post a message ✉'). Andere muzikanten kunnen daar berichten of samenwerkingsverzoeken (collab requests) achterlaten. Klik op iemands profiel en selecteer 'Post a Message'. / 💌 Every profile has a public guestbook ('Post a message ✉'). Other musicians can leave messages or collab requests. Click on someone's profile and select 'Post a Message'."
        },

        // ========== RELEASES & 150-TEKENS REGEL ==========
        {
            k: ["nummer", "muziek", "uploaden", "plaatsen", "post", "topic", "regels", "150 tekens", "link", "titel", "bare link", "seo", "release", "track", "upload music", "post track", "share song"],
            a: "⚠️ BELANGRIJK: **Geen bare link dumping!** Bij het plaatsen van een release, gebruik het formaat: **Artiestennaam - Nummer Titel [Genre]**. Je MOET minimaal 150 tekens context/verhaal toevoegen, anders wordt je post verwijderd. Google kan niet luisteren, dus we hebben beschrijving nodig voor SEO! / ⚠️ IMPORTANT: **No bare link dumping!** When posting a release, use this format: **Artist Name - Song Title [Genre]**. You MUST add at least 150 characters of context/story or your post will be removed. Google can't listen to music, so we need descriptions for SEO!"
        },
        {
            k: ["link fixer", "pre-save", "distrokid", "socials", "pre save fixer", "automatisch", "visual card", "link card"],
            a: "🔗 De ingebouwde Link- en Pre-save Fixer herkent links (DistroKid, Spotify, SoundCloud) automatisch en verandert ze in mooie visuele kaarten. Gewoon je link in de post zetten en het doet het zelf! / 🔗 The built-in Link and Pre-save Fixer automatically recognizes links (DistroKid, Spotify, SoundCloud) and converts them into beautiful visual cards. Just paste your link in the post and it does it automatically!"
        },

        // ========== FLARUM: FORUM BASICS ==========
        {
            k: ["discussie", "topic", "thread", "post", "berichtje", "discussion", "start", "onderwerp", "forum", "start discussion", "new thread"],
            a: "💬 Een **discussie** is een gespreksthread in een forum-categorie. Klik op een categorie (bijv. 'Releases', 'Feedback') en selecteer 'Start a Discussion'. Voeg een titel, tags en je bericht toe (min. 150 tekens voor releases!). / 💬 A **discussion** is a conversation thread in a forum category. Click on a category (e.g., 'Releases', 'Feedback') and select 'Start a Discussion'. Add a title, tags, and your message (min. 150 characters for releases!)."
        },
        {
            k: ["reageren", "reply", "antwoord", "comment", "reactie", "respond", "how to reply", "post reply"],
            a: "↩️ Scroll naar beneden in een discussie en klik 'Reply'. Typ je antwoord in de blauwe box. Je kunt ook op een ander bericht klikken en 'Reply' selecteren om direct erop te antwoorden (threading). / ↩️ Scroll down in a discussion and click 'Reply'. Type your answer in the blue box. You can also click on another message and select 'Reply' to answer it directly (threading)."
        },
        {
            k: ["citaat", "quote", "citeer", "quote reply", "quoteren", "select text"],
            a: "📋 Selecteer de tekst die je wilt citeren en klik 'Quote'. De tekst verschijnt gemarkeerd in je reply. Je kunt meerdere citaten in één bericht stapelen voor duidelijke discussies. / 📋 Select the text you want to quote and click 'Quote'. The text appears highlighted in your reply. You can stack multiple quotes in one message for clear discussions."
        },
        {
            k: ["taggen", "@", "mention", "at-teken", "iemand bereiken", "notify", "tag someone", "@username"],
            a: "🔔 Typ @gebruikersnaam in je bericht. Die persoon krijgt direct een notificatie dat ze genoemd zijn. Dit werkt in discussies, replies, en het guestbook. Handig om aandacht te trekken! / 🔔 Type @username in your message. That person gets notified immediately. This works in discussions, replies, and the guestbook. Great for getting attention!"
        },
        {
            k: ["upvote", "like", "👍", "punten", "score", "leaderboard", "ranglijst", "ranking", "vote", "thumbs up"],
            a: "👍 Klik op de 👍-knop onder een bericht om het te upvoten. Dit geeft de persoon punten op het Leaderboard. Je kunt maar 1x per bericht upvoten (je kunt het terugdraaien). De top-contributors verschijnen op het Leaderboard! / 👍 Click the 👍 button under a message to upvote it. This gives the person points on the Leaderboard. You can only upvote once per message (you can undo it). Top contributors appear on the Leaderboard!"
        },

        // ========== FLARUM: TAGS & CATEGORIEËN ==========
        {
            k: ["tag", "tags", "label", "filtren", "categorie", "forum", "filter", "find posts", "browse"],
            a: "🏷️ Bovenaan een discussie zie je tags (bijv. #Releases, #Feedback, #Collab). Klik een tag om alle posts met dezelfde tag te zien. Dit helpt bij zoeken naar specifieke onderwerpen. Veel gestelde tags: #Releases, #Feedback, #Collab, #Question, #Showcase. / 🏷️ At the top of a discussion you see tags (e.g., #Releases, #Feedback, #Collab). Click a tag to see all posts with that tag. Helpful for finding specific topics. Popular tags: #Releases, #Feedback, #Collab, #Question, #Showcase."
        },
        {
            k: ["categorie", "forum", "section", "onderdeel", "afdeling", "browse categories", "forum structure"],
            a: "📂 Het forum is ingedeeld in categorieën zoals 'Releases', 'Feedback', 'Offtopic', 'Support', enz. Klik in het menu op een categorie om al die discussies te zien. Sommige categorieën zijn enkel voor members. Respecteer de categorie-regels! / 📂 The forum is divided into categories like 'Releases', 'Feedback', 'Offtopic', 'Support', etc. Click a category in the menu to see all its discussions. Some are members-only. Respect category rules!"
        },

        // ========== FLARUM: ZOEKEN & NAVIGATIE ==========
        {
            k: ["zoeken", "search", "vinden", "opzoeken", "look for", "find", "search feature"],
            a: "🔍 Klik op de **zoekbalk** bovenaan. Typ een woord, artiestennaam of tag. Je kunt ook filteren op 'Recent', 'Popular', 'Unanswered' voor verschillende sorteerwijzen. / 🔍 Click the **search bar** at the top. Type a word, artist name, or tag. You can also filter by 'Recent', 'Popular', 'Unanswered' for different sorting."
        },
        {
            k: ["recente", "nieuw", "latest", "new posts", "trending", "trending topics", "what's new", "recent posts"],
            a: "📰 Standaard zie je de meest recente posts. Je kunt ook op 'Latest', 'Top', of 'Unanswered' klikken om de volgorde te veranderen. 'Top' toont de populairste posts, 'Unanswered' toont threads die reacties nodig hebben. / 📰 By default you see the most recent posts. You can also click 'Latest', 'Top', or 'Unanswered' to change the sorting. 'Top' shows the most popular posts, 'Unanswered' shows threads that need replies."
        },

        // ========== FLARUM: BEWERKEN & VERWIJDEREN ==========
        {
            k: ["bewerken", "edit", "wijzigen", "update", "aanpassen", "edit post", "change"],
            a: "✏️ Klik op de **...** (drie puntjes) onder je eigen bericht en selecteer 'Edit'. Je hebt meestal ~1 uur tijd om je bericht aan te passen. Moderators kunnen alles altijd bewerken. / ✏️ Click the **...** (three dots) under your own message and select 'Edit'. You usually have ~1 hour to adjust your message. Moderators can always edit everything."
        },
        {
            k: ["verwijderen", "delete", "wissen", "weg", "remove post", "erase"],
            a: "🗑️ Klik de **...** en selecteer 'Delete'. Je eigen berichten kun je meestal zelf verwijderen; moderators kunnen alles verwijderen als het tegen regels is. Verwijderde posts zijn weg! / 🗑️ Click the **...** and select 'Delete'. You can usually delete your own posts; moderators can delete anything that breaks rules. Deleted posts are gone!"
        },

        // ========== FLARUM: VOLGEN & BOOKMARKING ==========
        {
            k: ["volgen", "follow", "gevolgd", "abonneren", "subscription", "subscribe", "watch thread", "follow discussion"],
            a: "⭐ Klik op 'Follow' onder de titel van een discussie. Je krijgt dan notificaties bij nieuwe reacties en je ziet deze discussie in je 'Following' tab. Handig voor threads die je wilt volgen! / ⭐ Click 'Follow' under a discussion title. You'll get notifications for new replies and see it in your 'Following' tab. Great for threads you want to track!"
        },
        {
            k: ["bladwijzer", "bookmark", "saved", "opslaan", "later", "save", "bookmarks", "saved posts"],
            a: "📌 Klik het **bladwijzer-icoontje** (📌) onder een bericht. Dit sla je op in je persoonlijke Saved list (zie je in je profielmenu onder 'Saved'). Handig om interessante posts later terug te vinden! / 📌 Click the **bookmark icon** (📌) under a message. This saves it to your personal Saved list (find it in your profile menu under 'Saved'). Useful for finding interesting posts later!"
        },

        // ========== FLARUM: INBOX & PRIVÉ BERICHTEN ==========
        {
            k: ["inbox", "privé", "bericht", "dm", "direct message", "personal", "mailbox", "pm", "private message", "send message"],
            a: "✉️ Klik op het **envelopje** (✉️) rechtsboven in je navigatie. Daar zie je privé gesprekken met andere leden. Klik op iemands profiel en selecteer 'Send a Message' om een nieuw privé bericht te starten. Privacy gegarandeerd! / ✉️ Click the **envelope** (✉️) in the top right navigation. There you see private conversations with other members. Click on someone's profile and select 'Send a Message' to start a new private message. Privacy guaranteed!"
        },

        // ========== FLARUM: MODERATIE & REGELS ==========
        {
            k: ["report", "rapporteren", "spam", "ongewenst", "regel", "regel breken", "flag", "report post", "break rules"],
            a: "⚠️ Zie je iets ongeldig? Klik op de **...** en selecteer 'Report'. Beschrijf waarom (spam, haatzaai, advertentie, etc.). Moderators zien dit en nemen snel actie. Niet zelf ingrijpen, melding gebruiken! / ⚠️ See something wrong? Click the **...** and select 'Report'. Describe why (spam, hate speech, advertising, etc.). Moderators see this and act quickly. Don't intervene yourself, use reporting!"
        },
        {
            k: ["regels", "rules", "gedrag", "community guidelines", "wat mag", "wat niet", "forbidden", "niet toegestaan"],
            a: "📋 Chatsong-regels: ✅ Wees respectvol. ✅ Geen spam/advertentie buiten je posts. ✅ Zet 150+ tekens bij releases. ✅ Geef feedback. ❌ Geen haatzaai/pesten. ❌ Geen bare links. ❌ Geen verkoop buiten Chatsong. Moderators handhaven dit. / 📋 Chatsong rules: ✅ Be respectful. ✅ No spam/ads outside posts. ✅ Add 150+ characters to releases. ✅ Give feedback. ❌ No hate speech/bullying. ❌ No bare links. ❌ No selling outside Chatsong. Moderators enforce this."
        },

        // ========== FLARUM: MUTE & BLOCKING ==========
        {
            k: ["mute", "silent", "negeren", "block", "blokkeer", "stil", "ignore user", "block user", "don't see posts"],
            a: "🔇 Klik op iemands **profiel** en selecteer 'Mute' als je hun posts niet meer wilt zien. 'Block' zorgt ervoor dat je elkaar geen privé berichten kunt sturen en je hun content niet ziet. Handig als je iemand niet wilt volgen! / 🔇 Click on someone's **profile** and select 'Mute' if you don't want to see their posts. 'Block' prevents you from PMing each other and hides their content. Useful if you want to avoid someone!"
        },

        // ========== FLARUM: COMPOSER & OPMAKEN ==========
        {
            k: ["composer", "schrijven", "markdown", "opmaak", "vet", "schuin", "link", "formatting", "write message", "format text"],
            a: "✍️ Flarum ondersteunt **Markdown** bij het schrijven: **vet** = `**tekst**`, *schuin* = `*tekst*`, [link](url), > quote. De Flarum-composer helpt met een toolbar en preview. Professioneel schrijven! / ✍️ Flarum supports **Markdown** formatting: **bold** = `**text**`, *italic* = `*text*`, [link](url), > quote. The composer has a toolbar and preview. Write professionally!"
        },
        {
            k: ["afbeelding", "image", "foto", "upload", "plaatje", "insert image", "picture", "embed image"],
            a: "🖼️ Klik op het **foto-icoontje** in de composer en upload van je computer, of plak een image-URL. De afbeelding verschijnt in je bericht. Handig voor visuele posts en album covers! / 🖼️ Click the **image icon** in the composer and upload from your computer or paste an image URL. The image appears in your message. Great for visual posts and album covers!"
        },
        {
            k: ["emoji", "emoticon", "smilie", "😊", "unicode", "insert emoji", "react"],
            a: "😊 Typ `:` en tik dan een woord (bijv. `:smile:` of `:fire:` of `:heart:`). Flarum toont suggesties. Je kunt ook op het emoji-icoontje klikken voor een dropdown. Maak je posts leuker met emojis! / 😊 Type `:` and then a word (e.g., `:smile:` or `:fire:` or `:heart:`). Flarum shows suggestions. You can also click the emoji icon for a dropdown. Make your posts fun with emojis!"
        },

        // ========== FLARUM: DRAFTS & CONCEPTEN ==========
        {
            k: ["draft", "concept", "opslaan", "klad", "save draft", "autosave", "unsent message"],
            a: "💾 Als je halverwege een bericht stopt zonder te posten, slaat Flarum dit automatisch op als Draft. Je kunt dit later hervatten vanuit de composer. Geen verlies van je werk! / 💾 If you stop writing a message without posting, Flarum automatically saves it as a Draft. You can resume it later in the composer. No lost work!"
        },

        // ========== FLARUM: ACCOUNT & INSTELLINGEN ==========
        {
            k: ["instellingen", "settings", "profiel", "account", "preferences", "voorkeur", "change settings", "preferences", "account settings"],
            a: "⚙️ Klik op je **avatar** (profiel pic) rechtsboven, dan 'Settings'. Daar kun je je e-mail, wachtwoord, taal, notificatie-voorkeur, privacy-instellingen en meer aanpassen. Jouw controle, jouw keus! / ⚙️ Click your **avatar** (profile pic) at the top right, then 'Settings'. You can change your email, password, language, notification preferences, privacy settings, and more. Your control, your choice!"
        },
        {
            k: ["bewaking", "notifications", "e-mail", "push", "alert", "meldingen", "notify me", "get notified"],
            a: "🔔 In Settings > Notifications kun je per type bepalen wat je wilt ontvangen: 'Someone mentions you', 'New discussion in favorite tag', 'New reply to your post', 'Someone posts to your guestbook'. In-app, e-mail, of beide! / 🔔 In Settings > Notifications you can choose per type what you want: 'Someone mentions you', 'New discussion in favorite tag', 'New reply to your post', 'Someone posts to your guestbook'. In-app, email, or both!"
        },

        // ========== LIVE MUSIC ROOM & SOUNDBOARD ==========
        {
            k: ["live music room", "chat", "ruimte", "vibe", "mood", "support", "team", "soundboard", "supabase", "embeds", "spotify", "soundcloud", "youtube", "beatport", "mixcloud", "live chat"],
            a: "🎵🔴 Onderaan het scherm zweeft de **Live Music Chatroom** (realtime chat gekoppeld aan Supabase). Hier kun je live chatten, @-vermeldingen gebruiken, en direct muziekspelers embedden (Spotify, SoundCloud, YouTube, Beatport, Mixcloud). Het Soundboard en Vibe Panel zijn ook daar voor mood & support. Waar het gebeurt! / 🎵🔴 The **Live Music Chatroom** floats at the bottom (real-time chat powered by Supabase). Chat live, @-mention others, and embed music players (Spotify, SoundCloud, YouTube, Beatport, Mixcloud). The Soundboard and Vibe Panel are there too. Where the action is!"
        },

        // ========== BONUS: LEADERBOARD & A-Z FILTERBAR ==========
        {
            k: ["leaderboard", "ranglijst", "ranking", "top", "punten", "leaders", "hall of fame", "top contributors"],
            a: "🏆 Het Leaderboard toont de top-contributors van Chatsong, gerangschikt op punten (upvotes). Verzamel punten door goede posts, reacties en feedback. Bekijk wie het meest actief is en inspireer je! Klik op 🏆 in het menu. / 🏆 The Leaderboard shows Chatsong's top contributors, ranked by points (upvotes). Earn points by posting, replying, and giving feedback. See who's most active and get inspired! Click 🏆 in the menu."
        },
        {
            k: ["a-z", "filterbar", "artiestenmap", "filter", "musicians list", "browse musicians", "alphabetical"],
            a: "🎸 De **A-Z Filterbar** in de artiestenmap laat je snel en alfabetisch door alle onafhankelijke musici bladeren. Perfect om nieuwe artiesten te ontdekken! Klik op 🎸 Musicians in het menu. / 🎸 The **A-Z Filterbar** in the musicians directory lets you browse all independent artists alphabetically. Perfect for discovering new artists! Click 🎸 Musicians in the menu."
        },

        // ========== VEILIGHEID & PRIVACY ==========
        {
            k: ["veilig", "veiligheid", "privacy", "echte naam", "pesten", "ouder", "kosten", "geld", "betalen", "gratis", "is it safe", "safe for kids", "bullying"],
            a: "🔒 Chatsong is **100% gratis** en een **veilige community**! Je mag gerust een artiestennaam gebruiken (hoeft niet je echte naam). Moderators zorgen ervoor dat het netjes blijft en pesten niet wordt getolereerd. Je hoeft nooit te betalen. Geschikt voor kinderen met moderatie! / 🔒 Chatsong is **100% free** and a **safe community**! You can use an artist name (no real name needed). Moderators keep things civil and don't tolerate bullying. You never have to pay. Kid-friendly with moderation!"
        },
        {
            k: ["alleen luisteren", "geen muziek", "alleen chatten", "meepraten", "beginner", "goed genoeg", "listen only", "just chat", "i'm new"],
            a: "💬 Iedereen is welkom, of je nu net begint of al jaren muziek maakt! Je hoeft niet per se zelf muziek te uploaden; je kunt ook: 💭 Meepraten en reacties geven, 🎧 Alleen luisteren naar anderen, 🤝 Chatten in de Live Music Room, 🙋 Vragen stellen. Geen drempel! Iedereen kan meedoen! / 💬 Everyone is welcome, whether you just started or make music for years! You don't have to upload your own music; you can also: 💭 Join discussions and give feedback, 🎧 Just listen to others, 🤝 Chat in the Live Music Room, 🙋 Ask questions. No barriers! Everyone can join!"
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

        let bestAns = "Dat is een goede vraag! 🤔 Bekijk de gids op onze website of vraag het in de Live Music Room. Ik ken vragen over profielen, de 150-tekens regel, Flarum features, upvoten, tags, privé berichten, en meer. Probeer het opnieuw! / That's a great question! 🤔 Check out our website guide or ask in the Live Music Room. I know about profiles, the 150-character rule, Flarum features, upvoting, tags, private messages, and more. Try again!";
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