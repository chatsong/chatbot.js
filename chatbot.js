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

    // Flarum + Chatsong forum knowledge base: account, profile, discussion flow, extensions, question & offer flow
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
            k: ["titel", "title", "discussie naam", "goede titel", "hoe noem ik het"],
            a: "📋 Een goede titel is kort, duidelijk en specifiek. Voorbeeld: 'Feedback op mijn nieuwe release - House/Deep' of 'Collab gezocht voor vocal mix'. Vermijd vage titels zoals 'Hoi' of 'Help'."
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
            k: ["categorie", "category", "forum categories", "onderdeel", "section", "releases categorie", "feedback categorie", "support categorie", "collab categorie"],
            a: "📂 De belangrijkste categorieën zijn meestal: Releases, Feedback, Collab, Support, Offtopic en Vraag & Aanbod. Kies de juiste plek zodat je post beter gevonden wordt en de juiste mensen reageren."
        },
        {
            k: ["zoeken", "search", "vinden", "opzoeken", "zoekbalk", "zoek"],
            a: "🔍 Gebruik de zoekbalk bovenin. Zo kun je op artiestnamen, tags, woorden of thema's zoeken. Je kunt ook sorteren op Recent, Top of Unanswered om sneller geschikte discussies te vinden."
        },
        {
            k: ["reageren", "reply", "antwoord", "reactie", "comment", "how to comment", "respond"],
            a: "↩️ Scroll naar beneden in een discussie en klik 'Reply'. Typ je antwoord, en klik vervolgens op 'Post'. Zo reageer je op een topic of op een specifieke reactie."
        },
        {
            k: ["citeren", "quote", "select text", "quoteren", "antwoord aan persoon"],
            a: "📋 Selecteer simpelweg de tekst die je wilt citeren in een post en kies vervolgens 'Quote'. De tekst wordt als quote in je reply geplaatst, handig voor duidelijke feedback of antwoord op iemand."
        },
        {
            k: ["markdown", "opmaak", "bold", "schuin", "italic", "link", "editor", "formatting", "preview"],
            a: "✍️ Flarum gebruikt Markdown. Gebruik **tekst** voor vet, *tekst* voor schuin, ~~tekst~~ voor doorhalen en [link](https://voorbeeld.nl) voor links. De preview-knop laat zien hoe het eruit komt te zien."
        },
        {
            k: ["afbeelding", "image", "foto", "plaatje", "upload image", "picture", "insert image"],
            a: "🖼️ In de editor kun je een afbeelding toevoegen via het foto-icoontje. Upload een bestand van je computer of plak een afbeeldings-URL. Ideaal voor release covers, artwork of screenshots."
        },
        {
            k: ["emoji", "emoticon", "smile", "😊", "insert emoji"],
            a: "😊 Typ : gevolgd door een woord zoals :smile:, :fire:, :heart: of :music:. Flarum geeft suggesties, of je kunt handmatig een emoji invoegen in je tekst."
        },
        {
            k: ["draft", "concept", "klad", "autosave", "save draft", "unsent"],
            a: "💾 Als je halverwege een bericht stopt, slaat Flarum dit vaak automatisch op als concept. Je kunt het later hervatten en verder bewerken zonder je werk kwijt te raken."
        },
        {
            k: ["@", "mention", "taggen", "iemand noemen", "notify persoon", "tag someone", "mention user"],
            a: "🔔 Typ @gebruikersnaam in je post of reactie. De persoon krijgt dan een melding dat je hem of haar genoemd hebt. Dat is handig voor feedback, collabs en direct contact."
        },
        {
            k: ["upvote", "like", "👍", "reaction", "punten", "leaderboard", "score", "vote"],
            a: "👍 Klik op de 👍-knop onder een post. Daarmee geef je punten of waardering en help je de poster zichtbaar te worden. Goede posts krijgen vaak meer aandacht en meer reacties."
        },
        {
            k: ["volgen", "follow", "subscribe", "subscription", "following", "watch thread", "notificatie"],
            a: "⭐ Als je een discussie volgt, krijg je meldingen bij nieuwe reacties. Klik op 'Follow' onder de titel van een topic of ga naar je 'Following' overzicht om alles te bekijken."
        },
        {
            k: ["bookmark", "bladwijzer", "save", "opslaan", "saved", "mark for later"],
            a: "📌 Klik op het bladwijzer-icoontje of bookmark-icoontje onder een post om deze op te slaan. Zo kun je nuttige discussies later snel terugvinden in je profiel."
        },
        {
            k: ["bewerken", "edit", "wijzigen", "aanpassen", "fix typo", "correctie"],
            a: "✏️ Klik op de drie puntjes onder je eigen post en kies 'Edit'. Je hebt meestal een beperkte tijd om het bericht aan te passen. Daarna sla je het op."
        },
        {
            k: ["verwijderen", "delete", "wissen", "remove", "erase post"],
            a: "🗑️ Klik op de drie puntjes onder je eigen post en kies 'Delete' om een bericht te verwijderen. Moderators kunnen ook berichten verwijderen als deze tegen de regels ingaan."
        },
        {
            k: ["rapporteren", "report", "flag", "spam", "rule breaking", "inappropriate", "misbruik"],
            a: "⚠️ Zie je spam, ongepaste inhoud, haat of andere schendingen? Klik op de drie puntjes bij die post en kies 'Report'. Geef kort aan waarom je het rapporteert, zodat moderators kunnen ingrijpen."
        },
        {
            k: ["inbox", "privé bericht", "dm", "direct message", "personal message", "private message"],
            a: "✉️ Klik op het envelopje rechtsboven om je inbox te openen. Daar zie je privé berichten van andere leden. Om iemand een bericht te sturen, open zijn profiel en klik op 'Send Message'."
        },
        {
            k: ["mute", "block", "negeren", "ignore user", "don't see posts", "blokkeer"],
            a: "🔇 Open het profiel van een gebruiker en kies 'Mute' of 'Block'. Mute verbergt hun berichten voor jou, Block voorkomt contact en laat hun content niet meer zien."
        },
        {
            k: ["regels", "rules", "gedrag", "community guidelines", "wat mag", "wat niet", "forbidden", "moderatie"],
            a: "📋 De forumregels zijn meestal: respectvol zijn, geen spam, geen ongepaste links, geen haat, geen misbruik en constructieve feedback geven. Als je twijfelt, lees de regels of vraag een moderator."
        },
        {
            k: ["waarschuwing", "warning", "suspension", "ban", "verbannen", "gestraft"],
            a: "⚠️ Bij ernstige schendingen kunnen waarschuwingen, tijdelijke suspensions of een permanente ban volgen. Moderators proberen de regels eerlijk toe te passen, maar duidelijke schendingen kunnen snel resulteren in actie."
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
        },
        {
            k: ["tips", "tricks", "hacks", "hints", "advice", "succes", "best practices"],
            a: "💡 Tips voor succes: maak duidelijke titels, gebruik relevante tags, geef constructieve feedback, reageer op mensen, en zet duidelijke context in je releases zodat anderen sneller begrijpen waar je aan werkt."
        },
        {
            k: ["title length", "titel lengte", "title length extension", "lange titel", "minimale titel lengte"],
            a: "📏 De Title Length extensie helpt om titels consistent en duidelijk te houden. Zo worden vage of te korte titels beperkt, waardoor discussies beter en overzichtelijker worden."
        },
        {
            k: ["daily check in", "check in", "dagelijkse check in", "zien daily check in", "daily check in extension"],
            a: "✅ De Daily Check In extensie moedigt leden aan om elke dag een check-in te doen. Vaak levert dat beloningen, streaks of extra community-waardering op."
        },
        {
            k: ["money leaderboard", "money leaderboard extension", "leaderboard geld", "leaderboard punten", "ziven money leaderboard"],
            a: "🏆 De Money Leaderboard toont wie de meeste punten of waarde in de community heeft verzameld. Dit werkt vaak samen met upvotes, bijdragen en community-activiteit."
        },
        {
            k: ["money transfer", "geld overmaken", "money transfer extension", "ziven money transfer", "punten overboeken"],
            a: "💸 De Money Transfer extensie maakt het mogelijk om punten, valuta of waardes tussen leden te versturen of te delen. Dit is handig voor community-rewards of kleine interacties binnen het forum."
        },
        {
            k: ["post number", "post nummer", "ziven post number", "nummering van posts", "post count"],
            a: "🔢 De Post Number extensie helpt om posts of bijdragen te nummeren of te categoriseren. Hierdoor is het makkelijker om bijdragevolgorde en activiteit te volgen."
        },
        {
            k: ["custom side nav links", "side nav links", "custom links", "navigatie links", "custom sidebar"],
            a: "🔗 Custom Side Nav Links laat admins extra navigatie-links aan de sidebar toevoegen. Dat is handig voor belangrijke pagina's, support, help, community-links of speciale forumsecties."
        },
        {
            k: ["categories", "categorieën", "forum categories", "cat extension", "ziven categories"],
            a: "🗂️ De Categories extensie helpt om de forumstructuur overzichtelijk te houden. Je krijgt duidelijke groepen zoals Releases, Feedback, Support of Vraag & Aanbod."
        },
        {
            k: ["color circles", "kleurcirkel", "color circles extension", "kleuren rondjes", "avatar circles"],
            a: "🎨 Color Circles gebruikt kleurcodering om leden, groepen of statussen visueel te onderscheiden. Zo is het snel te zien hoe iemand in de community geclassificeerd is."
        },
        {
            k: ["mobile search", "mobiele zoek", "mobile search extension", "zoeken op mobiel"],
            a: "📱 Mobile Search maakt zoeken makkelijker op mobiel. Hierdoor kunnen leden snel op tags, termen, gebruikers of discussies zoeken zonder onnodige scroll-ervaring."
        },
        {
            k: ["subscriptions", "subscripties", "abonnement", "followers", "subscribers"],
            a: "⭐ Subscriptions maakt het mogelijk om onderwerpen of creators te volgen. Je ontvangt meldingen bij nieuwe updates en kunt zo belangrijke gesprekken in de gaten houden."
        },
        {
            k: ["suspend", "suspension", "geblokkeerd", "tijdelijk offline", "opgeschort"],
            a: "⏳ De Suspend extensie geeft moderators de mogelijkheid om een gebruiker tijdelijk te beperken. Dit kan gebeuren bij overtreding van regels of om escalatie te voorkomen."
        },
        {
            k: ["tags extension", "tag extensie", "tags plugin", "tag management"],
            a: "🏷️ De Tags extensie maakt thema- en filtertags mogelijk. Zo kunnen leden snel posts vinden op basis van onderwerp, stijl, type of samenwerking."
        },
        {
            k: ["threadify", "threadify extension", "threads", "discussie stijl", "thread instellingen"],
            a: "🧵 Threadify verbetert de manier waarop discussies worden weergegeven. Het houdt gesprekken overzichtelijk, leesbaar en gebruiksvriendelijk voor bezoekers en moderators."
        },
        {
            k: ["spam prevention", "spam preventie", "spam protection", "spam checker", "anti spam"],
            a: "🛡️ Spam Prevention helpt ongewenste of repetitieve inhoud te blokkeren. Daardoor blijven de forumdiscussies overzichtelijk, veilig en relevant voor de community."
        },
        {
            k: ["staff badge", "staff badge extension", "moderator badge", "medewerker badge", "team badge"],
            a: "👑 Staff Badge laat teamleden of moderators duidelijke badges zien. Zo is direct te herkennen wie de community ondersteunt en de regels bewaakt."
        },
        {
            k: ["statistics", "statistieken", "forum stats", "stats", "gebruikersstatistieken"],
            a: "📊 Statistics geeft een overzicht van activiteit, gebruikers, posts en trends. Dit helpt moderators en leden om te zien hoe actief het forum is."
        },
        {
            k: ["status", "user status", "online status", "status indicator", "member status"],
            a: "🟢 Status laat zien of iemand online, offline of actief is. Zo is het makkelijker om te zien wie aanwezig is in de community en wie beschikbaar is voor contact."
        },
        {
            k: ["stickies", "sticky", "vastgezette berichten", "sticky posts", "sticky threads"],
            a: "📌 Stickies zijn vaste berichten die bovenaan blijven staan. Dit is handig voor regels, belangrijke updates, aankondigingen of informatie die iedereen moet zien."
        },
        {
            k: ["sort order toggle", "sort order", "sorteervolgorde", "toggle sort", "order toggle"],
            a: "🔄 Sort Order Toggle laat leden kiezen hoe discussies worden gesorteerd, bijvoorbeeld op nieuwste, meest populair of onbeantwoord. Zo kunnen ze sneller het juiste onderdeel vinden."
        },
        {
            k: ["spam alert", "spam waarschuwing", "spam warning", "alert", "waarschuwing spam"],
            a: "🚨 Spam Alert waarschuwt moderators of admins als verdachte of ongewenste inhoud wordt gedetecteerd. Zo kan de community sneller beschermd worden tegen misbruik."
        },
        {
            k: ["hoe help ik", "hulp", "support", "probleem", "wat moet ik doen", "ik weet niet hoe"],
            a: "🆘 Je hoeft niet alles zelf te weten. Vraag in de juiste categorie, zoek op tags, lees de regels, of gebruik deze chatbot. Veel problemen zijn standaard: account, profiel, post maken, tags, upvoten, reageren en support."
        },
        {
            k: ["vraag en aanbod forum", "vraag en aanbod categorie", "waar plaats ik aanbod", "waar plaats ik vraag", "ik wil iets vragen"],
            a: "🧾 Gebruik de categorie Vraag & Aanbod. Plaats daar een duidelijke titel, vertel wat je zoekt of aanbiedt, en voeg relevante tags toe zoals #Collab #Service #Feedback. Dan zien de juiste mensen het sneller."
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
        const text = input.value.trim();
        if (!text) return;

        messages.innerHTML += `<div class="u-msg">${escapeHtml(text)}</div>`;
        input.value = '';

        let bestAns = "Dat is een goede vraag! 🤔 Probeer vragen over: account/login, profiel, forum basics, tags, reacties, upvoten, regels, vraag & aanbod, of een specifieke Flarum extensie. / That's a good question! 🤔 Try asking about account/login, profile, forum basics, tags, replies, upvotes, rules, question & offer, or a specific Flarum extension.";
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
