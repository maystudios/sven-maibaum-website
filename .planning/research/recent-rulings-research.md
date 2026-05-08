# Impressum & Datenschutzerklärung — Rechtslage 2024–2026
## Forschungsdokument für sven-maibaum.com (Portfolio-Privatperson)

**Erstellt:** Mai 2026  
**Kontext:** Deutsche Portfolio-Website einer Privatperson / Freiberuflers mit Kontaktformular. Kein E-Commerce. Kein Tracking. Keine Werbung. Hosted via GitHub Pages.

---

## 1. Aktuelles rechtliches Fundament: TMG → DDG (Mai 2024)

### Was sich geändert hat

Am **14. Mai 2024** trat das **Digitale-Dienste-Gesetz (DDG)** in Kraft und löste das Telemediengesetz (TMG) ab. Gleichzeitig wurde das TTDSG in **TDDDG** (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz) umbenannt.

**Konkrete Auswirkungen auf Impressum:**
- Die Impressumspflicht regelt nun **§ 5 DDG** statt § 5 TMG
- Inhaltlich hat sich **nichts** geändert — die Pflichtangaben sind identisch
- Wer im Impressum noch auf „§ 5 TMG" verweist, sollte das anpassen (Abmahnrisiko: veraltete Referenz wirkt irreführend)
- Ein expliziter Verweis auf DDG im Impressum ist **nicht erforderlich** und sogar nicht ratsam (Gesetze ändern sich)

**Konkrete Auswirkungen auf Datenschutzerklärung:**
- Bezüge auf „TTDSG" müssen durch **„TDDDG"** ersetzt werden (insbesondere § 25 TDDDG für Cookies)
- Wer nie auf TTDSG verwiesen hat, hat keinen Handlungsbedarf
- Inhaltlich bleiben alle Pflichten gleich

