# Sven Maibaum Website – Spezifikation

## Zweck und Geltung

Diese Datei hält die gemeinsam festgelegten Vorgaben für die persönliche Website von
Sven Maibaum unter `sven-maibaum.com` fest: was die Website erreichen soll, welche
Grundsatzentscheidungen gelten und wie Agenten an ihr arbeiten. Sie ist die
verbindliche Grundlage für alle Arbeiten an der Website.

Alle am Projekt arbeitenden Agenten lesen diese Datei vor Projektarbeiten und richten
ihre Arbeit an den für die jeweilige Aufgabe relevanten Vorgaben aus. Die `AGENTS.md`
und die `CLAUDE.md` verweisen auf diese gemeinsame Grundlage. Sie ersetzt die frühere
`CLAUDE.md` und die Planungsdateien unter `.planning/`; deren gültiger Inhalt steht
jetzt hier.

Neue Vorgaben werden hier schrittweise ergänzt. Vom Projektverantwortlichen
formulierte Punkte werden in seinem Wortlaut festgehalten. Projektverantwortlicher
ist Sven Maibaum; er trifft die Entscheidungen zur Website. Agenten passen diese
Datei nicht selbstständig an ihre Umsetzung an. Widerspricht eine Aufgabe dieser
Datei, benenne den Widerspruch und hole die Entscheidung ein.

Punkte mit dem Zusatz *(Vorschlag)* hat ein Agent formuliert; sie gelten erst, wenn
der Projektverantwortliche sie bestätigt hat. Bis dahin baut kein Agent auf ihnen
auf, ohne das im Arbeitsbericht zu nennen.

Das Repository ist öffentlich. Alles, was hier eingecheckt wird, kann jeder lesen;
die Folgen regelt der Abschnitt „Feste Projektentscheidungen“.

## Wahrheit vor Wirkung

Die Website soll Aufträge bringen, und Auftraggeber prüfen, was dort steht. Eine
erfundene oder veraltete Angabe kostet Vertrauen und kann im Impressum oder in der
Datenschutzerklärung rechtliche Folgen haben. Diese Regel steht über allen anderen
Vorgaben dieser Datei. Bestätigt vom Projektverantwortlichen am 16.10.2026: „Regel 6
passt auf jeden Fall schon mal.“

- **Quellen:** Angaben über Sven Maibaum, MAY STUDIOS, die Sentrix Code GmbH,
  Projekte, Arbeitgeber, Kunden und Ergebnisse stammen ausschließlich aus dieser
  Datei, aus ausdrücklicher Angabe des Projektverantwortlichen oder aus einer
  gespeicherten, benannten Quelle. Erfinde keine Namen, Zahlen, Kunden, Zitate, Auszeichnungen,
  Versionen oder Ergebnisse, auch nicht als „realistischen Platzhalter“.
- **Auch beim Entwickeln:** Anders als bei der Sentrix-Website gibt es keine
  Ausnahme für erfundene Beispielinhalte während der Entwicklung, weil jeder Push auf
  `main` sofort veröffentlicht wird.
- **Fehlende Angaben:** Fehlt eine Angabe, steht im Code ein deutlich sichtbarer
  Platzhalter in der Form `[OFFEN: …]`, und der Punkt kommt in die Liste „Offene
  Punkte“. Ein Platzhalter geht nicht auf `main`; der betroffene Inhalt bleibt bis
  dahin weg.
- **Messung und Deutung:** Gemessenes und Gedeutetes bleiben getrennt. Eine Deutung
  wird als solche gekennzeichnet, mit dem, der sie getroffen hat.
- **Ungeprüftes:** Was nicht geprüft wurde, wird als ungeprüft gemeldet;
  Übersprungenes als übersprungen. Ermittle Versionen, Zustände und Ergebnisse,
  statt sie anzunehmen.
- **Kundenprojekte:** Kundenprojekte und Arbeiten für Arbeitgeber erscheinen nur mit
  Freigabe des Projektverantwortlichen. Was unter einer Geheimhaltungsvereinbarung steht,
  erscheint ohne schriftliche Freigabe nie, auch nicht anonymisiert.
- **KI-Personen:** KI-generierte Personen stellen nie Sven, Kunden, Kollegen oder
  Bewertungen dar.

Warnbeispiel aus diesem Projekt, Stand 16.10.2026: Auf der veröffentlichten Website
standen Platzhalterbilder von `placehold.co` (Exambyte), der Satz „Die hier
verlinkten Steam-Thumbnails sind Platzhalter zum Testen.“ (HeistLine), ein
Discord-Link ohne Einladungscode, „über 6 Jahren Erfahrung“ neben einem Beginn im
Juni 2023 und in der Datenschutzerklärung „[Straße Hausnummer]“ und „Telefon:
[Telefonnummer]“. Im Impressum stand die Anschrift falsch geschrieben
(„Schmitd“). Solche Stände kommen nicht wieder auf `main`.

## Kein KI-Look

Der Projektverantwortliche am 16.10.2026: „Also irgendwie, jetzt gerade wirkt die
Seite auch immer noch sehr, sehr stark für mich als KI generiert und irgendwas muss
da halt her, dass das nicht mehr so wirkt.“

Die Website darf nicht nach einer generierten Standardseite aussehen oder klingen.
Grundlage ist die Recherche mit 54 Mustern aus 15 Quellen, die für die Sentrix-Website
am 09.10.2026 erstellt wurde (siehe „Grundlage und Einordnung“). Die folgenden Verbote
sind daraus für diese Website abgeleitet *(Vorschlag)*. Prüfe jede neue Seite, jeden
Abschnitt und jeden Text dagegen.

### Was heute danach aussieht

Gelesen aus dem Code am 16.10.2026; ob es generiert wirkt, beurteilt der
Projektverantwortliche:

- Großbuchstaben-Labels über fast jeder Überschrift (`SectionHeading` mit `eyebrow`
  in sechs Abschnitten, Klasse `.swiss-eyebrow`).
- Ein Hero mit dem Label „Portfolio“, dem Namen als Überschrift und wechselnden
  Wörtern hinter „Experte für“ (`FlipWords`).
- Dieselbe Einblendung `.fade-in-up` für alle Abschnitte, gesteuert aus
  `src/components/Layout.tsx`.
- Dunkler Hintergrund mit genau einem hellen Blau als Akzent (`#3b82f6`) und
  animierten Rasterlinien im Hero.

### Gestaltung

- Keine Standard-Seitenfolge aus zentriertem Hero, drei gleichen Karten,
  Testimonial und CTA. Jeder Abschnitt hat eine Form, die aus seinem Inhalt folgt.
- Keine Reihe identischer Karten mit Icon, Zwei-Wort-Titel und Allerweltssatz.
- Keine Großbuchstaben-Labels über jeder Überschrift, keine Meta-Zeilen der Form
  „A · B · C“, keine Nummern wie „01“ vor Inhalten ohne Reihenfolge.
- Keine lila-blauen Verläufe, keine Glow-Flecken als Deko, kein Glassmorphism
  ohne Funktion, kein einzelnes eingefärbtes Akzentwort in Überschriften.
- Keine Count-up-Zähler und keine großen Zahlen mit kleinem Label als Beweis.
- Nicht jeder Abschnitt blendet gleich ein; Bewegung regelt der Abschnitt
  „Bewegung“.
- Kein Pfeil an jedem Button. Pfeile stehen nur an Links, die weiterführen.

### Text

- Konkrete Aussagen statt Kategorie-Headlines wie „Experte für …“ oder „Ich baue
  skalierbare Systeme“. Was Sven gebaut hat, zeigt das Projekt; die Überschrift
  behauptet es nicht.
- Keine Dreiklang-Slogans und keine Floskeln oder Verstärker; die Liste im Abschnitt
  „Inhalte und Texte“ gilt.
- Keine Listen mit fettem Stichwort und Doppelpunkt auf der Website und keine Emoji
  als Gliederung. Fließtext erklärt, Listen zählen nur echte Aufzählungen auf.
- Englische Texte folgen denselben Regeln; Überschriften im Satzbau, nicht im
  Title Case.

### Bilder

- Echte Screenshots, Videos und Fotos der eigenen Arbeit gehen vor generierten
  Bildern. Generierte Bilder folgen einem durchgehenden Stil.
- Keine generischen 3D-Blobs, keine Plastik-Illustrationen, keine Stock-Menschen,
  keine Schrift und keine Fantasielogos im Bild, keine gemischten Icon-Familien.
- Eine eigene, bewegte 3D-Szene mit einer Aufgabe ist erlaubt, etwa die Szene zur
  Projektgröße im Kontaktformular. Eigen wirkt sie durch präzise und physikalisch
  stimmige Details, das Blau der Website als einzigen Akzent, keine Menschen und
  keinen Text im Bild. Vorlagen dienen nur als Stilvorbild. Diese Ausnahme haben die
  Agenten am 16.10.2026 festgelegt, nachdem der Projektverantwortliche die
  Entscheidung übertragen hatte: „Entscheide selbst“.

### Grundlage und Einordnung

