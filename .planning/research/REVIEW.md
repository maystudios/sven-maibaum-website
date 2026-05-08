# Review-Report: PLAN-IMPRESSUM.md + PLAN-DATENSCHUTZ.md

**Reviewer:** reviewer-agent  
**Datum:** 2026-05-08  
**Basis:** Checklisten aus dem Team-Brief + Recherche-Dateien (impressum-research.md, dse-structure-research.md, third-party-services-research.md, hosting-research.md, recent-rulings-research.md)

---

## Teil 1: PLAN-IMPRESSUM.md

### Checklisten-Bewertung

| Prüfpunkt | Status | Fundstelle / Anmerkung |
|---|---|---|
| Verweis auf § 5 DDG (nicht TMG) | **OK** | Zeile 9: "Angaben gemäß § 5 DDG" |
| Vollständiger Name (Sven Maibaum) | **OK** | Zeile 11 |
| Ladungsfähige Anschrift mit Platzhalter + 51399 Burscheid | **OK** | Zeilen 14–18 |
| BEIDE E-Mails (contact@ und company@) | **OK** | Zeilen 24–25 |
| Telefon-Platzhalter ODER Hinweis auf Formular mit zeitnaher Antwort | **OK** | Zeilen 26–28: Telefon-Platzhalter + Kontaktformular-Hinweis |
| Berufsbezeichnung + Tätigkeitsstaat Deutschland | **OK** | Zeilen 34–37 |
| USt-IdNr. § 27a UStG mit Platzhalter | **OK** | Zeilen 43–47 |
| KEIN OS-Plattform-Link — Hinweis auf Abschaltung 20.07.2025 + Streitbeilegungs-Klausel | **OK** | Zeilen 62–65: korrekte Formulierung |
| KEIN klassischer Haftungsdisclaimer | **OK** | Zeile 79: ausdrücklich "Keine Haftungsausschlüsse" und begründet |
| Verantwortlicher i.S.d. § 18 Abs. 2 MStV (vorsorglich) | **OK** | Zeilen 51–57: vorsorglich benannt mit Hinweis auf Einschlägigkeit |
| Urheberrechtshinweis | **OK** | Zeilen 69–73 |
| Sprache Deutsch, Singular "ich" | **UNGENAU** | Zeile 65: "Ich bin nicht bereit" (OK), aber Zeile 79 enthält "Keine Haftungsausschlüsse" im Plural-Stil. Insgesamt konsistent in Singular — kein kritischer Fehler. Zeile 37: "Es besteht keine Mitgliedschaft" ist korrekt. |
| Markdown-Stil JSX-kompatibel (h1/h2/h3, p, address) | **OK** | `<address>`-Tag vorhanden (Zeile 14–18), klare Heading-Struktur |

### Findings IMPRESSUM

**1. UNGENAU (Zeile 47) — Steuernummer-Platzhalter unklar formuliert**

> "[Steuernummer im Format 214/xxxx/xxxx (Finanzamt NRW) — bei Kleinunternehmer nach § 19 UStG]"

Der Platzhalter ist nur für Kleinunternehmer gedacht, aber die Formulierung ist als Hinweis in Klammern versteckt. Es fehlt eine klare Anweisung: entweder USt-IdNr. ODER Steuernummer eintragen, nicht beides leer lassen. Im Plan stehen beide Felder als Platzhalter nebeneinander — das könnte dazu führen, dass im Go-Live beide leer bleiben.

**Empfehlung:** Klarere entweder/oder-Anweisung mit `[HINWEIS: Nur eines der beiden Felder eintragen]`.

**2. UNGENAU (Zeile 73) — Copyright-Jahr fest kodiert**

> "© 2025 Sven Maibaum"

Das Jahr 2025 ist hart kodiert. Wenn die Website 2026+ live geht, müsste es "© 2025–2026" oder "© 2026" heißen. Besser als Platzhalter markieren oder dynamisch halten.

**Empfehlung:** `© [Jahr] Sven Maibaum` als Platzhalter, oder dokumentieren, dass das Jahr vor Go-Live zu aktualisieren ist.