**Quellen:**
- [IT-Recht Kanzlei: Das Aus für das TMG](https://www.it-recht-kanzlei.de/tmg-ttdsg-ausser-kraft-impressum-datenschutz.html)
- [eRecht24: Das TMG wird zum DDG](https://www.e-recht24.de/news/datenschutz/13296-webseitenbetreiber-aufgepasst-das-tmg-wird-zum-digitale-dienste-gesetz-aktualisieren-sie-jetzt-ihr-impressum.html)
- [DDG offiziell](https://gesetz-digitale-dienste.de/)

---

## 2. Impressumspflicht: Gilt sie für dieses Portfolio?

### Klare Antwort: Ja

Ein Portfolio, das Freelance-Dienstleistungen bewirbt oder potenzielle Auftraggeber ansprechen soll, gilt als **geschäftsmäßig** im Sinne des § 5 DDG — auch ohne Gewerbeanmeldung.

**Definition „geschäftsmäßig":**
- Weiter als „gewerbsmäßig" — Entgeltlichkeit ist **nicht erforderlich**
- Reicht bereits, wenn die Website mittelbar kommerzielle Interessen fördert
- Portfolio = Selbstdarstellung gegenüber potenziellen Kunden/Arbeitgebern → geschäftsmäßig
- Ausnahme: Nur rein private Tagebücher / Fotoalben für Familie — kein öffentliches Portfolio

**Bußgeld bei Verstoß:** bis zu 50.000 Euro nach § 33 DDG

### Pflichtangaben im Impressum (§ 5 DDG)

Für eine natürliche Person ohne Gewerbe / Freiberufler ohne Kammerpflicht (z. B. Softwareentwickler):

```
Vollständiger Name (ausgeschriebener Vorname + Nachname)
Ladungsfähige Anschrift (Wohn- oder Geschäftsadresse — oder c/o-Adresse)
E-Mail-Adresse
Telefonnummer (für schnelle elektronische Kontaktaufnahme)
```

**Nicht nötig (da kein Kammermitglied, kein eingetragener Kaufmann, keine regulierte Tätigkeit):**
- Handelsregisternummer
- Umsatzsteuer-ID (nur wenn vorhanden)
- Berufskammer-Angaben

### Privatadresse schützen

Es besteht keine Pflicht, die Privatwohnung anzugeben — nur eine **ladungsfähige Anschrift** (an der man tatsächlich erreichbar ist). Alternativen:
- c/o-Adresse (z. B. Eltern, Bekannte mit Einverständnis)
- Virtuelle Geschäftsadresse / Postfachdienst (kostenpflichtig, ab ca. 10 €/Monat)
- Kanzleiadresse (falls Anwalt vorhanden)

**Quellen:**
- [eRecht24: Impressum für private Homepage](https://www.e-recht24.de/impressum/13095-impressum-fuer-die-private-homepage.html)
- [Impressum-Generator: Privatperson](https://impressum-generator.de/impressumspflicht-private-homepage)
- [eRecht24: Impressum für Freiberufler](https://www.e-recht24.de/impressum/13480-impressum-fuer-freiberufler.html)

---

## 3. Aktuelle Abmahnrisiken 2024–2026

### 3.1 Übersicht: Risikostufen für ein Portfolio ohne E-Commerce

| Risiko | Wahrscheinlichkeit | Schutzmaßnahme |
|---|---|---|
| Fehlendes/fehlerhaftes Impressum | **Hoch** | Korrektes Impressum nach § 5 DDG |
| Fehlendes/fehlerhaftes Datenschutzerklärung | **Hoch** | Vollständige DSE nach DSGVO |
| Google Fonts dynamisch geladen | **Mittel** (abgeflaut, BGH beim EuGH) | Lokal hosten |
| Veraltete Gesetzesbezüge (TMG statt DDG) | **Mittel** | Texte aktualisieren |
| Cookie-Banner fehlt (ohne Tracking) | **Gering** | Wenn kein nicht-notwendiges Tracking: kein Banner nötig |
| BFSG-Verstoß (Barrierefreiheit) | **Sehr gering** | Kleinstunternehmen-Ausnahme gilt |
| Fehlende Urheberrechtsangabe bei Bildern | **Mittel** | Nur eigene/lizenzfreie Bilder verwenden |
| Versteckte DSE (nicht mit 1 Klick erreichbar) | **Hoch** | Footer-Link auf jeder Seite |

### 3.2 Abmahnthemen im Detail

#### Google Fonts (dynamisch) — Risiko: sinkt, aber nicht null
- **LG München I**, 20.01.2022, Az. 3 O 17493/20: Einbindung ohne Einwilligung = DSGVO-Verstoß
- **Abmahnwelle 2022:** Über 100.000 automatisierte Abmahnungen
- **Status 2025:** BGH hat am **28.08.2025** (Az. VI ZR 258/24) drei Fragen dem EuGH vorgelegt:
  1. Sind dynamische IP-Adressen beim Drittempfänger personenbezogene Daten?
  2. Kann Schadensersatz verweigert werden, wenn der Verstoß bewusst provoziert wurde?
  3. Rechtsmissbrauch bei automatisierten Massenabmahnungen?
- **Praktische Empfehlung:** Fonts **lokal hosten** — eliminiert das Problem vollständig, unabhängig vom EuGH-Urteil

#### Fehlendes/fehlerhaftes Impressum — Risiko: dauerhaft hoch
- Häufigster Abmahngrund überhaupt
- Kanzleien scannen automatisiert tausende Websites pro Woche
- Selbst fehlende Telefonnummer kann ausreichen
- Nach § 33 DDG Bußgeld bis 50.000 Euro

#### Fehlende oder nicht auffindbare Datenschutzerklärung — Risiko: hoch
- BGH, 27.03.2025 (Az. I ZR 222/19, I ZR 223/19): Datenschutzverstöße sind wettbewerbsrechtlich abmahnbar
- DSE muss von **jeder Unterseite mit 1 Klick** erreichbar sein (Footer-Link)
- Versteckte DSE = abmahnbar (bestätigt durch OLG-Rechtsprechung)

#### BFSG (Barrierefreiheitsstärkungsgesetz) — Risiko: sehr gering für Privatperson
- Seit **28. Juni 2025** in Kraft
- Erste Abmahnwellen durch Kanzlei CLAIM seit Sommer 2025 verzeichnet
- **Ausnahme:** Kleinstunternehmen mit **weniger als 10 Mitarbeitern UND max. 2 Mio. € Jahresumsatz** sind bei Dienstleistungen ausgenommen
- Privatpersonen ohne Gewerbebetrieb fallen sehr wahrscheinlich unter die Ausnahme
- Trotzdem: Grundlegende Barrierefreiheit (alt-Texte, Kontraste) schadet nicht

#### Veraltete Gesetzesbezüge (TMG) — Risiko: mittel
- Impressum mit Verweis auf „§ 5 TMG" kann als irreführend gewertet werden
- Datenschutzerklärung mit Verweis auf TTDSG statt TDDDG ebenso
- Einfach zu beheben: Texte aktualisieren oder Generatoren neu laufen lassen

---

## 4. Schlüssel-Urteile 2024–2026

### BGH, 27. März 2025 — DSGVO-Verstöße wettbewerbsrechtlich abmahnbar
- **Az.:** I ZR 222/19 und I ZR 223/19 (+ I ZR 186/17)
- **Kern:** Wettbewerber und Verbraucherschutzverbände dürfen Datenschutzverstöße zivilrechtlich abmahnen (UWG § 3a)
- **Einschränkung:** Mitbewerber müssen bei Unternehmen mit unter 250 Mitarbeitern eigene Anwaltskosten tragen (§ 13 Abs. 4 Nr. 2 UWG) — reduziert Massenabmahnanreiz
- **Relevanz:** Formalfehler in DSE, Cookie-Banner oder Einwilligungstexten genügen für Abmahnung
- **Quellen:** [IT-Anwalt-Kanzlei](https://www.it-anwalt-kanzlei.de/bgh-urteil-2025-dsgvo-verstoesse-sind-abmahnbar), [activeMind.legal](https://www.activemind.legal/de/guides/urteil-abmahnrecht/), [Kanzlei Kramarz](https://kanzlei-kramarz.de/bgh-urteil-dsgvo-verstoesse-sind-abmahnfaehig-neue-klagebefugnis-fuer-mitbewerber-und-verbaende/)

### EuGH, 4. Oktober 2024 — Kontrollverlust als immaterieller Schaden
- **Az.:** C-200/23
- **Kern:** Allein der Kontrollverlust über datenschutzwidrig veröffentlichte Daten stellt einen ersatzfähigen immateriellen Schaden dar — kein Nachweis zusätzlicher Folgen nötig
- **Relevanz:** Legt die Latte für Schadensersatzansprüche nach Art. 82 DSGVO sehr niedrig
- **Quelle:** [WBS.legal: Zwei wichtige EuGH-Entscheidungen](https://www.wbs.legal/it-und-internet-recht/datenschutzrecht/zwei-wichtige-eugh-entscheidungen-recht-auf-dsgvo-schadensersatz-erneut-massiv-gestaerkt-79665/)

### EuGH, 4. Oktober 2024 — Entschuldigung als Schadensersatz
- **Az.:** C-507/23
- **Kern:** Eine Entschuldigung kann ausnahmsweise als angemessener Ersatz eines immateriellen Schadens gelten, wenn Wiederherstellung nicht möglich ist
- **Quelle:** [CMS HS Blogg](https://www.cmshs-bloggt.de/tmc/datenschutzrecht/neues-vom-eugh-zum-dsgvo-schadensersatz/)

### EuGH, C-21/23 (Referenz für BGH 27.03.2025)
- Vorlagefrage zu Art. 80 Abs. 2 DSGVO: Können Verbraucherschutzverbände DSGVO-Verstöße klagen?
- EuGH: Ja → BGH hat das in seiner Entscheidung vom 27.03.2025 umgesetzt

### BGH, 28. August 2025 — BGH legt EuGH Google-Fonts-Fragen vor
- **Az.:** VI ZR 258/24
- **Kern:** BGH setzt Verfahren aus und legt drei Fragen dem EuGH vor:
  1. Sind dynamische IP-Adressen beim Drittempfänger personenbezogene Daten?
  2. Kann Schadensersatz bei bewusst provoziertem Verstoß versagt werden?
  3. Kann Rechtsmissbrauch bei massenhaft künstlich geschaffenen Verstößen eingewandt werden?
- **Status:** Beim EuGH — keine Entscheidung bisher
- **Quelle:** [Shopbetreiber-Blog](https://shopbetreiber-blog.de/eugh-muss-entscheiden-bgh-legt-fragen-zu-google-fonts-abmahnungen-vor), [heise online](https://www.heise.de/en/news/Google-Fonts-Warning-Wave-BGH-Sends-IP-Questions-to-ECJ-11136736.html)

---

## 5. Cookie-Banner / Consent — Wann nötig?

### Rechtliche Grundlage: § 25 TDDDG (ehemals § 25 TTDSG)

**Faustformel:**
- Nur **technisch notwendige** Cookies (Session, CSRF-Token etc.) → **kein Banner nötig**
- Alle anderen Cookies/Tracker → **Einwilligung (Opt-in) zwingend vor dem Laden**

### Für sven-maibaum.com konkret

Wenn die Site:
- Kein Google Analytics / Matomo / Plausible etc.
- Keine eingebetteten YouTube/Vimeo-Videos
- Keine Social-Media-Plugins
- Keine Werbenetzwerke
- Keine externen Font-Adressen (wenn Fonts lokal gehostet)

→ **Kein Cookie-Banner erforderlich**

Ein klarer Satz in der Datenschutzerklärung genügt: „Diese Website verwendet keine Tracking-Cookies. Der Hostinganbieter speichert technische Serverlogfiles (IP-Adresse, Zeitstempel) auf Basis von Art. 6 Abs. 1 lit. f DSGVO."

### Was ist mit Kontaktformular?

Das Kontaktformular setzt in der Regel **keine Cookies** — es verarbeitet personenbezogene Daten (Name, E-Mail, Nachricht). Das erfordert:
- Hinweis in der DSE (eigener Abschnitt „Kontaktformular")
- Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) oder lit. f (berechtigtes Interesse)
- Angabe zur Speicherdauer

**Kein Cookie-Banner**, aber DSE-Abschnitt für Kontaktformular.

### Neue Einwilligungsverwaltungsverordnung (EinwV)
- In Kraft seit **1. April 2025**
- Ermöglicht PIMS (Personal Information Management Services) als Alternative zu Cookie-Bannern
- Praktisch noch kaum verbreitet, keine relevante Pflicht für kleine Sites

**Quellen:**
- [eRecht24: TDDDG](https://www.e-recht24.de/datenschutz/12834-tdddg.html)
- [digitalsprung: Cookie-Banner Pflicht 2025](https://digitalsprung.de/blog/cookie-banner-pflicht-2025-so-verwandelst-du-das-pop-up-in-ein-vertrauenssignal)
- [datenschutz-generator.de: Cookies](https://datenschutz-generator.de/tdddg-cookies/)

---

## 6. GitHub Pages als Hosting-Provider

Da sven-maibaum.com über GitHub Pages gehostet wird, müssen folgende Angaben in die Datenschutzerklärung:

```
Hoster:
GitHub Inc.
88 Colin P Kelly Jr St
San Francisco, CA 94107
USA

GitHub ist ein Auftragsverarbeiter. Beim Aufruf der Website werden technische 
Daten (IP-Adresse, Zeitstempel, Browser-Typ) in Server-Logfiles gespeichert.

Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
Drittlandtransfer: USA — auf Basis von Standardvertragsklauseln (SCCs)

Datenschutzerklärung GitHub: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement
```

**AVV mit GitHub:** GitHub bietet Data Processing Agreements für GitHub Pages an. Für eine rein statische Website (kein Tracking, kein personenbezogenes Logging durch Betreiber) haben bayerische Datenschutzbehörden erklärt, dass ein AVV nicht zwingend erforderlich ist — gleichwohl ist es Best Practice, einen abzuschließen (kostenlos über GitHub Business Terms).

**Quellen:**
- [opr.vc: GitHub Pages Muster-DSE](https://opr.vc/docs/hosting/github_pages/)
- [GitHub Docs: Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)

---

## 7. Datenschutzerklärung — Mindestinhalt für diese Website

Basierend auf Anforderungen der LDI NRW und DSGVO Art. 13:

### Pflichtabschnitte

1. **Verantwortliche Person** — Name, Adresse, E-Mail
2. **Hosting / Server-Logfiles** — GitHub Pages, Datenarten, Rechtsgrundlage (Art. 6 I f), Speicherdauer
3. **Kontaktformular** — Datenarten (Name, E-Mail, Nachricht), Rechtsgrundlage (Art. 6 I b/f), keine Weitergabe, Speicherdauer
4. **Keine Tracking-Cookies** — klare Aussage, kein Banner nötig
5. **Externe Schriften** — wenn Fonts lokal: „Google Fonts werden lokal eingebunden, kein Kontakt zu Google-Servern"
6. **Betroffenenrechte** — Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch (Art. 15–21 DSGVO)
7. **Beschwerderecht** — Hinweis auf zuständige Aufsichtsbehörde (Landesbeauftragter für Datenschutz des jeweiligen Bundeslandes)

### Was als Floskel wirkungslos / gefährlich ist

- **„Wir nehmen Datenschutz sehr ernst"** — bedeutungslos, keine rechtliche Wirkung
- **„Wir geben keine Daten weiter"** (pauschal) — ungenau; Hostingdienst ist technisch Empfänger
- **Fehlende Rechtsgrundlage** — jede Verarbeitung braucht eine Art. 6 DSGVO-Grundlage
- **„Wir löschen Daten, sobald sie nicht mehr benötigt werden"** ohne konkrete Zeitangabe — zu vage
- Generierte Texte unverändert übernehmen — z. B. mit falschen Diensten/Tools, die man gar nicht nutzt

### Was konkret/präzise sein muss

- Name und Adresse des Verantwortlichen (korrekt, aktuell)
- Exakte Liste genutzter Drittdienste (kein Dienst mehr, aber auch keiner weniger)
- Konkrete Speicherfristen (z. B. „Serverlogfiles werden nach 30 Tagen gelöscht")
- Korrekte Rechtsgrundlagen (Art. 6 I lit. a/b/c/f DSGVO)
- Aktueller Kontakt zur Aufsichtsbehörde mit URL

**Quellen:**
- [LDI NRW: Muster für Datenschutzhinweise](https://www.ldi.nrw.de/datenschutz/medien-und-technik/websites-muster-fuer-datenschutzhinweise)
- [eRecht24: DSE Kontaktformular](https://www.e-recht24.de/dsg/12687-kontaktformular.html)

---

## 8. Bewertung der gängigen Generatoren

### datenschutz-generator.de (Dr. Thomas Schwenke)

**Kostenlos für:** Privatpersonen und Unternehmen mit Jahresumsatz unter 5.000 € (mit Pflichtlink)  
**Premium:** 99,90 € einmalig (netto), 1 Jahr Updates, über 800 Textbausteine

**Vorteile:**
- Renommierter Datenschutzanwalt als Autor (Dr. jur. Thomas Schwenke, LL.M.)
- LG Rostock 2020: Vollständigkeit der generierten Texte gerichtlich bestätigt
- Über 500.000 Nutzer
- Spezialisiert auf DSGVO, sehr viele Dienst-Module
- Aktuelle Updates bei Gesetzesänderungen (in Bezahlversion)

**Nachteile:**
- Kostenlos nur mit Pflichtlink auf den Generator (für professionellen Auftritt suboptimal)
- Generierte Texte müssen auf tatsächlich genutzte Dienste angepasst werden
- Gefahr: Standard-Template mit Services befüllt, die man nicht nutzt

**Empfehlung für sven-maibaum.com:** Kostenversion nutzbar — der Pflichtlink ist bei einer privaten Site kein echtes Problem. Alternativ Premium kaufen (einmalig).

### eRecht24 (Sören Siebert)

**Kostenlos:** Sehr eingeschränkte Basisversion  
**Bezahlung:** 15–25 €/Monat (Abo, jährlich günstiger), über 190 Textbausteine

**Vorteile:**
- Sehr bekannte, etablierte Plattform
- Über 10 Jahre am Markt, regelmäßige Updates
- Gute Nutzerführung
- Kombination aus Generator + Rechtsinfos

**Nachteile:**
- Abo-Modell (laufende Kosten)
- Für eine einfache private Portfolio-Site überdimensioniert und teuer
- Kostenlose Version sehr limitiert

**Empfehlung:** Nur sinnvoll wenn man ohnehin regelmäßig Updates und viele Features braucht. Für Privatperson weniger geeignet als Schwenke-Einmalkauf.

### IHK-Generatoren

**Kosten:** Kostenlos

**Vorteile:**
- Behördliche Legitimität
- Kostenlos und ohne Pflichtlinks

**Nachteile:**
- Teilweise nicht auf dem aktuellsten Stand (TMG-Bezüge können noch drin sein)
- Weniger Anpassungsoptionen
- Unterschiedliche Qualität je nach IHK

**Empfehlung:** Nur als Ausgangspunkt nutzbar, manuelle Prüfung und Anpassung zwingend.

### adsimple.de / impressum-generator.de

**Kosten:** Kostenlos

**Vorteile:**
- Kostenlos
- Schnell

**Nachteile:**
- Qualität nicht anwaltlich zertifiziert
- Texte können veraltet sein

**Empfehlung:** Nicht für eine rechtssichere Basis verwenden.

### Was man bei jedem Generator manuell prüfen/anpassen muss

1. Nur die Dienste auflisten, die tatsächlich eingesetzt werden
2. Gesetzesbezüge auf Aktualität prüfen (TDDDG statt TTDSG, DDG statt TMG)
3. Korrekte Aufsichtsbehörde eintragen (abhängig vom Wohnort)
4. Speicherfristen konkret ausfüllen (keine Platzhalter lassen)
5. Hoster-Abschnitt anpassen (GitHub Pages, nicht generisch „Webhosting")
6. Kontaktformular-Abschnitt hinzufügen, wenn nicht automatisch generiert

---

## 9. Spezialisierte Abmahnkanzleien / -organisationen (aktiv 2024–2026)

### Struktur nach UWG-Reform

Seit der Reform des § 8c UWG müssen abmahnberechtigte Verbände und Vereine im **Verbandsklageregister** des Bundesjustizministeriums eingetragen sein (Nachweis struktureller, personeller und finanzieller Anforderungen).

### Bekannte Akteure (nicht vollständig)

- **Wettbewerbszentrale** (Zentrale zur Bekämpfung unlauteren Wettbewerbs e. V.) — seriöse Organisation, fokussiert hauptsächlich auf Wettbewerb/Werbung, weniger auf reine Datenschutzformalien
- **Verbraucherzentrale Bundesverband (vzbv)** — seit BGH 27.03.2025 legitimiert für DSGVO-Klagen
- **CLAIM Rechtsanwaltsgesellschaft mbH** — aktiv bei BFSG-Abmahnungen seit Sommer 2025 (massenhaft)
- Diverse Einzelanwälte, die für Mandanten automatisiert scannen

### Schutzmechanismus: § 13 Abs. 4 Nr. 2 UWG

Bei DSGVO-Verstößen gilt: Mitbewerber **müssen eigene Anwaltskosten tragen**, wenn das abgemahnte Unternehmen **weniger als 250 Mitarbeiter** hat. Das dämpft den finanziellen Anreiz für Massenabmahnungen gegen Kleinstunternehmen und Privatpersonen erheblich.

**Quellen:**
- [IT-Recht Kanzlei: Überblick abmahnfähige Vereine](https://www.it-recht-kanzlei.de/ueberblick-abmahnfaehige-vereine-verbaende.html)
- [masedo.de: Erste BFSG-Abmahnungen](https://www.masedo.de/erste-bfsg-abmahnungen/)

---

## 10. Vorbildliche Referenz-Portfolios (deutsche Entwickler/Freiberufler)

**Methodischer Hinweis:** Die Recherche ergab keine offensichtlich herausragenden Vorbilder aus dem deutschsprachigen Entwickler-Bereich — die meisten Portfolio-Sites haben entweder veraltete Datenschutzseiten oder nutzen externe Tools (Google Analytics), die eine Cookie-Banner-Pflicht auslösen. Die besten Annäherungen:

### portfolio-klw.de
- URL: [https://portfolio-klw.de/datenschutz/](https://portfolio-klw.de/datenschutz/)
- Strukturierte DSE mit Inhaltsverzeichnis
- Klare Abschnitte zu Hosting, Kontakt, Rechten
- Kein Tracking erwähnt

### Nina Schiller (Design-Portfolio)
- URL: [https://ninaschiller-design.de/datenschutz](https://ninaschiller-design.de/datenschutz)
- Schlichtes Design, vollständige DSE ohne Ballast
- Von Dr. Schwenke-Generator generiert (erkennbar am Stil)

### Fabian Schneider (Entwickler-Portfolio, Österreich)
- URL: [https://fabianschneider.net/impressum-und-datenschutz](https://fabianschneider.net/impressum-und-datenschutz)
- Impressum und DSE auf einer Seite — für kleine Portfolios praktisch
- Transparente Angaben zu Adobe Portfolio, Google Analytics (mit IP-Anonymisierung), Google Fonts (mit Opt-out-Hinweis)
- **Anmerkung:** Nutzt Google Analytics — für sven-maibaum.com nicht empfehlenswert (löst Cookie-Banner-Pflicht aus)

### Empfehlung als Maßstab

Das beste Muster für eine **minimalistische, risikoarme Portfolio-DSE** folgt diesem Prinzip:
1. Verantwortlicher klar benannt
2. Hosting transparent (GitHub Pages + USA-Transfer + SCCs)
3. Kontaktformular erklärt
4. „Keine Tracking-Tools, keine Cookies außer technisch notwendigen"
5. Fonts lokal: explizit erwähnen
6. Betroffenenrechte vollständig
7. Aufsichtsbehörde mit aktuellem Link

---

## 11. Checkliste: Schutzmaßnahmen für sven-maibaum.com

### Impressum

- [ ] Vollständiger Name (Vor- und Nachname)
- [ ] Ladungsfähige Anschrift (Wohn- oder c/o-Adresse)
- [ ] E-Mail-Adresse
- [ ] Telefonnummer
- [ ] Kein Verweis auf „§ 5 TMG" — stattdessen stillschweigend oder auf DDG
- [ ] Von jeder Seite mit 1 Klick erreichbar (Footer-Link „Impressum")

### Datenschutzerklärung

- [ ] Verantwortliche Person vollständig benannt
- [ ] Abschnitt Hosting: GitHub Inc., USA, SCCs, Art. 6 I f DSGVO
- [ ] Abschnitt Kontaktformular: Datenarten, Rechtsgrundlage, Speicherdauer
- [ ] Aussage: keine Tracking-Cookies, kein Analytics
- [ ] Aussage: Google Fonts werden lokal eingebunden (kein Google-Kontakt)
- [ ] Betroffenenrechte Art. 15–21 DSGVO aufgelistet
- [ ] Beschwerderecht + zuständige Aufsichtsbehörde mit URL
- [ ] Von jeder Seite mit 1 Klick erreichbar (Footer-Link „Datenschutz")
- [ ] Texte aktualisiert: TDDDG (nicht TTDSG), DDG (nicht TMG)

### Technisch

- [ ] Google Fonts lokal eingebunden (kein externer Aufruf)
- [ ] Keine externen Scripts ohne Einwilligung geladen
- [ ] Kein Google Analytics / Tracking
- [ ] SSL/HTTPS aktiv (GitHub Pages: standardmäßig aktiv)
- [ ] Kontaktformular: keine Daten an Dritte, sichere Übertragung

### Optional / Nice-to-Have

- [ ] Automatischer Compliance-Scan: [Abmahn-Shield](https://abmahn-shield.de/) (kostenlos, 60-Sekunden-Check)
- [ ] Grundlegende Barrierefreiheit (BFSG-Ausnahme greift, aber schadet nicht): alt-Tags auf Bilder, gute Kontraste

---

## 12. Generatoren-Empfehlung für sven-maibaum.com

**Empfohlenes Vorgehen:**

1. **datenschutz-generator.de** (Dr. Schwenke) — Kostenversion für Privatperson nutzen
   - Module auswählen: Hosting (manuell GitHub Pages eintragen), Kontaktformular
   - **Nicht auswählen:** Google Analytics, Social Media, Newsletter, externe Dienste
   - Pflichtlink auf Generator im Footer akzeptieren (oder 99,90 € Premium)

2. **Für Impressum:** eRecht24 Impressum-Generator (kostenlos, kein Abo für Impressum)
   - [https://www.e-recht24.de/impressum-generator.html](https://www.e-recht24.de/impressum-generator.html)

3. **Beide Texte manuell prüfen:**
   - Alle Felder ausgefüllt (keine Platzhalter)
   - GitHub Pages Hosting-Abschnitt korrekt
   - Keine nicht genutzten Dienste erwähnt
   - Gesetzesbezüge aktuell

---

## Quellenverzeichnis (alle URLs)

- [gesetz-digitale-dienste.de](https://gesetz-digitale-dienste.de/)
- [IT-Recht Kanzlei: TMG/DDG Handlungsbedarf](https://www.it-recht-kanzlei.de/tmg-ttdsg-ausser-kraft-impressum-datenschutz.html)
- [eRecht24: TMG wird DDG](https://www.e-recht24.de/news/datenschutz/13296-webseitenbetreiber-aufgepasst-das-tmg-wird-zum-digitale-dienste-gesetz-aktualisieren-sie-jetzt-ihr-impressum.html)
- [eRecht24: Impressum private Homepage](https://www.e-recht24.de/impressum/13095-impressum-fuer-die-private-homepage.html)
- [eRecht24: Impressum für Freiberufler](https://www.e-recht24.de/impressum/13480-impressum-fuer-freiberufler.html)
- [eRecht24: DSGVO-Abmahnungen](https://www.e-recht24.de/datenschutz/11125-dsgvo-datenschutz-abmahnungen.html)
- [eRecht24: TDDDG](https://www.e-recht24.de/datenschutz/12834-tdddg.html)
- [eRecht24: DSE Kontaktformular](https://www.e-recht24.de/dsg/12687-kontaktformular.html)
- [eRecht24: DSE private Website](https://www.e-recht24.de/datenschutz/13237-datenschutzerklaerung-private-website.html)
- [IT-Anwalt-Kanzlei: BGH 2025 DSGVO abmahnbar](https://www.it-anwalt-kanzlei.de/bgh-urteil-2025-dsgvo-verstoesse-sind-abmahnbar)
- [activeMind.legal: BGH Abmahnrecht](https://www.activemind.legal/de/guides/urteil-abmahnrecht/)
- [Kanzlei Kramarz: BGH DSGVO Abmahnung](https://kanzlei-kramarz.de/bgh-urteil-dsgvo-verstoesse-sind-abmahnfaehig-neue-klagebefugnis-fuer-mitbewerber-und-verbaende/)
- [WBS.legal: EuGH DSGVO Schadensersatz gestärkt](https://www.wbs.legal/it-und-internet-recht/datenschutzrecht/zwei-wichtige-eugh-entscheidungen-recht-auf-dsgvo-schadensersatz-erneut-massiv-gestaerkt-79665/)
- [CMS HS Bloggt: EuGH DSGVO Schadensersatz Update](https://www.cmshs-bloggt.de/tmc/datenschutzrecht/neues-vom-eugh-zum-dsgvo-schadensersatz/)
- [Shopbetreiber-Blog: BGH legt EuGH Google Fonts vor](https://shopbetreiber-blog.de/eugh-muss-entscheiden-bgh-legt-fragen-zu-google-fonts-abmahnungen-vor)
- [heise online: Google Fonts BGH ECJ](https://www.heise.de/en/news/Google-Fonts-Warning-Wave-BGH-Sends-IP-Questions-to-ECJ-11136736.html)
- [datenschutz-generator.de: Google Fonts Abmahnungen](https://datenschutz-generator.de/abmahnungen-google-fonts/)
- [datenschutz-generator.de: Cookies/TDDDG](https://datenschutz-generator.de/tdddg-cookies/)
- [datenschutz-generator.de (Generator)](https://datenschutz-generator.de/)
- [LDI NRW: Muster Datenschutzhinweise](https://www.ldi.nrw.de/datenschutz/medien-und-technik/websites-muster-fuer-datenschutzhinweise)
- [opr.vc: GitHub Pages Datenschutz Muster](https://opr.vc/docs/hosting/github_pages/)
- [GitHub Docs: General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [IT-Recht Kanzlei: Abmahnfähige Vereine](https://www.it-recht-kanzlei.de/ueberblick-abmahnfaehige-vereine-verbaende.html)
- [masedo.de: Erste BFSG-Abmahnungen](https://www.masedo.de/erste-bfsg-abmahnungen/)
- [digitalsprung: Cookie-Banner Pflicht 2025](https://digitalsprung.de/blog/cookie-banner-pflicht-2025-so-verwandelst-du-das-pop-up-in-ein-vertrauenssignal)
- [Abmahn-Shield: Kostenloser Scan](https://abmahn-shield.de/)
- [impressum-generator.de: Privatperson](https://impressum-generator.de/impressumspflicht-private-homepage)
- [eRecht24: Impressum Generator](https://www.e-recht24.de/impressum-generator.html)
- [IT-Recht Kanzlei: Abmahnradar September 2025](https://www.it-recht-kanzlei.de/abmahnradar-zusammenfassung-september.html)
- [Händlerbund: Abmahnungen Juli 2025](https://www.haendlerbund.de/de/news/aktuelles/abmahnungen-juli-2025)