Geprüft am 09.10.2026 für die Sentrix-Website, übernommen am 16.10.2026:
[`docs/reference/ai-slop.md` im Repository `maystudios/sentrix-code-website`](https://github.com/maystudios/sentrix-code-website/blob/main/docs/reference/ai-slop.md)
mit Quellen wie [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
und Anthropics [frontend-design-Skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md).
Die Quellen beschreiben verbreitete Muster; dass ein Muster auf dieser Website
generiert wirkt, ist eine Einschätzung, keine Messung.

## Ziel

### Im Wortlaut

Der Projektverantwortliche am 16.10.2026 hat als Ziele „Aufträge gewinnen“, „Eigene
Produkte zeigen“ und „Persönliche Marke“ gewählt und ergänzt:

> „Also trotzdem von Arbeit überzeugen und Erfahrung und so, aber halt mehr für
> Aufträge gewinnen.“

Zu den Auftraggebern:

> „Hier möchten wir wirklich am Ende beides wahrscheinlich haben. Das heißt, dass wir
> vielleicht, müssen wir überlegen, wie die Aufteilung ist. Das wird dann, glaube
> ich, eher dynamisch entschieden, wo was hinfällt in dem Moment. Aber ich habe an
> sich halt beide Firmen. So, Zielgruppe ist an sich auch wieder so ein bisschen
> alles. Deswegen ist das auch so eine Unterteilung, dass vielleicht ganz, ganz kleine
> Projekte über May Studios einfach laufen und größere quasi für Mittelstand, Studios
> und so weiter eher über [Sentrix] Code GmbH.“

Daraus folgt: Erfolg der Website sind ernsthafte Anfragen für Entwicklungsaufträge.
Daneben führt sie Besucher zu den eigenen Produkten in den Stores und zu den Kanälen
der persönlichen Marke. Erfahrung und Arbeitsproben bleiben sichtbar, weil sie die
Anfrage begründen.

### Wer hinter der Website steht

| Angabe | Stand | Quelle |
| --- | --- | --- |
| Name | Sven Maibaum (Sven Fredrik Maibaum) | Impressum, Sentrix-Spezifikation |
| Betreiber der Website | Sven Maibaum, MAY STUDIOS (Einzelunternehmen) | `src/pages/Impressum.tsx` |
| Anschrift | Bürgermeister-Schmidt-Str. 72B, 51399 Burscheid | Impressum; Schreibweise bestätigt am 16.10.2026 |
| E-Mail | `contact@sven-maibaum.com`, geschäftlich `company@maystudios.net` | Impressum |
| Umsatzsteuer-Identifikationsnummer | DE362434207 | Impressum |
| Sentrix Code GmbH i. G. | Geschäftsführer Luca Finn Wiegand und Sven Fredrik Maibaum; Eintragung ins Handelsregister stand am 09.10.2026 aus | `C:\Development\Sentrix Code Website\WEBSITE.md` |
| Rolle bei Sentrix Code | CTO, arbeitet über die GmbH: „Wo ich jetzt halt Chief Technical Officer bin, also quasi der CTO.“ | Projektverantwortlicher, 16.10.2026 |
| Programmiererfahrung | „Ich programmiere an sich, seitdem ich 11 bin. Das heißt, über 10 Jahre Programmiererfahrung und so weiter.“ | Projektverantwortlicher, 16.10.2026 |
| Werdegang und aktuelle Positionen | [OFFEN: Positionen bei LikeTik und Emotions Gaming, MayStudios seit Juni 2023 und Studium an der Heinrich-Heine-Universität bestätigen] Der Projektverantwortliche am 16.10.2026: „Die Fakten stimmen nicht mehr unbedingt.“ | `src/sections/About.tsx`, `src/sections/Experience.tsx` |

### Rahmen

- **Auftraggeber:** Beide Firmen, Aufteilung im Einzelfall. Ganz kleine Projekte
  laufen über MAY STUDIOS, größere für Mittelstand, Studios und ähnliche Kunden über
  die Sentrix Code GmbH.
- **Darstellung der Aufteilung:** Die Website nennt beide Firmen und sagt in einem
  Satz, wofür welche steht. Es gibt einen Kontaktweg; der Projektverantwortliche
  ordnet jede Anfrage selbst zu. Die Sentrix Code GmbH wird mit einem Link auf ihre
  eigene Website vorgestellt, deren Rechtstexte dort stehen *(Vorschlag)*.
- **Leistungen:** Spieleentwicklung mit der Unreal Engine, Software- und
  Web-Entwicklung, App-Entwicklung, KI und Tooling, abgeleitet aus den heutigen
  Inhalten *(Vorschlag)*. Welche Leistung welcher Firma zugeordnet ist, ist offen.
- **Haltung hinter den Leistungen:** Im Wortlaut des Projektverantwortlichen am
  16.10.2026: „dass wir Code bauen oder dass wir verlässliche Infrastruktur bauen,
  KI-nativ einsetzen, AI-native arbeiten, also dementsprechend für quasi bestes
  Preis-Leistungs-Verhältnis mit höchster Iterationsgeschwindigkeit, die man
  erreichen kann.“ Auf der Website wird das als Arbeitsweise beschrieben, die man
  nachprüfen kann; ein Superlativ wie „bestes Preis-Leistungs-Verhältnis“ steht dort
  nur mit Beleg *(Vorschlag)*. Formulierungen für Leistungen und Hero erarbeiten
  Agenten als Vorschläge, der Projektverantwortliche wählt.
- **Eigene Produkte:** Spiele auf Steam und Google Play, Apps, Plugins im Fab Store,
  Werkzeuge wie maxsimcli und cc-templates. Gekauft wird im jeweiligen Store, nie
  auf der Website.
- **Persönliche Marke:** Die Links-Seite `/links` bündelt TikTok, YouTube und
  Instagram; die Visitenkarte `/visitenkarte` dient zum Teilen und Abspeichern.
- **Sprachen:** Deutsch und Englisch. Im Wortlaut: „Die Sprache ist auf jeden Fall
  Deutsch-Englisch.“ und „Englische Fassung sollte auf jeden Fall funktionieren. Mit
  Sprachumschaltung und Co.“ (16.10.2026)
- **Geräte:** Mobil zuerst, gestaltet und geprüft von 320 px bis 1440 px Breite.

### Prinzipien

Die Prinzipien stehen in ihrer Rangfolge. Widersprechen sich zwei, entscheidet das
höhere. Wortlaut und Rangfolge hat der Projektverantwortliche am 16.10.2026
bestätigt („Punkt 7 passt auch“); die Folgen unter „Deshalb“ und „Deshalb nicht“
sind *(Vorschlag)*.

1. **Jede Seite führt zu einer Anfrage:** Wer die Seite liest, findet ohne Suchen
   den Weg zum Kontakt. Deshalb hat jede Seite einen sichtbaren Kontaktweg, und
   Produktseiten führen zusätzlich in den Store. Deshalb nicht: Sackgassen,
   Kontakt nur im Fuß der Seite, ein Formular, das nicht abschickt.
2. **Echte Arbeit zeigen:** Jede Aussage über Können ist belegt, etwa durch
   Store-Links, Screenshots, Videos oder Quellcode. Im Wortlaut: „An sich können wir
   aber auch vielleicht ein, zwei Sachen hinschreiben, die wir vielleicht ohne Link
   belegen, weil wir vielleicht nicht überall immer direkt einen Link verwenden
   dürfen oder halt sonstiges dazu gebaut haben.“ Deshalb sind Belege ohne Link
   erlaubt, wenn die Angabe wahr und vom Projektverantwortlichen freigegeben ist.
   Deshalb nicht: Selbstlob ohne Beleg wie „Experte für“, Platzhalterbilder.
3. **Schnell und für alle bedienbar:** Die Seiten erfüllen die Werte im Abschnitt
   „Performance, SEO und Barrierefreiheit“. Deshalb wird jede Änderung an Bildern,
   Schriften und Animationen gemessen. Deshalb nicht: ein Effekt, der die Grenzwerte
   reißt oder ohne Tastatur nicht bedienbar ist.
4. **Lebendige Bewegung, die das Lesen nie stört:** Bewegung macht die Seite
   hochwertig und lebendig. Deshalb hat jede Bewegung einen Anlass, etwa Rückmeldung,
   Orientierung oder einen Moment im Hero. Deshalb nicht: Text, der erst nach der
   Animation lesbar ist, und Scroll-Hijacking.

Jedes neue Feature nennt vor der Umsetzung das Prinzip, dem es dient. Dient es
keinem, wird es nicht umgesetzt oder zurückgestellt.

### Abgrenzung

- **Kein Shop:** Die Website schließt keine Verträge und verkauft nichts. Verkauft
  wird auf Steam, Google Play und Fab. So bleiben die Hosting-Bedingungen von GitHub
  Pages erfüllt, und das Barrierefreiheitsstärkungsgesetz greift nicht (siehe
  „Rechtliches“) *(Vorschlag)*.
- **Kein Server:** Die Website ist statisch. Formulare laufen über einen externen
  Dienst, Benutzerkonten gibt es nicht.
- **Kein Blog und keine Neuigkeiten ohne Entscheidung:** Ein redaktioneller Bereich
  kann zusätzliche Pflichten nach § 18 Abs. 2 Medienstaatsvertrag auslösen
  *(Vorschlag)*.
- **Keine Werbung:** Keine Werbe-Pixel und kein Retargeting; Analyse dient nur dem
  Verständnis der eigenen Website, wie im Abschnitt „Analyse und Einwilligung“
  beschrieben *(Vorschlag)*.

## Feste Projektentscheidungen

Die folgenden Grundsatzentscheidungen bilden den festen Rahmen für die Website. Sie
gelten für jede Aufgabe und werden nur auf ausdrückliche Entscheidung des
Projektverantwortlichen geändert. Stößt eine Aufgabe an eine dieser Grenzen, benenne
den Konflikt und hole die Entscheidung ein. Umgehe eine Festlegung nicht
stillschweigend, schwäche sie nicht ab und ersetze sie nicht durch eine
Ausweichlösung, die ihren Zweck aushebelt.

- **Framework:** Vite, React und TypeScript im Strict-Modus als Single-Page-App mit
  React Router. Nach dem Build erzeugt `scripts/prerender.mjs` für jede Route eine
  eigene `index.html` mit Titel, Beschreibung, Open Graph und Twitter Card. Der
  Projektverantwortliche hat am 16.10.2026 „Technik bleibt“ gewählt: kein Wechsel zu
  Next.js, Astro oder einem anderen Framework und keine neue Hauptversion von Vite,
  React oder Tailwind ohne seine Entscheidung.
- **Styling:** Tailwind CSS 3 mit Design-Tokens in `tailwind.config.js` und
  CSS-Variablen (`--sw-*`) in `src/index.css`. Hell- und Dunkelmodus über das
  Attribut `data-theme` an `<html>`.
- **Bewegung:** Motion (`motion`, Import aus `"motion/react"`).
- **Hosting:** GitHub Pages, gebaut und veröffentlicht über GitHub Actions
  (`.github/workflows/deploy.yml`) bei jedem Push auf `main`. Domain
  `sven-maibaum.com`; `www.sven-maibaum.com` leitet dorthin um.
- **Kontaktformular:** EmailJS (`@emailjs/browser`). Die Werte stehen als
  `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` und `VITE_EMAILJS_PUBLIC_KEY`
  in der lokalen `.env`.
- **Repository:** `maystudios/sven-maibaum-website`, öffentlich. Deshalb gelangen
  keine Zugangsdaten, Schlüssel, `.env`-Dateien, internen Dokumente, Kunden- oder
  Vertragsdaten ins Repository. Prüf- und Laufartefakte liegen unter
  `.harness/runs/` und werden nicht eingecheckt.
- **Versionsverwaltung:** Git mit dem Hauptzweig `main`. Regel des
  Projektverantwortlichen seit dem 25.02.2026: „Nach jeder Änderung immer committen
  und pushen (kein explizites OK nötig)“, am 16.10.2026 bestätigt: „ansonsten darfst
  du immer pushen“. Weil jeder Push auf `main` sofort veröffentlicht wird, baut
  `main` immer und ist jederzeit vorzeigbar; gepusht wird nur Geprüftes. Fasse Arbeit
  in kleine, in sich geschlossene Commits mit verständlicher Beschreibung. Agenten
  committen und pushen mit dem GitHub-Konto, das auf dem jeweiligen Rechner
  angemeldet ist. Sie melden sich nicht als anderer Benutzer an und verändern keine
  Zugangsdaten.
- **Sprachen:** Deutsch und Englisch, festgelegt am 16.10.2026. Deutsch unter `/`,
  Englisch unter `/en/`, jede Seite kennt ihr Gegenstück, der Prerender erzeugt beide
  Sprachen *(Vorschlag)*.
- **Bauen bei der ersten Nutzung:** Stufen und Werkzeuge entstehen, wenn sie zum
  ersten Mal wirklich gebraucht werden, nicht auf Vorrat.

Festgelegt vom Projektverantwortlichen am 16.10.2026. Lokal installiert war an diesem
Tag nichts; `package-lock.json` legt fest: Vite 7.3.1, React 19.2.4, React Router DOM
7.13.0, TypeScript 5.9.3, Tailwind CSS 3.4.17, Motion 12.34.3 und
`@emailjs/browser` 4.4.1. GitHub Actions baut mit Node 20 (`deploy.yml`).

## Seitenstruktur

| Seite | Pfad | Stand |
| --- | --- | --- |
| Startseite | `/` | Abschnitte Hero, Über mich, Philosophie, Erfahrung, Projekte, Publikationen, Skills, Kontakt (`src/pages/Home.tsx`); neu ein Abschnitt Leistungen nach dem Hero *(Vorschlag)* |
| Projektseiten | `/projekte/<name>` | heistline, mr-dork-3, mobile-games, app-entwicklung, liketik, exambyte, itchio, maxsimcli, cc-templates, fab-store; alte Pfade einzelner Mobile Games leiten weiter |
| Social Links | `/links` | eigenständige Seite ohne Kopf- und Fußzeile, seit 08.10.2026 |
| Visitenkarte | `/visitenkarte` | bleibt, `noindex` |
| Architect Showcase | `/showcase` | entfällt |
| AGB | `/agb` | entfällt |
| Impressum, Datenschutz | `/impressum`, `/datenschutz` | Pflichtseiten |
| 404 | alle übrigen Pfade | `src/pages/NotFound.tsx` |

Im Wortlaut des Projektverantwortlichen am 16.10.2026: „Also dieser
Architektur-Showcase kann weg. Die AGBs können weg. Die Visitenkarte kann, glaube
ich, erstmal bleiben. Das ist so eine Seite, die habe ich einfach, damit ich die
Leuten sharen kann und die sich abspeichern können.“ Und: „Genauso was wie
Philosophie kann bleiben, Publikation kann auch bleiben, das ist eigentlich ganz
gut.“

Exambyte ist nicht mehr unter den wichtigsten Projekten, bleibt aber auf der Website
und darf ausführlicher werden. Im Wortlaut: „Ich habe auch immer noch die
exambyte.de-Domain, wir können das Projekt auch noch einfach mal fertig bringen und
auch online vielleicht dauerhaft stellen, dass man das Ganze testen kann. In so einem
Sandbox-Mode.“ Das ist ein eigenes Projekt außerhalb dieser Website; sie verlinkt
darauf, sobald es online ist.

- Eine neue Route steht gleichzeitig in `src/App.tsx`, in `scripts/prerender.mjs` und
  in `public/sitemap.xml`, bis diese drei aus einer Quelle erzeugt werden (siehe
  „Kleine Verantwortlichkeiten und begründete Abstraktionen“).
- Projektinhalte stehen in `src/data/` (`projects.ts`, `mobileGames.ts`,
  `appProjects.ts`, `publications.ts`); Seiten lesen sie von dort.
- Eine neue Projektseite entsteht so: Eintrag in `src/data/projects.ts` (`route` für
  eigene Seiten, `link` für externe Ziele), Seite unter `src/pages/projects/` mit
  `ProjectShell`, Route in `src/App.tsx`, Eintrag mit Titel, Beschreibung und Bild in
  `scripts/prerender.mjs` und in `public/sitemap.xml`, beides auch für die englische
  Fassung.

### Kontaktformular

Das Formular fragt zusätzlich nach Projektart und Projektgröße. Die Größe wählt ein
Schieberegler mit fünf Stufen. Im Wortlaut des Projektverantwortlichen am
16.10.2026: „So Projektgröße kann man so gern so einen Slider machen, Mini-Projekt,
Großprojekt, ne? Was weiß ich, wie dieser Slider, den man zum Beispiel von entweder
Claude Code kennt oder auch von Codex, ne? Der dann quasi so von Light, auf Ultra
hochgeht und Ultra dann so einen Effekt und so weiter“ und „dass wir zum Beispiel
Low machen, dass es gelb, Medium grün, High, das ist so ein cyan-lila-farbenes Ding,
X-High hat so einen, also extra hoch haben wir dann noch, es hat so einen
lila-Glow-Effekt, der immer von links nach rechts rüberläuft und Max, das ist so ein
Rainbow-Effekt, der von links nach rechts rüberläuft.“

| Stufe | Farbe und Effekt |
| --- | --- |
| Mini *(Vorschlag)* | Gelb |
| Klein *(Vorschlag)* | Grün |
| Mittel *(Vorschlag)* | Cyan bis Lila |
| Groß *(Vorschlag)* | Lila mit Glow, der dauerhaft von links nach rechts läuft |
| Maximal *(Vorschlag)* | Regenbogenverlauf, der dauerhaft von links nach rechts läuft |

- Der Glow und der Regenbogen sind eine bewusste Ausnahme vom Abschnitt „Kein
  KI-Look“, weil sie hier eine Rückmeldung auf die Eingabe sind und keine Deko.
- Der Regler ist eine eigene Umsetzung; aus Claude Code oder Codex wird nur die Idee
  übernommen, kein Code und keine Grafik *(Vorschlag)*.
- Er ist per Tastatur bedienbar, hat passende ARIA-Angaben und mindestens 44 × 44 px
  Trefferfläche. Bei reduzierter Bewegung laufen Glow und Regenbogen nicht.
- Die Stufe hilft bei der Zuordnung zu MAY STUDIOS oder Sentrix Code; entschieden
  wird im Einzelfall, wie im Abschnitt „Ziel“ beschrieben.

Neben dem Regler zeigt eine 3D-Szene, was die gewählte Größe bedeutet. Im Wortlaut
des Projektverantwortlichen am 16.10.2026: „Und vielleicht rechts oder so daneben
was, so welche Größe in dem Moment immer bedeutet, wenn man live umswitcht“ und „Dass
der Slider noch ein bisschen mehr macht und auch direkt zeigt, was man da sich
darunter vorstellen kann.“ Zum Stil: „So ein wirklich High-Fidelity-Bild, so eine
hohe Infrastruktur, eine geile 3D-Visualisierung, wirklich so ein bisschen
Real-Life-mäßig, Datencenter, die sich miteinander verbinden“ und „Das Ganze soll
quasi so aus dem Boden growen, dann vielleicht aus den anderen Sachen rausgrowen,
als würde es expandieren und Co., so wirklich Mikro-Animationen, Motion Graphics auf
höchstem Triple-A-Niveau.“ Und: „Entscheide selbst und bau das Ganze super logisch,
also keine physikalischen Fehler, Windrad in Strommast oder Straße ohne Kreuzung
kreuzt sich und so.“

- **Inhalt:** Eine Landschaft aus Rechenzentren wächst Stufe für Stufe, von einem
  kleinen Gebäude bei Mini bis zu mehreren verbundenen Standorten mit Umspannwerk,
  Strommasten, Windrädern und blau leuchtenden Datenleitungen bei Maximal *(Vorschlag)*.
- **Logik:** Die Szene ist aufgebaut wie ein echter Lageplan. Straßen kreuzen sich
  nur an Kreuzungen, Leitungen verbinden Masten und Umspannwerke, Rotoren haben
  Abstand zu allem, nichts schwebt oder durchdringt etwas. Was wächst, wächst in
  sinnvoller Reihenfolge: erst die Straße und der Strom, dann das Gebäude. Ein
  Prüfskript weist das nach, bevor eine Fassung auf die Website kommt *(Vorschlag)*.
- **Technik:** Die Szene wird in Blender aus einem Skript erzeugt und vorgerendert;
  der Regler spult die Bildfolge vor und zurück. Nach Einschätzung der Agenten
  erreicht Three.js in Echtzeit diese Bildqualität auf Mobilgeräten nicht; ob die
  vorgerenderte Fassung Qualität und Ladezeit besser erreicht, ist noch ungeprüft und
  wird mit dem Stiltest vom 16.10.2026 geprüft. Die Bildfolge lädt erst in der Nähe
  des Kontaktbereichs. Bei reduzierter Bewegung zeigt sie je Stufe ein Standbild
  *(Vorschlag)*.
- **Hell und dunkel:** Je eine Fassung für den Dunkel- und den Hellmodus, in Graphit
  mit leuchtendem Blau und in hellem Ton. Festgelegt von den Agenten nach der
  Übertragung am 16.10.2026.
- **Texte:** Je Stufe eine Zeile mit typischen Beispielen, ohne fremde Markennamen
  und ohne die Behauptung, Sven habe ein solches System gebaut *(Vorschlag)*.

## Design-System

Im Wortlaut des Projektverantwortlichen am 16.10.2026: „Aufbau bleibt, stark
verfeinern und motion graphic und co!“ und „Wir möchten an sich auf jeden Fall ein
hochwertiges, präzises Design haben.“

Aufbau und Reihenfolge der Startseite bleiben; verfeinert werden Typografie,
Abstände, Bilder, Zustände und Bewegung. Komponenten verwenden ausschließlich die
Tokens; ein neuer Wert wird erst hier ergänzt und dann verwendet.

Weiter im Wortlaut: „grundsätzlich gesehen bleibt dieser dunkle Swiss-Style auch mit
den Akzenten, den wir jetzt gerade haben“ und „hier wäre auch so ein Editorial Design
oder Editorial mehr zu arbeiten interessant.“ Vorbilder gibt es noch keine; im
Wortlaut: „Vorbilder habe ich jetzt erstmal noch keine, können wir gleich gerne auch
mal raussuchen.“ Eine Recherche dazu läuft; ausgewählte Vorbilder werden hier mit
dem festgehalten, was übernommen wird und was nicht. Übernommen werden nur Muster wie
Aufbau, Rhythmus und Bewegungsideen, nie Texte, Bilder, Logos, Schriften oder Code.

### Farben

Stand aus `tailwind.config.js` und `src/index.css`, gelesen am 16.10.2026:

| Token | Wert | Einsatz |
| --- | --- | --- |
| `ink` | `#09090B` | dunkler Hintergrund (`--sw-bg` im Dunkelmodus) |
| `graphite` | `#18181B` | Flächen (`--sw-surface`) |
| `slate` | `#3F3F46` | Rahmen, Nebenflächen |
| `cloud` | `#FAFAFA` | Text im Dunkelmodus (`--sw-fg`) |
| `mist` | `#E4E4E7` | helle Flächen |
| `brand` | `#3b82f6` | Akzent |
| `brandDark` | `#2563EB` | Akzent, gedrückt |
| `brandLight` | `#60a5fa` | Akzent auf dunklem Grund |
| `fg`, `canvas`, `surface`, `muted`, `faint`, `border`, `surface2` | CSS-Variablen `--sw-*` | passen sich Hell- und Dunkelmodus an |

Die `zinc`-Stufen in `tailwind.config.js` stehen dort nur noch aus
Kompatibilitätsgründen. Die Farbskala `.tech-tag-*` hat die Varianten `blue`, `gray`,
`green`, `indigo`, `orange`, `pink`, `purple`, `red`, `teal` und `yellow`.

### Typografie

Geist für Überschriften und Fließtext, Geist Mono für technische Beschriftungen
(`tailwind.config.js`). Beide werden selbst ausgeliefert, wie im Abschnitt
„Rechtliches“ festgelegt. `src/index.css` verweist heute noch auf Inter und Space
Grotesk, die nie geladen werden; diese Verweise entfallen.

### Zustände

Jedes Bedienelement hat Standard, Hover, sichtbaren Fokus, gedrückt und
deaktiviert. Das Kontaktformular hat zusätzlich Senden, Erfolg, Fehler und leer.
Nicht zutreffende Zustände werden als nicht zutreffend benannt.

### Werkzeuge

Die bisherige Regel vom 25.02.2026 lautete: „use Skills like aceternity-ui and
tech-product-landing (only as ref)“. Am 16.10.2026 sagte der Projektverantwortliche
zu den Skills im Projekt: „Sowas wie zum Beispiel UI UX Pro kann auf jeden Fall raus.
Die SEO Guidelines und Webdesign Guidelines können auch raus oder halt diese ganzen
Sachen, diese Skills, die kannst du lieber selbst nochmal selbst überarbeiten, weil
die Skills sind einfach alt, das muss man halt sagen.“ Das Projekt hat deshalb keine
eigenen Skills mehr; was davon gilt, steht in dieser Datei. Globale Skills und
Komponentenbibliotheken dienen nur als Anregung. Übernommen wird nichts ungeprüft,
und alles folgt diesem Design-System und dem Abschnitt „Kein KI-Look“ *(Vorschlag)*.

## Bewegung

Im Wortlaut des Projektverantwortlichen am 16.10.2026: „Es muss aber nicht
unbedingt ganz ruhig sein oder sonstiges. Wir können ja gerne mal überlegen, was wir
hier so machen könnten an Motion Graphics, dass es einfach bessere Motion Graphics
ist, lebendiger wirkt, geiler wirkt.“

### Gewählte Bewegungsmomente

Aus dem vorgeschlagenen Menü hat der Projektverantwortliche am 16.10.2026 gewählt:

| Moment | Entscheidung |
| --- | --- |
| Nahtlose Übergänge: die Projektkarte wächst in die Projektseite, Bild und Titel als gemeinsame Elemente | „Was wichtig ist, ist auf jeden Fall B. Nahtlose Übergänge.“ |
| Seitenübergänge zwischen allen Routen | „Seitenübergänge, F ist wichtig, ne? So wie wir es auch bei der [Sentrix] Code-Seite haben, so geile Übergänge.“ |
| Scroll-Erzählung mit Tiefe: Bilder bewegen sich beim Scrollen in die Tiefe, die Zeitleiste zeichnet sich | „Dann D ist sehr geil. Scroll-Erzählungen, ne? Also dass sich das Ganze bewegt in die Tiefe und Co.“ |
| Mikro-Interaktionen: Federn beim Drücken, animierte Unterstreichungen, Theme-Schalter verwandelt sich | „Mikroanimationen sind wichtig, ne? Also dass das federt und so weiter.“ |
| Video-Vorschau auf Projektkarten | „Videovorschau ist natürlich auch gut. Müssen wir aber halt überlegen, was wir da für ein Video haben.“ |
| Signatur im Hero aus echter Arbeit | „A können wir auch mit einbauen. Wie gesagt, wir müssen nur halt gucken, was wir in dem Moment haben“ |
| Effekte, die dem Mauszeiger folgen | ausgeschlossen: „diese Mauseffekte auf jeden Fall nicht, die da folgen.“ |

### Gewählte Richtung

Nach den Varianten V1 bis V3 hat der Projektverantwortliche am 16.10.2026
ausgewählt. Im Wortlaut: „Die Hero-Sektion bei V2 finde ich zumindest am besten“,
„was ich ganz cool finde, ist auch bei der V2 in dem Bereich quasi dieser Strich,
der quasi sich mit aufbaut“, „der alte Aufbau bei der Projektübersicht ist besser
und einfach übersichtlicher. Deswegen würde ich einfach da den alten Aufbau lassen“,
„der Wechsel gefällt mir gut zwischen den einzelnen Sachen“ und „mir gefällt bei der
V3-Version dieses Rückwechseln mit diesem Karomuster und den blauen Elementen am
besten“.

| Bereich | Richtung |
| --- | --- |
| Hero | Korridor aus Rasterrahmen in 3D, durch den man beim Scrollen fliegt (aus V2) |
| Werdegang | Zeitleiste, die sich beim Scrollen zeichnet und jeden Punkt aufleuchten lässt (aus V2); Deutung des erwähnten Strichs durch die Agenten *(Vorschlag)* |
| Projektübersicht | bisheriger Aufbau; Bild und Titel fliegen in die Projektseite |
| Seitenwechsel | Auflösung über Rasterzellen mit blauen Zellen, hin und zurück (aus V3) |
| Kontaktformular | Regler mit 3D-Szene, siehe „Seitenstruktur“, Abschnitt „Kontaktformular“ |

Die Varianten V1 bis V4 liegen auf dem Branch `explore/motion-variants` und werden
über `?v=1` bis `?v=4` aufgerufen. V4 führt die gewählte Richtung zusammen.

### Technik und Vorgehen

Im Wortlaut: „Grundsätzlich gesehen darf auf jeden Fall WebGL verwendet werden oder
auch 3JS. Wir würden halt erstmal gerne Motion und CSS ausreizen natürlich, aber falls
es nötig ist, kann auch WebGL mit reinfließen.“ Gemeint ist Three.js. Erste Wahl sind
Motion und CSS; WebGL oder Three.js kommen hinzu, wenn ein Moment sie wirklich
braucht, und der Grund steht im Arbeitsbericht.

Das Bewegungskonzept entsteht als eigener Arbeitsschritt: Agenten bauen mehrere
Richtungen als lauffähige Varianten auf einem eigenen Branch, nie auf `main`, und
rendern davon kurze Videos. Im Wortlaut: „Du musst das Ganze auch nicht mehr unbedingt
selbst überprüfen, sondern zeig es mir einfach und ich sage einfach direkt, was mir
nicht gefällt.“ Für solche Varianten entfällt deshalb die Prüfung durch ein zweites
Modell; der Projektverantwortliche sieht sie direkt. Was davon auf `main` kommt,
durchläuft „Fertig heißt fertig“. Das gewählte Ergebnis wird hier mit Tokens und
einem Katalog der Bewegungsmomente festgehalten. Bis dahin gelten diese Grundsätze
*(Vorschlag)*:

1. **Jede Interaktion antwortet.** Hover, Druck, Fokus, Erfolg und Fehler haben eine
   sichtbare Reaktion, die innerhalb von 100 ms beginnt.
2. **Präzise statt verspielt beliebig.** Interaktive Bewegung folgt Federn oder
   bewusst gewählten Kurven. Bewegungen im DOM animieren bevorzugt `transform` und
   `opacity`, damit die Seite flüssig bleibt; einfache Farbwechsel laufen über
   CSS-Transitions.
3. **Jeder Abschnitt hat seine eigene Bewegung**, passend zu seinem Inhalt, statt
   einer Einblendung für alle.
4. **Inhalt zuerst.** Text ist nach spätestens 600 ms lesbar. Keine Animation
   blockiert Lesen oder Bedienen; das Scrollen wird nie übernommen oder umgelenkt.
5. **Rücksicht.** Bei `prefers-reduced-motion` bleiben nur kurze Überblendungen.
   Heute fragt kein Motion-Code diese Einstellung ab (`useReducedMotion` oder
   `MotionConfig` fehlen); das wird nachgeholt.

Motion übernimmt Federn, Gesten, scrollgekoppelte Animationen und
Layout-Übergänge, CSS-Transitions die einfachen Farbwechsel. Außer WebGL und Three.js
kommt eine weitere Animationsbibliothek nur nach Entscheidung des
Projektverantwortlichen hinzu *(Vorschlag)*.

## Inhalte und Texte

### Schreibstil

Regeln des Projektverantwortlichen vom 03.04.2026 für deutsche Texte auf der Website,
unverändert übernommen aus der bisherigen `CLAUDE.md`:

> Schreibe wie ein Mensch, nicht wie eine KI. Direkt, pragmatisch, technisch korrekt.
>
> - Einfache Wörter, kurze und mittlere Sätze mischen.
> - Aktive Sprache, direkte Formulierungen.
> - Kein "—" (Gedankenstrich). Kommas und Punkte reichen.
> - Keine Floskeln: "abschließend", "zusammenfassend", "in der heutigen Zeit".
> - Keine Marketing-Sprache, Metaphern oder Hype-Wörter.
> - Keine Konstruktionen wie "nicht nur X, sondern auch Y".
> - Keine Füllwörter: "eigentlich", "irgendwie", "sehr", "wirklich".
> - Keine Wortwiederholungen. Synonyme nutzen.
> - Technische Begriffe sind OK und erwünscht.

Für englische Texte gelten dieselben Regeln sinngemäß *(Vorschlag)*. Die Ansprache
im Kontaktbereich ist heute „Sie“ („Nehmen Sie Kontakt auf“), die Links-Seite sagt
„du“. [OFFEN: einheitliche Ansprache „Sie“ oder „du“]

### Inhalte pflegen

- Texte und Projektdaten stehen in `src/data/` und in den Seitenkomponenten; neue
  Inhalte kommen bevorzugt in `src/data/`, damit beide Sprachen dieselbe Struktur
  haben.
- Jede Angabe folgt „Wahrheit vor Wirkung“. Eine Zahl, ein Zeitraum oder ein Kunde
  ist erst dann auf der Website, wenn der Projektverantwortliche sie bestätigt hat.

### Belege und Material

Als Belege gelten Store-Seiten, Screenshots, Videos, Quellcode, die
Game-Jam-Platzierung und echte Kundenbewertungen. Zu den Bewertungen im Wortlaut des
Projektverantwortlichen am 16.10.2026: „Sowas wie vielleicht Fiverr-Bewertungen, die
man direkt draufpacken kann, muss jetzt nicht dran geschrieben werden, dass es von
Fiverr ist, die Bewertung, sondern dass es einfach hier 5 Sterne und mit dem Zitat und
so weiter davon. Das geht.“

- **Wortlaut:** Eine Bewertung erscheint nur echt und im Wortlaut; Kürzungen sind markiert, eine
  Übersetzung ist als solche gekennzeichnet.
- **Namen:** Namen von Bewertenden erscheinen nur mit deren Einwilligung; sonst steht etwa die
  Art des Auftrags dabei *(Vorschlag)*.
- **Echtheitshinweis:** Stammen Bewertungen von Verbrauchern, verlangt § 5b Abs. 3
  UWG die Angabe, ob und wie sichergestellt ist, dass sie von echten Kunden stammen.
  Der Hinweis beschreibt nur, was tatsächlich geschieht. Kann auf der Plattform nur
  bewerten, wer dort einen Auftrag abgeschlossen hat, drückt ein Satz wie „Bewertungen
  aus abgeschlossenen Aufträgen über eine Freelance-Plattform, unverändert übernommen“
  das aus, ohne Fiverr zu nennen *(Vorschlag)*. Ob die Nutzungsbedingungen von Fiverr
  das Übernehmen erlauben, ist offen.

Material wie Fotos, Videos und Bewertungen liefert der Projektverantwortliche. Im
Wortlaut: „Kann ich dir auch was gerne liefern? Wenn wir hier, oder irgendetwas gut
ausbauen können und uns überlegen vorher, was man hier vielleicht brauchen könnte.“
Agenten legen deshalb vor jedem Ausbau eine konkrete Liste an, welches Material in
welchem Format gebraucht wird.

### Grundlage und Einordnung

Geprüft am 16.10.2026: [§ 5b UWG](https://www.gesetze-im-internet.de/uwg_2004/__5b.html),
Absatz 3: „Macht ein Unternehmer Bewertungen zugänglich, die Verbraucher im Hinblick
auf Waren oder Dienstleistungen vorgenommen haben, so gelten als wesentlich
Informationen darüber, ob und wie der Unternehmer sicherstellt, dass die
veröffentlichten Bewertungen von solchen Verbrauchern stammen, die die Waren oder
Dienstleistungen tatsächlich genutzt oder erworben haben.“ Wie der Hinweis formuliert
wird, ist eine Projektfestlegung; die Nutzungsbedingungen von Fiverr sind nicht
geprüft.

## Analyse und Einwilligung

Im Wortlaut des Projektverantwortlichen am 16.10.2026: „Ein weiterer wichtiger Punkt,
den wir auf jeden Fall einbauen möchten, ist, dass wir Analysen haben. Das heißt, wie
viele Leute die Webseite öffnen und so weiter, dass wir wirklich solche Analysen haben
und das Ganze auch verstehen. Deswegen brauchen wir wahrscheinlich auch
zwingendermaßen einen Cookie-Banner, weil anscheinend haben Leute mich über diese
Webseite gefunden und Co. Mich interessiert aber mal wirklich, wie viele Leute, was
sich angeguckt wird, was sich nicht angeguckt wird, so eine Heatmap-mäßig, ne? So
wirklich tiefe Analyse, dass wir das Ganze besser verstehen und in Zukunft optimieren
können.“

- **Was gemessen wird:** Besucherzahlen, Herkunft der Besucher, aufgerufene Seiten und
  Abschnitte, Klick- und Scroll-Heatmaps und, wenn das Werkzeug es kann,
  Sitzungsaufzeichnungen *(Vorschlag)*. Seitenwechsel innerhalb der Single-Page-App werden als
  eigene Seitenaufrufe erfasst.
- **Werkzeug:** [OFFEN: Analysewerkzeug; der Vergleich vom 16.10.2026 liegt unter
  `docs/research/2026-10-16-analytics.md`] Bevorzugt wird
  ein Anbieter mit Datenhaltung in der EU, der die erhobenen Daten nicht für eigene
  Zwecke wie Werbung nutzt *(Vorschlag)*.
- **Erst nach Einwilligung:** Das Analyseskript lädt erst, wenn der Besucher
  eingewilligt hat. Vorher geht keine Anfrage an den Anbieter.
- **Ein Einwilligungsbanner für alles:** Ein eigener Banner im Design der Website
  fragt nach den Kategorien „Statistik“ und „Externe Medien“ (Steam-Widget).
  „Ablehnen“ ist so leicht erreichbar wie „Akzeptieren“, nichts ist vorausgewählt, und
  ein Link im Fuß jeder Seite öffnet die Auswahl erneut. Ein fremder Dienst für den
  Banner kommt nicht hinzu *(Vorschlag)*.
- **Datensparsam aufzeichnen:** Eingaben im Kontaktformular werden in Heatmaps und
  Aufzeichnungen nie erfasst *(Vorschlag)*.
- **Datenschutzerklärung:** Sie nennt Werkzeug, Zweck, Rechtsgrundlage Einwilligung,
  Speicherdauer, Empfänger und gegebenenfalls die Übermittlung in Drittländer.
- **Auswertung:** [OFFEN: wer die Auswertung wie oft ansieht und wie Erkenntnisse in
  Änderungen münden]

### Grundlage und Einordnung

Geprüft am 16.10.2026: [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html)
verlangt eine Einwilligung, bevor Informationen auf dem Endgerät gespeichert oder
von dort ausgelesen werden, soweit das nicht unbedingt erforderlich ist. Ob ein
Werkzeug ohne solche Speicherung auskommt, hängt von seiner Einrichtung ab. Der
Vergleich der Werkzeuge mit Preisen, Datenstandorten und Grenzen liegt unter
`docs/research/2026-10-16-analytics.md`, die rechtliche Recherche unter
`docs/research/2026-10-16-legal.md`. Dass vor der Einwilligung gar keine Anfrage an
den Anbieter geht, auch keine ohne Cookies, ist eine Festlegung dieses Projekts und
keine behauptete Pflicht.

## Performance, SEO und Barrierefreiheit

- **Ladezeit:** Jede Seite erreicht die Grenzwerte, die Google als „gut“ einstuft.
  Largest Contentful Paint höchstens 2,5 s und Cumulative Layout Shift höchstens 0,1
  prüft der Lighthouse-Labortest auf Mobilgeräten. Interaction to Next Paint höchstens
  200 ms misst ein Lighthouse-Navigationstest nicht; er wird mit festgelegten
  Interaktionen im Performance-Panel der Chrome DevTools geprüft. Ein Labortest ist
  kein Felddatenwert; Berichte nennen, was wie gemessen wurde.
- **Bilder:** WebP oder AVIF in passender Größe, unterhalb des ersten Bildschirms mit
  `loading="lazy"`, mit `width` und `height` gegen Layoutsprünge *(Vorschlag)*.
  Heute sind viele Bilder unter `public/assets/projects/` PNG oder JPEG mit über 2 MB.
- **Code-Splitting:** Routen werden mit `React.lazy` geladen, damit die Startseite
  nur ihr eigenes JavaScript lädt *(Vorschlag)*.
- **SEO:** Jede indexierbare Route hat im Prerender eigenen Titel, Beschreibung und
  Vorschaubild, in beiden Sprachen. `public/sitemap.xml` führt jede indexierbare
  Route; heute fehlen maxsimcli, cc-templates und fab-store. Die strukturierten Daten
  (JSON-LD) in `index.html` sind wahr und verweisen nur auf vorhandene Dateien.
- **Barrierefreiheit:** WCAG 2.2 Stufe AA, also unter anderem Kontrast mindestens
  4,5 : 1 für normalen Text und vollständige Bedienung per Tastatur. Bedienelemente
  sind mindestens 44 × 44 px groß; das ist eine Projektvorgabe aus der bisherigen
  `CLAUDE.md` und strenger als die 24 × 24 px der WCAG. Interaktive Elemente haben
  passende ARIA-Attribute.
- **Mobil zuerst:** Stile beginnen bei der kleinsten Breite; Breakpoints sind `md:`
  (768 px) und `lg:` (1024 px).

### Grundlage und Einordnung

Geprüft am 16.10.2026: [web.dev zu den Core Web Vitals](https://web.dev/articles/vitals)
(Grenzwerte, gemessen am 75. Perzentil) und [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
(W3C-Empfehlung vom 12.12.2024, Kriterien 1.4.3 und 2.5.8). Die ausführliche Recherche
liegt unter `docs/research/2026-10-16-tech.md`. Rechtlich ist die Website nicht an das
Barrierefreiheitsstärkungsgesetz gebunden (siehe „Rechtliches“); Stufe AA ist eine
Entscheidung des Projekts, keine behauptete Pflicht.

## Code-Konventionen

Übernommen aus der bisherigen `CLAUDE.md` und gegen `tsconfig.app.json` geprüft am
16.10.2026:

- **Komponenten:** Funktionskomponenten mit Default-Export; Props als `type`, nicht `interface`.
- **Typimporte:** `import type` für reine Typimporte, weil `verbatimModuleSyntax` aktiv ist; kein
  `import React`, weil die automatische JSX-Laufzeit gilt.
- **Compiler:** TypeScript mit `strict`, `noUnusedLocals`, `noUnusedParameters` und
  `erasableSyntaxOnly`, Ziel ES2022.
- **Importreihenfolge:** React und Bibliotheken, dann lokale Komponenten, dann Daten und
  Typen.
- **Dateinamen:** Komponenten in PascalCase, Datendateien in camelCase, CSS-Klassen in
  kebab-case.
- **Zustand:** nur mit React-Hooks, keine externe Zustandsbibliothek.
- **Formatierung:** über ESLint (`eslint.config.js`); kein Prettier.

| Aufruf | Wirkung |
| --- | --- |
| `npm run dev` | Vite-Entwicklungsserver |
| `npm run build` | `tsc -b`, `vite build`, danach `scripts/prerender.mjs` |
| `npm run lint` | ESLint über alle `.ts`- und `.tsx`-Dateien |
| `npm run preview` | Vorschau des Produktions-Builds |

Der Base-Path ist in Produktion `/` (`VITE_BASE_PATH` in `.env.production` und in
`deploy.yml`). Die Vorgabe `/sven-maibaum-portfolio/` aus den alten Dateien gilt
nicht mehr.

## KI-Dienste und generierte Inhalte

Im Wortlaut des Projektverantwortlichen am 16.10.2026: „die ganzen KI-Dienste sind
Standard und ohne Grenze erstmal.“ Freigegeben sind folgende Dienste:

| Dienst | Wofür | Zugang |
| --- | --- | --- |
| Google Flow | Nano Banana für Bilder (über `gen`: Modelle `pro`, `2.1`, `lite`), Omni für Videos | Abo; Bilder über den `gen`-Befehl (globaler Skill `gen-media`), sonst Browsersteuerung |
| Gemini-Schnittstelle | Nano Banana 2.1 und Nano Banana Pro für Bilder, Veo 3.1 und Gemini Omni Flash für Videos, Lyria 3.5 für Musik, Gemini 3.8 Flash TTS für Sprache, Auswertung von Bildern und Videos | `GEMINI_API_KEY` in der lokalen `.env` |
| ElevenLabs | Bevorzugt für Soundeffekte (`eleven_text_to_sound_v2`); zusätzlich Musik (Eleven Music) | `ELEVENLABS_API_KEY` in der lokalen `.env`; globaler Skill `elevenlabs-audio` |
| Codex | Bilder erzeugen und bearbeiten | Codex-Anmeldung; über den `gen`-Befehl (globaler Skill `gen-media`) oder die Codex CLI |
| Antigravity | Videos ansehen und auf Fehler prüfen | Antigravity CLI |

Die Tabelle pflegt der Projektverantwortliche; die Namen der Generierungsmodelle haben
den Stand vom 16.10.2026. Andere kostenpflichtige Dienste zum Erzeugen oder Auswerten
von Inhalten nutzen Agenten nicht; ein weiterer kommt nur nach Entscheidung des
Projektverantwortlichen hinzu. Welche Agenten und Modelle die Arbeit selbst
erledigen, entscheidet das Workflow Harness. Agenten nutzen die freigegebenen Dienste
ohne feste Obergrenze und halten die Kosten jedes Laufs im Arbeitsbericht fest. Ist
ein Dienst im Abo und über die bezahlte Schnittstelle erreichbar, nehmen sie zuerst
das Abo: Bilder aus Google Flow und Codex über den `gen`-Befehl, der die Aufträge
aller Agenten nacheinander abarbeitet. Die Schnittstelle nutzen sie für viele
Erzeugungen am Stück, für Arten, die `gen` noch nicht kann, etwa Videos, oder wenn
das Abo gerade nicht verfügbar ist.

Schlüssel kommen aus der lokalen `.env`; für sie gilt der Abschnitt „Zugangsdaten“.
Die `.env` dieses Projekts enthält am 16.10.2026 nur die EmailJS-Werte; Schlüssel
für Gemini und ElevenLabs werden bei der ersten Nutzung ergänzt. Der `gen`-Befehl
liegt nur auf Svens Rechner unter `C:\Development\Apps\3D Pipeline`; auf anderen
Rechnern gelten die Regeln zur Browsersteuerung.

### Generierte Inhalte aktiv nutzen

- **Echte Arbeit zuerst:** Für Projekte zeigt die Website echte Screenshots, Videos
  und Fotos. Generiert wird, was es nicht als echtes Material gibt, etwa Hintergründe,
  Illustrationen, Übergänge oder Ton, und nie etwas, das als echter Beleg erscheint.
- **Ideen sammeln:** Für Gestaltungsfragen erzeugen Agenten bewusst viele Varianten,
  etwa zehn, und greifen die besten Ideen auf. Ideenmaterial bleibt lokal unter
  `.harness/runs/`; ins Projekt kommt nur, was verwendet wird.
- **Dienste vergleichen:** Für wichtige Motive wird derselbe Auftrag mit Codex und mit
  Nano Banana (Gemini oder Google Flow) erzeugt. Die Wahl wird mit Grund festgehalten.
- **Erst ein kleiner Stiltest:** Bevor viele Inhalte einer Art entstehen, werden zwei
  oder drei erzeugt und auf der Seite in ihrer Umgebung geprüft. Erst wenn der Stil
  passt, folgt der Rest.
- **Bauen und Prüfen getrennt:** Ein anderes Modell als das erzeugende vergleicht das
  Ergebnis mit Auftrag und Vorlage, entscheidet über bestanden oder nicht bestanden
  und nennt konkrete Korrekturen. Erst danach schaut ein Mensch darauf.
- **Aktuelle Prompt-Hinweise:** Vor einer Generierungsaufgabe prüft der Agent die
  aktuellen offiziellen Prompt-Hinweise des Dienstes, soweit ein Skill sie nicht
  bereits mit Prüfdatum bereithält.
- **Herkunft festhalten:** Für jeden verwendeten generierten oder fremden Inhalt
  stehen Werkzeug, Modell, Prompt, Vorlage, Datum, gewählte Variante und Lizenz in
  `docs/provenance.md`. Die Datei entsteht mit dem ersten solchen Inhalt.

### Browsersteuerung

- Der Agent arbeitet im angemeldeten Chrome des Projektverantwortlichen in einem
  eigenen Tab. Es steuert immer nur ein Agent gleichzeitig den Browser.
- Anmelden muss sich immer ein Mensch; der Agent tippt nie ein Passwort ein.
- Er ändert nichts am Konto, kauft kein Guthaben und schließt kein Upgrade ab.
- Sicherheitsabfragen wie „Ich bin kein Roboter“ löst, umgeht oder automatisiert er
  nie; er meldet sie dem Projektverantwortlichen in einem Satz und arbeitet an
  anderem weiter.
- Klappt ein Weg nach zwei oder drei Versuchen nicht, nimmt er einen anderen, etwa
  die Schnittstelle, und vermerkt den Punkt für später.

### Kennzeichnung

Während der Entwicklung dürfen generierte Inhalte lokal ungekennzeichnet als
Platzhalter dienen. Auf `main` und damit auf der veröffentlichten Website ist jeder
generierte Inhalt nach der geltenden Rechtslage und den Regeln der Plattform
gekennzeichnet, soweit nötig; was gilt, steht im Abschnitt „Rechtliches“. Grundlage
ist `docs/provenance.md`.

### Grundlage und Einordnung

Geprüft am 16.10.2026: die [Modellübersicht der Gemini-Schnittstelle](https://ai.google.dev/gemini-api/docs/models)
(Stand der Seite 13.10.2026), die [ElevenLabs-Dokumentation](https://elevenlabs.io/docs)
und der globale Skill `gen-media` (Dateistand 12.10.2026). Google Flow nennt seine
Modelle auf den öffentlichen Seiten nicht; „Omni“ für Videos stammt aus dem Skill
`gen-media`. Einzelheiten unter `docs/research/2026-10-16-tech.md`.

## Arbeitsweise der Agenten

### Workflow Harness

Größere Arbeiten laufen über das installierte Workflow Harness
(`C:\Users\conta\harness-workflow` auf Svens Rechner) im Modus `efficient`, wie in
`.harness/config.md` festgelegt. Im Wortlaut des Projektverantwortlichen am
16.10.2026: „Kannst du an sich initialisieren auf Efficient Mode. Aber halt mit diesen
Models.“ `efficient` zielt auf dasselbe Ergebnis wie `quality` mit dem geringsten
Gesamtverbrauch; eine einzelne Aufgabe kann den Modus ausdrücklich ändern. Das
Harness entscheidet, wie Arbeit zugeschnitten, verteilt, geprüft und festgehalten
wird, auch welches Modell welchen Schritt übernimmt. Die Vorgaben des
Projektverantwortlichen vom 16.10.2026 zur Modellwahl stehen deshalb in
`.harness/config.md`, nicht hier.

- **Ziel zuerst:** Größere Aufgaben beginnen mit Abnahmekriterien, die sich mit Ja
  oder Nein beantworten lassen. Ein freigegebenes Ziel in `.harness/spec.md` bleibt
  während der Arbeit unverändert.
- **Bauen und Prüfen getrennt:** Ein anderer Agent oder ein anderes Modell als das
  bauende prüft das Ergebnis gegen die Abnahmekriterien.
- **Ablagen:** Projektwissen und Umgebungsfallen stehen in `.harness/notes/`,
  Lauf- und Prüfartefakte in `.harness/runs/`; diese werden nicht eingecheckt.
- **Arbeitsbericht:** Jeder abgeschlossene Arbeitsschritt endet mit einem kurzen
  Bericht: Ergebnis, durchgeführte Prüfungen mit Ergebnis, Kosten bezahlter Dienste,
  Abweichungen von dieser Datei und offene Punkte.

### Sparsam arbeiten

Ziel ist das bestmögliche Ergebnis bei möglichst geringem Gesamtverbrauch an Zeit,
Tokens und Geld. Qualität, Tests und unabhängige Prüfung werden dafür nie gesenkt.
Im Wortlaut des Projektverantwortlichen am 16.10.2026: „wir möchten super
token-effizient arbeiten. Das heißt, manchmal braucht man vielleicht gar keinen
Sub-Agent, sondern kann das einfach direkt machen, wenn es nur irgendwas Kleines ist.
Da muss man nicht immer unbedingt einen Sub-Agent für starten.“

- **Kleines direkt erledigen:** Eine kleine, klar umrissene Aufgabe erledigt der
  laufende Agent selbst, ohne einen Hilfsagenten zu starten. Die unabhängige Prüfung
  im Abschnitt „Fertig heißt fertig“ bleibt davon unberührt.
- **Gezielt lesen:** Lies von dieser Datei und vom Code die Abschnitte, die die
  Aufgabe betreffen. Große Dateien werden über Überschriften und Suche erschlossen,
  nicht vollständig geladen.
- **Breite Suche abgeben:** Wer viele Dateien oder Quellen durchsuchen muss, gibt das
  an einen Hilfsagenten ab, der nur das Ergebnis mit Fundstellen zurückgibt.
- **Ergebnisse statt Verläufe übergeben:** Zwischen Arbeitsschritten wandert ein
  Ergebnis als Datei mit Belegen, nicht der Gesprächsverlauf.
- **Nichts doppelt holen:** Was bereits abgerufen, recherchiert oder erzeugt ist, wird
  wiederverwendet, solange es gültig ist, etwa die Recherchen unter `docs/research/`.
- **Ansatz wechseln statt wiederholen:** Scheitert derselbe Weg dreimal, wird die
  Ursache auf einer höheren Ebene gesucht, etwa im Verständnis der Aufgabe, im
  Zuschnitt, im Plan oder im Werkzeug, statt weitere Versuche zu starten.
- **Kurz berichten:** Berichte nennen zuerst das Ergebnis, dann Belege und offene
  Punkte, ohne den Arbeitsweg nachzuerzählen.

### Sprache

Das Gespräch mit dem Projektverantwortlichen ist deutsch. Code, Bezeichner, Kommentare
und Agenten-Artefakte sind englisch. Alles, was Besucher auf der Website sehen, ist
deutsch und englisch; Impressum und Datenschutzerklärung liegen mindestens auf
Deutsch vor. Deutsche Texte verwenden korrekte Umlaute und ß.

### Zugangsdaten

Schlüssel, Tokens und Passwörter liegen nur lokal in der `.env` oder als Secrets und
Variablen in den GitHub-Einstellungen des Repositorys. Agenten zeigen sie nie an,
kopieren sie nicht in Prompts, Logs, Berichte oder versionierte Dateien und übergeben
sie nicht auf der Kommandozeile. Wird die `.env` in einem weiteren Arbeitsordner
benötigt, wird sie kopiert, ohne ihren Inhalt anzuzeigen.

Variablen mit dem Präfix `VITE_` baut Vite in das öffentliche JavaScript ein. Deshalb
tragen nur Werte dieses Präfix, die öffentlich sein dürfen, etwa der öffentliche
Schlüssel von EmailJS; ein geheimer Schlüssel bekommt es nie.

### Mehrere Agenten gleichzeitig

Laufen mehrere Agenten zur selben Zeit, dürfen sie sich nicht gegenseitig stören.

- **Eigener Arbeitsordner pro parallelem Lauf:** eigener Git-Worktree, damit
  `node_modules`, `dist` und Zwischendateien sich nicht in die Quere kommen.
- **Sperren für Gemeinsames:** Wer eine gemeinsame Ressource schreibt, etwa den
  angemeldeten Chrome, `main` oder die Einstellungen des Repositorys, legt eine
  Sperrdatei unter `.harness/runs/` mit Laufname und Uhrzeit an; andere warten oder
  lesen nur.
- **Getrennte Prozesse:** Jeder Lauf startet den Entwicklungsserver auf einem eigenen
  Port (`npm run dev -- --port <Port>`) und nutzt eigene Browserprofile und Logs.
  Ports und Prozesse des Projektverantwortlichen bleiben unberührt.
- **Nie fremde Arbeit anfassen:** Kein Lauf beendet fremde Prozesse, setzt fremde
  Dateien zurück oder committet sie.
- **Leistung teilen:** Unabhängige Tests laufen parallel, solange ein Viertel von
  Arbeitsspeicher und Prozessor frei bleibt. Leistungsmessungen laufen allein.

### Projekt sauber halten

Agenten dürfen während der Arbeit beliebig Hilfsdateien anlegen. Bevor eine Aufgabe
als abgeschlossen gilt, räumen sie alles auf, was danach nicht mehr gebraucht wird.

- Prüf- und Laufartefakte liegen von Anfang an unter `.harness/runs/`, nicht im
  Projektstamm oder zwischen dem Produktcode.
- Skripte, die Inhalte erzeugen oder verändern, sind deren reproduzierbare Quelle und
  bleiben versioniert in `scripts/`. Einmalige Wegwerfskripte, Zwischenstände,
  Duplikate und Entwürfe werden entfernt.
- Notizen über erledigte Arbeit wie Changelogs oder Audit-Listen entstehen nicht als
  Dateien im Projektstamm; die Geschichte steht in Git, der Bericht im Arbeitsbericht.
- Aufgeräumt wird nur, was die eigene Aufgabe erzeugt hat. Dateien des
  Projektverantwortlichen, anderer Sitzungen oder bestehende Inhalte werden nicht
  gelöscht; vermutlich Überflüssiges wird aufgelistet, und der Projektverantwortliche
  entscheidet. Im Zweifel bleibt eine Datei erhalten und steht mit Grund im
  Arbeitsbericht.

## Kleine Verantwortlichkeiten und begründete Abstraktionen

Für die Website gilt die praktische Anwendung von SRP (Single Responsibility
Principle), DRY (Don't Repeat Yourself) und KISS (Keep It Simple).

- **Eine klare Zuständigkeit:** Jedes Modul und jede Komponente hat einen
  beschreibbaren Verantwortungsbereich. Fasse zusammen, was fachlich zusammengehört
  und aus denselben Gründen geändert wird; trenne, was unabhängige Änderungsgründe
  hat. Klein heißt fachlich überschaubar, nicht möglichst wenige Zeilen.
- **Eine Regel, eine Stelle:** Dieselbe fachliche Regel, Angabe oder Konfiguration
  wird an genau einer maßgeblichen Stelle gepflegt. Ähnlich aussehender Code mit
  unterschiedlicher Bedeutung muss nicht zusammengeführt werden. Prüfungen an System-
  und Vertrauensgrenzen bleiben erhalten.
- **Verständlich und gezielt erweiterbar:** Ziel ist ein beherrschbares System mit
  klaren Zuständigkeiten, stabilen Verträgen und sinnvollen Erweiterungspunkten. Die
  kurzfristig kleinste Lösung ist nicht automatisch die beste, ein vorsorgliches
  Universalsystem ohne Anwendungsfall ebenso wenig.
- **Abstraktionen brauchen einen Grund:** Zusätzliche Module, Hooks oder Schichten
  entstehen nur für ein konkretes Problem, etwa getrennte Zuständigkeiten, echte
  Wiederverwendung, die Kapselung eines externen Dienstes wie EmailJS oder eine
  Testgrenze. Halte im Arbeitsbericht kurz fest, welches Problem sie löst und warum
  eine einfachere Lösung nicht reicht.
- **Vorhandenes vor Eigenbau:** Nutze geeignete Funktionen von React, React Router,
  Vite, Tailwind und Motion und vorhandene Bibliotheken, bevor eine eigene Lösung für
  dieselbe Aufgabe entsteht. Neue Abhängigkeiten nur mit Grund im Arbeitsbericht.
- **Klare Namen:** Technische Namen sind englisch, eindeutig und beschreiben Inhalt
  oder Aufgabe. Derselbe Begriff heißt projektweit gleich.
- **Werte nicht verstreuen:** Farben, Abstände, Zeiten und Kurven liegen als Tokens in
  `tailwind.config.js` und `src/index.css`, Inhalte in `src/data/`.
- **Fehler sichtbar machen:** Fehlerpfade protokollieren die Ursache und zeigen eine
  verständliche Meldung mit dem nächsten Schritt; Fehler werden nicht still
  verschluckt. Das Kontaktformular nennt bei einem Fehler die E-Mail-Adresse als
  Ausweg.
- **Kein Pauschalumbau:** Vereinfachungen erfolgen im beauftragten Umfang. Diese
  Grundsätze erlauben keinen ungefragten Umbau bestehenden Codes.

Ein Entwurfsbeispiel für die Website: Jede Route ist heute an drei Stellen von Hand
gepflegt, in `src/App.tsx`, in der Liste `routes` in `scripts/prerender.mjs` und in
`public/sitemap.xml`. Die Folge ist messbar: In der Sitemap fehlen drei
Projektseiten. Ein gemeinsames Routenverzeichnis mit Pfad, Titel, Beschreibung, Bild
und Sprachfassung, aus dem Router, Prerender und Sitemap gespeist werden, löst das an
einer Stelle *(Vorschlag)*.

### Grundlage und Einordnung

Geprüft am 16.10.2026: Robert C. Martins Erläuterung des
[Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)
und Thomas und Hunts [DRY-Kapitel aus The Pragmatic Programmer](https://media.pragprog.com/titles/tpp20/dry.pdf).
Diese praktische Auslegung ist unser Projektstandard, keine behauptete Vorschrift
dieser Quellen.

## Tests: erst rot, dann grün

Automatisierte Tests gehören verbindlich zur Entwicklung. Die frühere Regel „kein
Test-Framework ohne ausdrückliche Anfrage“ ist aufgehoben; der Projektverantwortliche
am 16.10.2026: „die Tests, die du vorgeschlagen hast, sind perfekt“. Definiere bei
neuen oder geänderten Funktionen das überprüfbare Verhalten und sichere Regeln,
Integrationen und kritische Abläufe mit Tests auf passender Ebene ab. Teste
beobachtbares Verhalten und Fehlerfälle; bilde nicht die Implementierung im Test nach.

- **Erst rot, dann grün:** Ein neuer oder wesentlich geänderter Test zählt erst als
  Nachweis, wenn er nachweislich aus dem vorgesehenen fachlichen Grund fehlgeschlagen
  ist und danach mit korrektem Verhalten besteht. Bei einer Fehlerbehebung
  reproduziert er zuerst den Fehler. Ein Compilerfehler, ein fehlendes Testsetup oder
  ein pauschales Fehlschlagen ersetzt diesen Nachweis nicht.
- **Nichts passend machen:** Ändere keine Anforderungen, Grenzwerte, Erwartungen oder
  Referenzdaten, nur um einen Lauf grün zu machen.
- **Passende Ebene:** Vitest prüft Daten und Logik, etwa dass jede Projektroute im
  Prerender, in der Sitemap und in beiden Sprachen vorkommt und ihr Bild existiert.
  Playwright prüft echte Seiten im gebauten Stand: Navigation, Kontaktformular,
  Tastaturbedienung, automatische Barrierefreiheitsprüfung und Screenshots in den
  Breiten aus dem Abschnitt „UI-Workflow“. Beides läuft in GitHub Actions vor jedem
  Deploy. Wähle den kleinsten Umfang, der den Vertrag zuverlässig prüft. Mocks ersetzen
  nie die Integration, die gerade geprüft wird.
- **Keine bezahlten Dienste in Tests:** Tests nutzen gespeicherte Beispielantworten;
  das Kontaktformular sendet im Test nicht über EmailJS. Echte Sendungen gibt es nur
  in ausdrücklichen Läufen.
- **Wiederholbar:** Tests laufen unabhängig von der Reihenfolge, warten auf
  überprüfbare Zustände statt auf feste Pausen und räumen auf, was sie anlegen.
- **Ehrlich auswerten:** Fehlende, übersprungene oder abgebrochene Pflichtprüfungen sind
  kein Erfolg. Halte Testkennung, beobachteten Fehler und den grünen Lauf fest.
- **Schnell zuerst:** Während der Arbeit laufen die schnellen und betroffenen Tests;
  vor dem Commit laufen `npm run lint`, `npm run build` und die vollständige
  zugehörige Testauswahl.

Am 16.10.2026 ist noch kein Test eingerichtet; die Einrichtung ist ein offener Punkt.
Bis dahin gelten `npm run lint` ohne Fehler, `npm run build` und die Sichtprüfung im
Browser als Mindestprüfung. Die Rot-Grün-Pflicht übernimmt die Testintegrität des
Workflow Harness (`SPEC/02-yardstick.md`, F1).

## UI-Workflow

1. Arbeite in kleinen, klar abgegrenzten Aufgaben. Baue zuerst wiederverwendbare
   Bausteine wie Buttons, Karten, Dialoge und Seitenvorlagen.
2. Halte Daten, Zustände und Verhalten von der Darstellung getrennt.
3. Nutze die festgelegten Design-Tokens; neue Werte werden erst im Abschnitt
   „Design-System“ festgehalten, dann verwendet.
4. Öffne das Ergebnis im echten Browser, erstelle Screenshots in den Breiten 320,
   390, 768, 1024 und 1440 px, jeweils hell und dunkel, und prüfe Abstände,
   Lesbarkeit, Kontrast und Bewegung. Teste die Bedienung mit Maus, Tastatur und
   Touch, Bewegung mit voller und reduzierter Einstellung.
5. Lies die tatsächliche Struktur zurück, etwa den DOM, statt dich auf die eigene
   Änderung zu verlassen.
6. Korrigiere erkannte Fehler und prüfe erneut. Erst danach folgt der nächste
   Baustein.

## Fertig heißt fertig

Eine Aufgabe gilt erst als fertig, wenn alle zutreffenden Punkte erfüllt sind; nicht
zutreffende Punkte werden mit Grund markiert.

1. Verhalten und Abnahmekriterien standen vor der Umsetzung fest, ebenso das Prinzip,
   dem die Änderung dient.
2. Tests auf passender Ebene sind nachweislich erst rot und dann grün.
3. Das Ergebnis wurde im echten Browser gesehen, nicht nur im Test.
4. Fehlerpfade protokollieren die Ursache und zeigen eine verständliche Meldung mit
   dem nächsten Schritt.
5. Keine Zugangsdaten in Code, Logs, Berichten oder versionierten Dateien.
6. Die Herkunft generierter und fremder Inhalte ist festgehalten.
7. Ein unabhängiger Agent oder ein anderes Modell hat die Änderung gegen diese Liste
   geprüft; berührte feste Projektentscheidungen sind abgestimmt.
8. Alles, was die Arbeit vorübergehend angelegt hat, ist aufgeräumt.
9. Screenshots in den vereinbarten Breiten, hell und dunkel und in beiden Sprachen,
   sind geprüft.
10. Tastaturbedienung und Kontrast sind geprüft.
11. Jede neue Route steht in Router, Prerender und Sitemap, in beiden Sprachen.
12. Die Seite lädt zur Laufzeit nichts von Dritten außer dem, was der Abschnitt
    „Rechtliches“ erlaubt.
13. Jede Seite führt zu einer Anfrage.
14. `npm run lint`, `npm run build` und die Tests sind grün, der Deploy in GitHub
    Actions ist erfolgreich, und die geänderten Seiten wurden auf
    `sven-maibaum.com` geprüft.

## Rechtliches

Diese Vorgaben ersetzen keine Rechtsberatung. Vor einer Veröffentlichung prüft der
Projektverantwortliche die betroffenen Punkte. Für eine erste Einschätzung helfen die
globalen Skills `anwalt-de` und `gdpr-dsgvo-expert`.

- **Impressum:** Nach § 5 Abs. 1 DDG mit Name und Anschrift, schnellem elektronischem
  Kontakt einschließlich E-Mail-Adresse und der Umsatzsteuer-Identifikationsnummer.
  Eine Telefonnummer ist nicht nötig. Eine Angabe nach § 18 Abs. 2 MStV ist ohne
  redaktionellen Bereich wahrscheinlich nicht nötig, schadet aber nicht. Ein Link zur
  OS-Plattform entfällt, weil sie zum 20.07.2025 aufgehoben wurde; der Hinweis nach
  § 36 Abs. 1 Nr. 1 VSBG entfällt, wenn am 31. Dezember des Vorjahres höchstens zehn
  Personen beschäftigt waren (§ 36 Abs. 3 VSBG); die Zahl bestätigt der
  Projektverantwortliche. Eine Schlichtungsstelle nach Nr. 2 ist nur zu nennen, wenn
  er sich zur Teilnahme verpflichtet hat oder verpflichtet ist.
- **Datenschutzerklärung:** Vollständig nach Art. 13 DSGVO, ohne Platzhalter. Sie
  nennt GitHub Pages mit den Server-Logs, deren Dauer GitHub nicht beziffert (deshalb
  ein Kriterium statt „sieben Tage“), EmailJS Pte. Ltd. aus Singapur mit Servern in
  den USA und Standardvertragsklauseln, das Steam-Widget von Valve, die Speicherung
  des Farbmodus im lokalen Speicher und den Kontakt per E-Mail.
- **Drittanbieter zur Laufzeit:** Schriften werden selbst ausgeliefert, Font Awesome
  und das Bild von `placehold.co` entfallen. EmailJS sendet nur beim Absenden des
  Formulars. Die Steam-Widgets bleiben; im Wortlaut des Projektverantwortlichen am
  16.10.2026: „Da ist auch einfach die Frage, wenn das Ganze jetzt ein Steam-Widget
  ist, dann soll das trotzdem drin bleiben. Das ist ja an sich ganz gut, dass man da
  direkt draufdrücken kann und Co. Und falls es dementsprechend notwendig ist, baue
  halt einfach den Cookie-Banner mit ein.“ Weil das Widget beim Laden ein Cookie von
  Valve setzt, lädt es erst nach Einwilligung; bis dahin zeigt die Seite ein eigenes
  Bild mit Link zum Store, und ein Klick darauf kann die Einwilligung direkt geben
  *(Vorschlag)*. Mit der Analyse ist am 16.10.2026 ein Einwilligungsbanner
  beschlossen; Einzelheiten stehen im Abschnitt „Analyse und Einwilligung“. Weitere
  Dienste, die zur Laufzeit laden, kommen nur nach Entscheidung des
  Projektverantwortlichen hinzu.
- **AGB:** Die AGB-Seite entfällt, wie im Abschnitt „Seitenstruktur“ entschieden. Eine
  Pflicht, AGB auf der Website zu veröffentlichen, besteht nicht; werden AGB
  verwendet, gehören sie mit klar benanntem Verwender zum Angebot oder Vertrag
  (§ 305 Abs. 2 BGB).
- **Barrierefreiheitsstärkungsgesetz:** Es greift nicht, weil die Website keine
  Verbraucherverträge abschließt; das gilt, solange auf der Website nicht verkauft
  wird. Zusätzlich wäre MAY STUDIOS als Kleinstunternehmen für Dienstleistungen
  ausgenommen. Diesen zweiten Grund legt die Website erst zugrunde, wenn der
  Projektverantwortliche Beschäftigtenzahl und Umsatz bestätigt hat; bis dahin ist er
  vorläufig.
- **KI-Kennzeichnung:** Seit dem 02.08.2026 gilt Art. 50 Abs. 4 der KI-Verordnung.
  Fotorealistische KI-Bilder, -Videos oder -Töne, die echten Personen, Orten oder
  Ereignissen ähneln und echt wirken würden, werden als künstlich erzeugt
  gekennzeichnet. Stilisierte Grafik und Texte über eigene Projekte brauchen keine
  Kennzeichnung. Ein generiertes Bild, das als echte Referenz, Auszeichnung oder als
  echtes Ergebnis erscheint, wäre irreführend (§ 5 UWG) und ist durch „Wahrheit vor
  Wirkung“ ohnehin ausgeschlossen.
- **Lizenzen:** Screenshots, Videos und Logos stammen aus eigenen Projekten oder sind
  mit Lizenz in `docs/provenance.md` festgehalten. Store-Badges und Plattformlogos wie
  Google Play und Steam folgen den Markenrichtlinien der Anbieter *(Vorschlag)*.

### Grundlage und Einordnung

Geprüft am 16.10.2026: [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html),
[§ 36 VSBG](https://www.gesetze-im-internet.de/vsbg/__36.html),
[Verordnung (EU) 2024/3228](https://publications.europa.eu/resource/celex/32024R3228),
Art. 13 DSGVO, [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html),
[LG München I, Urteil vom 20.01.2022, 3 O 17493/20](https://www.gesetze-bayern.de/Content/Document/Y-300-Z-BECKRS-B-2022-N-612)
zu Google Fonts, [§§ 1 bis 3 BFSG](https://www.gesetze-im-internet.de/bfsg/__3.html),
[Verordnung (EU) 2024/1689](https://publications.europa.eu/resource/celex/32024R1689)
mit Art. 50 und [§ 305 BGB](https://www.gesetze-im-internet.de/bgb/__305.html), dazu
die Datenschutzangaben von GitHub, EmailJS und Valve. Die ausführliche Recherche mit
Zitaten liegt unter `docs/research/2026-10-16-legal.md`. Das Münchner Urteil ist eine
erste Instanz; die Frage zur IP-Adresse liegt dem Europäischen Gerichtshof vor. Die
Einschätzungen zu § 18 MStV, zum Farbmodus und zum Cookie des Steam-Widgets sind
Auslegung, keine gesicherte Rechtsprechung. Die Ausnahme beim
Barrierefreiheitsstärkungsgesetz setzt weniger als zehn Beschäftigte und höchstens
2 Millionen Euro Umsatz voraus; das ist eine Angabe über MAY STUDIOS, die der
Projektverantwortliche bestätigt.

## Offene Punkte

Die Reihenfolge der Arbeit hat der Projektverantwortliche am 16.10.2026 bestätigt:
erst Kontakt, Rechtliches und Tests, dann Inhalt und Struktur, dann Design und
Bewegung, dann die englische Fassung. Im Wortlaut: „Und die Reihenfolge, ja, die ist
an sich korrekt, aber die wird am Ende in einem Fluss abgearbeitet.“ Die Punkte
laufen deshalb nacheinander durch das Workflow Harness, ohne zwischen den Phasen
anzuhalten; angehalten wird nur, wo eine Entscheidung oder Material des
Projektverantwortlichen fehlt.

- Analysewerkzeug auswählen; Einwilligungsbanner für Statistik und Steam-Widget
  bauen; Datenschutzerklärung ergänzen.
- Auswertung der Analyse: wer sie wie oft ansieht und wie Erkenntnisse in Änderungen
  münden.
- Leistungen und Hero-Satz formulieren: Agenten schlagen Fassungen vor, der
  Projektverantwortliche wählt.
- Projekte seit Juli 2026 durchgehen: welche neu auf die Website kommen und welche drei
  ganz vorne stehen.
- Bewertungen auswählen und die Nutzungsbedingungen von Fiverr prüfen.
- Materialliste erstellen (Foto, Videos je Projekt, Bewertungen, Logos); der
  Projektverantwortliche liefert.
- Vorbilder auswählen und im Abschnitt „Design-System“ festhalten.
- Exambyte fertigstellen und unter `exambyte.de` im Sandbox-Modus online stellen
  (eigenes Projekt).

- Kontaktformular in Produktion reparieren: Der Build in GitHub Actions bekommt die
  EmailJS-Werte nicht, im veröffentlichten JavaScript sind sie am 16.10.2026 leer.
  Die Werte kommen als Variablen des Repositorys in `deploy.yml`.
- Datenschutzerklärung berichtigen: Platzhalter, EmailJS Pte. Ltd. mit
  Standardvertragsklauseln, Kriterium für die GitHub-Logs, Valve, selbst
  ausgelieferte Schriften.
- Schriften selbst ausliefern, Font Awesome und `placehold.co` entfernen,
  Einwilligung am Steam-Widget einbauen.
- Seiten `/showcase` und `/agb` entfernen, samt Prerender und Sitemap.
- Werdegang und aktuelle Positionen bestätigen; „über 6 Jahren Erfahrung“ durch die
  bestätigte Angabe ersetzen.
- Discord-Einladungslink für HeistLine vom Projektverantwortlichen.
- Ansprache auf der Website: einheitlich „Sie“ oder „du“?
- Kanonische URLs in Prerender, Sitemap und `robots.txt` auf `sven-maibaum.com`
  vereinheitlichen; heute nennen sie `www.sven-maibaum.com`, das GitHub Pages auf
  `sven-maibaum.com` umleitet *(Vorschlag)*.
- Fehlende Dateien: `public/assets/sven_maibaum.pkpass` (Wallet-Button der
  Visitenkarte) und `sven-maibaum-profil.jpg` (JSON-LD in `index.html`).
- Sitemap um maxsimcli, cc-templates und fab-store ergänzen; gemeinsames
  Routenverzeichnis prüfen.
- Testgrundlage einrichten: Vitest, Playwright und ein Testschritt in `deploy.yml`.
- Bewegungskonzept: V4 vom Projektverantwortlichen bestätigen lassen, dann Tokens und
  Katalog in den Abschnitt „Bewegung“.
- 3D-Szene zur Projektgröße: Stiltest auswerten und dem Projektverantwortlichen
  zeigen; nach Bestätigung von Technik, Inhalt der Stufen, Beispieltexten und der
  Position über dem Kontaktformular alle Stufen in beiden Fassungen rendern und
  einbauen.
- KI-Look abbauen nach dem Abschnitt „Kein KI-Look“.
- Bilder optimieren und Routen mit `React.lazy` laden.
- Englische Fassung: URL-Aufbau bestätigen, Texte übersetzen, Prerender erweitern.
- Aufteilung zwischen MAY STUDIOS und Sentrix Code GmbH auf der Website gestalten;
  Domain der Sentrix-Website für den Link.
- Leistungen bestätigen und je Firma zuordnen.
- Angaben für Impressum und Rechtliches bestätigen: keine Beschäftigten, Umsatz unter
  2 Millionen Euro, kein Handelsregistereintrag, Wirtschafts-Identifikationsnummer
  ja oder nein; „Verliehen in: Deutschland“ im Impressum streichen?
- Die bestehende ESLint-Warnung in `src/components/Layout.tsx` (fehlende Abhängigkeit
  `location.hash`) beheben.