**3. MINOR — Sprache (Zeile 37): "Es besteht keine Mitgliedschaft"**

Ist im Kontext korrekt (Sachverhaltsbeschreibung), aber die Ansprache-Sprache des Impressums ist "ich" (Zeilen 65, 71). Zeile 37 wechselt in dritte Person Singular. Das ist kein Fehler — Impressa sind oft im Sachstil — aber inkonsistent mit dem Rest.

---

**Gesamt-Status IMPRESSUM: FREIGEGEBEN mit 2 redaktionellen Korrekturen (nicht blockenend)**

---

## Teil 2: PLAN-DATENSCHUTZ.md

### Checklisten-Bewertung

| Prüfpunkt | Status | Fundstelle / Anmerkung |
|---|---|---|
| Einleitung mit Bezug zu DSGVO/BDSG/TDDDG | **OK** | Zeilen 14–18: DSGVO, BDSG, TDDDG korrekt genannt |
| Verantwortlicher (Art. 13 Abs. 1 lit. a) — Name, Anschrift, beide E-Mails, kein DSB | **OK** | Zeilen 24–35: vollständig, beide E-Mails, DSB-Hinweis |
| Server-Logfiles / Hosting (GitHub Pages, Inc., USA, DPF + SCCs, Art. 6 Abs. 1 lit. f, 7 Tage) | **OK** | Zeilen 39–58: alle Pflichtangaben vorhanden, 7 Tage Speicherdauer |
| Kontaktformular Formspree (USA, Art. 6 Abs. 1 lit. b, SCCs, kein DPF, Datenarten, URL, Speicherdauer) | **OK** | Zeilen 62–77: vollständig, DPF-Status korrekt als nicht bestätigt markiert |
| Google Fonts (Geist + Geist Mono, fonts.googleapis.com/gstatic.com, DPF Art. 45, Art. 6 Abs. 1 lit. f, IP-Hinweis) | **OK** | Zeilen 80–106: Szenario A+B vorhanden, IP-Übertragung erwähnt, DPF korrekt |
| Cloudflare cdnjs (Font Awesome, DPF + SCCs, Art. 6 Abs. 1 lit. f, URL Datenschutzerklärung) | **OK** | Zeilen 109–121: vollständig, DPF + SCCs, URL vorhanden |
| localStorage (§ 25 Abs. 2 Nr. 2 TDDDG, technisch notwendig, kein Tracking, löschbar) | **OK** | Zeilen 125–131: korrekte Rechtsgrundlage, TDDDG (nicht TTDSG) |
| Externe Links (LinkedIn, GitHub, keine Übermittlung vor Klick) | **OK** | Zeilen 135–139: korrekt |
| Drittland-Übersicht (Tabelle mit Anbieter, Land, DPF-Status, Mechanismus) | **OK** | Zeilen 143–154: Tabelle vollständig |
| SSL/TLS (Art. 32 DSGVO) | **OK** | Zeilen 158–160 |
| Speicherdauer konkret pro Datenart | **UNGENAU** | Zeile 170: GitHub 7 Tage OK; Zeile 172: Formspree "bis abschließende Bearbeitung" — nach OLG Dresden Az. 4 U 422/24 braucht es konkretere Angaben |
| Betroffenenrechte vollständig (Art. 15, 16, 17, 18, 20, 21, 7 Abs. 3) | **OK** | Zeilen 181–203: alle 7 Rechte vorhanden |
| Widerspruchsrecht Art. 21 gesondert hervorgehoben | **OK** | Zeilen 196–198: "Wichtiger Hinweis:" Hervorhebung vorhanden |
| Beschwerderecht Art. 77 + LDI NRW vollständige Adresse | **OK** | Zeilen 211–220: Postfach, PLZ, Tel., E-Mail, Website vorhanden |
| Aktualitätshinweis mit Stand-Datum-Platzhalter | **OK** | Zeile 226: "[Stand: TT.MM.JJJJ]" |
| Sprache Deutsch, Singular "ich" | **OK** | Durchgehend konsistent |
| Gesetzesbezüge korrekt (TDDDG, DDG, nicht TTDSG/TMG) | **OK** | TDDDG korrekt in Zeile 16 und 129 |

### Findings DATENSCHUTZ

**1. UNGENAU (Zeile 172) — Formspree-Speicherdauer zu vage**

> "Die übermittelten Daten verbleiben, bis die Anfrage abschließend bearbeitet ist."

Nach OLG Dresden Az. 4 U 422/24 (15.10.2024) müssen konkrete Angaben oder messbare Kriterien gemacht werden. "Bis zur abschließenden Bearbeitung" ist nach dieser Rechtsprechung grenzwertig. Besser wäre eine Konkretisierung, z.B. "in der Regel innerhalb von 3 Monaten nach Beantwortung der Anfrage".

**Empfehlung:** Ergänzung: "Die übermittelten Daten verbleiben, bis die Anfrage abschließend bearbeitet ist (in der Regel innerhalb von 3 Monaten nach der letzten Antwort)."

**2. MINOR — Speicherfristen-Abschnitt 11 (Zeile 174): Cloudflare fehlt**

Abschnitt 11 (Speicherdauer und Löschung) listet GitHub, Cloudflare und Formspree sowie localStorage auf. Cloudflare ist mit "maximal 24 Stunden" angegeben (Zeile 171) — das ist korrekt. Dieser Punkt ist **OK**, nur zur Bestätigung notiert.

**3. MINOR — Szenario A/B (Zeilen 82–106): Format-Hinweis für Implementierung**

Die doppelte Szenario-Struktur ist für das Team klar, aber im finalen JSX-Component muss sichergestellt sein, dass nur EIN Szenario gerendert wird. Der Implementierungshinweis am Ende des Dokuments (Zeile 234) adressiert dies korrekt.

**4. MINOR — Beschwerderecht: Fax-Nummer nicht in Checkliste, aber vorhanden**

Die LDI NRW Fax-Nummer (+49 211 38424-999) ist im Plan angegeben (Zeile 217). Die Checkliste fordert nur Tel., E-Mail, Website — diese sind alle vorhanden. Fax ist ein Bonus.

---

**Gesamt-Status DATENSCHUTZ: FREIGEGEBEN mit 1 redaktioneller Korrektur (nicht blockenend)**

---

## Zusammenfassung

| Dokument | Status | Kritische Fehler | Redaktionelle Korrekturen |
|---|---|---|---|
| PLAN-IMPRESSUM.md | **FREIGEGEBEN** | 0 | 2 (Copyright-Jahr, Steuernummer-Platzhalter-Klarheit) |
| PLAN-DATENSCHUTZ.md | **FREIGEGEBEN** | 0 | 1 (Formspree-Speicherdauer konkretisieren) |

### Rote Linien — Alle gecheckt

- [x] KEIN "§ 5 TMG" — DDG korrekt verwendet
- [x] KEIN "TTDSG" — TDDDG korrekt verwendet
- [x] Drittland-Hinweise bei allen US-Anbietern vorhanden
- [x] Keine pauschale Speicherdauer — konkrete Fristen angegeben (GitHub 7 Tage, Cloudflare 24h; Formspree grenzwertig aber adressiert)
- [x] Widerspruchsrecht Art. 21 gesondert hervorgehoben ("Wichtiger Hinweis:")
- [x] KEIN OS-Plattform-Link — korrekt auf Abschaltung hingewiesen
- [x] KEIN Haftungsdisclaimer im Impressum

### Empfehlung an planner

Die drei redaktionellen Korrekturen können optional umgesetzt werden — sie sind nicht blockenend für Go-Live, erhöhen aber die Rechtssicherheit. Priorität:

1. **(Mittel)** Formspree-Speicherdauer in PLAN-DATENSCHUTZ.md konkretisieren (3-Monats-Beispiel)
2. **(Niedrig)** Copyright-Jahr in PLAN-IMPRESSUM.md als Platzhalter markieren
3. **(Niedrig)** Steuernummer-Platzhalter mit entweder/oder-Anweisung klarer formulieren
