# DSGVO-Recherche: Drittdienste auf www.sven-maibaum.com

**Stand:** Mai 2026  
**Zweck:** Rechtssichere Datenschutzerklärung für alle aktiven Drittdienste

---

## Allgemeiner Kontext: EU-US Data Privacy Framework (DPF)

### Was ist das DPF?
Das EU-US Data Privacy Framework trat am 10. Juli 2023 in Kraft (Angemessenheitsbeschluss der EU-Kommission C(2023) 4745). Es erlaubt die Übermittlung personenbezogener Daten aus der EU in die USA, sofern der US-Empfänger DPF-zertifiziert ist – ohne dass zusätzliche Garantien (Standardvertragsklauseln, Einwilligung) erforderlich sind.

### Wie prüft man die DPF-Zertifizierung?
Offizielle Teilnehmerliste: https://www.dataprivacyframework.gov/s/participant-search

### Wenn ein Anbieter NICHT DPF-zertifiziert ist
Gemäß Art. 44–49 DSGVO sind folgende Grundlagen möglich:
1. **Standardvertragsklauseln (SCCs)** – aktuell gültige Fassung der EU-Kommission (2021), in Verbindung mit einem Transfer Impact Assessment (TIA)
2. **Einwilligung** (Art. 49 Abs. 1 lit. a DSGVO) – nur für nicht-regelmäßige Transfers, keine Dauerlösung
3. **Vertragserfüllung** (Art. 49 Abs. 1 lit. b DSGVO) – wenn der Transfer zur Erfüllung eines Vertrages mit der betroffenen Person notwendig ist

### Pflichtangaben in der DSE bei Drittlandtransfer
Die Datenschutzerklärung muss enthalten (Art. 13/14 i.V.m. Art. 44 ff. DSGVO):
- Name und Sitz des US-Anbieters
- Kategorie der übermittelten Daten
- Zweck der Übermittlung
- Drittland (USA)
- Schutzmaßnahme: DPF-Angemessenheitsbeschluss ODER SCCs
- Link zur Datenschutzerklärung des Anbieters

### Risiko DPF-Stabilität
Das DPF ist politisch fragil. Privacy Shield (2016) wurde 2020 durch „Schrems II" (EuGH C-311/18) gekippt, Safe Harbor (2000) wurde 2015 durch „Schrems I" gekippt. Max Schrems' Organisation NOYB hat bereits Klage angekündigt. Ein erneuter Wegfall des DPF ist nicht auszuschließen. **Empfehlung:** Drittdienste mit US-Hosting nach Möglichkeit durch EU-Alternativen oder lokales Hosting ersetzen.

---

## 1. Formspree (formspree.io)

### Anbieter-Steckbrief

| Merkmal | Detail |
|---|---|
| **Anbieter** | Formspree, Inc. |
| **Sitz** | Boston, Massachusetts, USA |
| **Zweck auf der Website** | Verarbeitung von Kontaktformular-Einreichungen; leitet Formularinhalte per E-Mail weiter |
| **Form-Endpoint** | `https://formspree.io/f/xvgrpazj` |
| **Verarbeitete Datenarten** | Name, E-Mail-Adresse, Nachrichteninhalt (Formulardaten); technisch: IP-Adresse, Browser-Typ, Zeitstempel |
| **Server-Hosting** | Amazon Web Services (AWS), USA |
| **DPF-Zertifizierung** | **Nicht bestätigt** – kein Hinweis auf DPF-Zertifizierung in Privacy Policy oder Security-Seite (Stand Mai 2026). Muss auf dataprivacyframework.gov geprüft werden. |
| **Drittlandtransfer** | Ja – Datenverarbeitung in USA (AWS) |
| **Schutzmaßnahme** | **Standardvertragsklauseln (SCCs)** – Formspree stützt sich als Datenverarbeiter auf SCCs (laut Security-Seite) |
| **AVV (Art. 28 DSGVO)** | **Prüfpflichtig** – kein öffentliches DPA-Dokument bekannt; muss bei Formspree unter security@formspree.io angefragt werden |
| **Sonstige Zertifizierungen** | SOC 2 Type II |

### Rechtsgrundlage
- **Art. 6 Abs. 1 lit. b DSGVO** (Vertragsanbahnung / Durchführung vorvertraglicher Maßnahmen), wenn der Nutzer das Kontaktformular im eigenen Interesse (z.B. Anfrage zu einer Dienstleistung) ausfüllt
- Alternativ: **Art. 6 Abs. 1 lit. f DSGVO** (berechtigtes Interesse), wenn kein klarer Vertragsbezug besteht – dann muss das Interesse überwiegen und eine Interessenabwägung dokumentiert werden
- Für die Weitergabe an Formspree als Auftragsverarbeiter: **Art. 28 DSGVO** (Auftragsverarbeitungsvertrag erforderlich)

### AVV-Pflicht
Ja – Formspree verarbeitet personenbezogene Daten im Auftrag. Ein AVV gemäß Art. 28 DSGVO ist zwingend abzuschließen. Kontakt: security@formspree.io

### Handlungsempfehlung
1. **AVV abschließen** – sofort bei Formspree anfragen
2. **DPF-Status prüfen** – dataprivacyframework.gov durchsuchen (Formspree, Inc.)
3. Falls kein DPF: SCCs als Transfermechanismus dokumentieren und ggf. TIA erstellen
4. **Alternative erwägen:** EU-basierte Formdienstleister (z.B. Basin, Netlify Forms, selbst gehostetes Backend) zur Vermeidung des US-Transfers

### Fertiger DSE-Mustertext (deutsch)

```
Einsatz von Formspree (Kontaktformular)

Für die Verarbeitung von Kontaktanfragen über das Formular auf unserer Website nutzen wir den 
Dienst Formspree der Formspree, Inc. (Sitz: USA).

Wenn Sie das Kontaktformular ausfüllen und absenden, werden die von Ihnen eingegebenen Daten 
(Name, E-Mail-Adresse, Nachricht) sowie technische Daten (IP-Adresse, Zeitstempel) an Server 
von Formspree in den USA übertragen und dort verarbeitet.

Rechtsgrundlage für die Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung), da 
die Verarbeitung zur Beantwortung Ihrer Anfrage erforderlich ist.

Formspree ist als unser Auftragsverarbeiter tätig; mit Formspree besteht ein 
Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.

Die Übermittlung Ihrer Daten in die USA erfolgt auf Grundlage geeigneter Garantien gemäß 
Art. 46 DSGVO (Standardvertragsklauseln der EU-Kommission). [Alternativformulierung, falls 
DPF-Zertifizierung bestätigt wird: Die Übermittlung erfolgt auf Grundlage des Angemessenheits-
beschlusses der EU-Kommission zum EU-US Data Privacy Framework (DPF), da Formspree unter dem 
DPF zertifiziert ist.]

Weitere Informationen zum Datenschutz bei Formspree finden Sie unter:
https://formspree.io/legal/privacy-policy/
```

---

## 2. Google Fonts (CDN-Variante via fonts.googleapis.com / fonts.gstatic.com)

### Anbieter-Steckbrief

| Merkmal | Detail |
|---|---|
| **Anbieter** | Google LLC (Alphabet Inc.) |
| **Sitz** | 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA; EU-Niederlassung: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland |
| **Zweck** | Auslieferung von Web-Schriftarten über Google-Server |
| **Verarbeitete Datenarten** | IP-Adresse des Besuchers, Browser-Typ, Referrer-URL, Zeitstempel |
| **DPF-Zertifizierung** | Google LLC ist DPF-zertifiziert (dataprivacyframework.gov, Stand 2025) |
| **Drittlandtransfer** | Ja (bei dynamischem Laden) – Übertragung der IP-Adresse an Google-Server in USA |

### Rechtslage: LG München I und Folgeurteile

**Urteil LG München I, 20.01.2022 (Az. 3 O 17493/20):**
- Dynamisches Laden von Google Fonts ohne Einwilligung = Verstoß gegen Art. 6 Abs. 1 DSGVO
- IP-Adresse = personenbezogenes Datum
- Kein berechtigtes Interesse des Betreibers, da Fonts auch lokal gehostet werden können
- Schadensersatz: 100 € nach Art. 82 DSGVO

**Urteil LG München I, 30.03.2023 (Az. 4 O 13063/22):**
- Bestätigt grundsätzlich das erste Urteil (dynamisches Laden ohne Einwilligung = rechtswidrig)
- Massenhafte automatisierte Abmahnungen sind **rechtsmissbräuchlich** – Ansprüche können daher abgewiesen werden
- Die **rechtliche Pflicht zur lokalen Einbindung bleibt bestehen**

**BGH-Vorlage an den EuGH (Beschluss vom 28.08.2025, Az. VI ZR 258/24):**
- BGH hat das Verfahren ausgesetzt und dem EuGH 3 Fragen zur Vorabentscheidung vorgelegt:
  1. Sind dynamische IP-Adressen bei automatischer Übertragung an US-Server „personenbezogene Daten"?
  2. Begründet ein absichtlich provozierter Datenschutzverstoß trotzdem Schadensersatz nach Art. 82 DSGVO?
  3. Greift der Einwand des Rechtsmissbrauchs bei massenhaft automatisiert erzeugten Verstößen?
- **Bis zur EuGH-Entscheidung bleibt die Rechtslage unklar.** Die Grundaussage des LG München – dynamisches Laden ohne Einwilligung ist rechtswidrig – ist jedoch nicht aufgehoben.

**Österreich (2024):** Bezirksgericht Favoriten und LG Wien stufen massenhafte automatisierte Abmahnungen als rechtsmissbräuchlich ein. Schadensersatzansprüche wurden abgewiesen.

### Empfehlung der Datenschutzbehörden und Experten (2025/2026)
**Einstimmige Empfehlung: Lokales Hosting (Self-Hosting)**
- Google erhält keine Besucherdaten
- Kein Drittlandtransfer
- Keine Einwilligung erforderlich
- Kein Hinweis in der DSE auf Google Fonts nötig
- Technische Umsetzung: google-webfonts-helper.herokuapp.com / gwfh.mranftl.com oder Fontsource (npm)

**Lösung 2: Einwilligung via Cookie-Banner**
- Google Fonts erst nach expliziter Zustimmung laden
- Technisch aufwändiger; erzeugt „Flash of Unstyled Text" (FOUT)
- Nur wenn lokales Hosting nicht möglich

### Kritische Prüfung für www.sven-maibaum.com
Das Projekt nutzt `Space Grotesk` und `Archivo` (laut CLAUDE.md / tailwind.config.js). Diese Fonts müssen geprüft werden:
- Werden sie derzeit über `fonts.googleapis.com` oder lokal geladen?
- Falls dynamisch: **sofort auf lokales Hosting umstellen**

### DSE-Text: Szenario A – Fonts werden LOKAL gehostet (empfohlen)
```
Schriftarten

Wir verwenden auf unserer Website die Schriftarten „Space Grotesk" und „Archivo". Diese 
Schriftarten werden ausschließlich von unserem eigenen Webserver geladen. Es findet keine 
Verbindung zu Servern von Google oder anderen Drittanbietern statt. Es werden dabei keine 
personenbezogenen Daten an Dritte übermittelt.
```
(Hinweis: Bei ausschließlich lokalem Hosting ist kein separater Abschnitt zu Schriftarten in der DSE zwingend erforderlich – der obige Text kann zur Klarstellung dennoch sinnvoll sein.)

### DSE-Text: Szenario B – Fonts werden DYNAMISCH von Google geladen (nur mit Einwilligung zulässig)
```
Google Fonts

Unsere Website verwendet Schriftarten des Dienstes Google Fonts der Google LLC, 1600 
Amphitheatre Parkway, Mountain View, CA 94043, USA (EU-Niederlassung: Google Ireland Limited, 
Gordon House, Barrow Street, Dublin 4, Irland).

Beim Aufruf unserer Website baut Ihr Browser eine Verbindung zu den Servern von Google auf, 
wodurch Ihre IP-Adresse und Informationen über Ihr Gerät an Google übermittelt werden.

Google LLC ist unter dem EU-US Data Privacy Framework (DPF) zertifiziert 
(Angemessenheitsbeschluss der EU-Kommission vom 10.07.2023, C(2023) 4745). Die Übermittlung 
Ihrer Daten in die USA ist daher auf Art. 45 DSGVO gestützt.

Rechtsgrundlage für die Einbindung ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO, 
die Sie beim ersten Besuch unserer Website erteilt haben. Sie können Ihre Einwilligung 
jederzeit mit Wirkung für die Zukunft widerrufen.

Weitere Informationen zum Datenschutz finden Sie in der Datenschutzerklärung von Google:
https://policies.google.com/privacy
```

### Aktuelle Handlungsempfehlung
**Lokales Hosten ist die einzig sichere Lösung** – unabhängig vom Ausgang des EuGH-Verfahrens. Das LG München I hat klargestellt, dass kein berechtigtes Interesse besteht, da Fonts lokal ebenso gut eingebunden werden können.

---

## 3. Cloudflare CDN (cdnjs.cloudflare.com – Font Awesome)

### Anbieter-Steckbrief

| Merkmal | Detail |
|---|---|
| **Anbieter** | Cloudflare, Inc. |
| **EU-Niederlassung** | Cloudflare Germany GmbH, Rosental 7, c/o Mindspace, 80331 München |
| **Sitz (Konzern)** | 101 Townsend St., San Francisco, CA 94107, USA |
| **Zweck auf der Website** | Auslieferung von Font-Awesome-CSS über cdnjs.cloudflare.com |
| **Verarbeitete Datenarten** | IP-Adresse, Browser-Typ, Betriebssystem, Referrer-URL, abgerufene URL, Zeitstempel |
| **DPF-Zertifizierung** | **Ja** – Cloudflare, Inc. ist zertifiziert für EU-US DPF, Swiss-US DPF und UK Extension zum EU-US DPF (bestätigt durch Cloudflare Trust Hub, Stand August 2024 / 2025) |
| **Schutzmaßnahme** | DPF-Angemessenheitsbeschluss (primär) + SCCs als Fallback (Cloudflare DPA) |
| **AVV (Art. 28 DSGVO)** | **Ja** – Cloudflare stellt ein standardisiertes Data Processing Addendum (DPA) bereit, das automatisch in die Self-Serve Subscription Agreement integriert ist. Verfügbar unter: https://www.cloudflare.com/cloudflare-customer-dpa/ |
| **Sonstige Zertifizierungen** | ISO 27001, ISO 27701, ISO 27018, SOC 2 Type II, PCI DSS Level 1 |

### Rechtsgrundlage
- **Art. 6 Abs. 1 lit. f DSGVO** (berechtigtes Interesse) – schnelle und sichere Auslieferung von Website-Ressourcen
- Für den Drittlandtransfer: **Art. 45 DSGVO** i.V.m. dem DPF-Angemessenheitsbeschluss (solange Cloudflare DPF-zertifiziert)
- Fallback: Art. 46 Abs. 2 lit. c DSGVO (Standardvertragsklauseln)

### Unterschied cdnjs vs. Cloudflare als eigener CDN-Provider
`cdnjs.cloudflare.com` ist ein **öffentlicher CDN für Open-Source-Bibliotheken**, betrieben von Cloudflare. Beim Laden von Font-Awesome-CSS über diesen Dienst gilt dieselbe datenschutzrechtliche Bewertung wie für den allgemeinen Cloudflare-Einsatz: Die IP-Adresse des Besuchers wird an Cloudflare-Server übertragen.

**Wichtiger Unterschied zu Google Fonts:**
- Cloudflare ist DPF-zertifiziert → kein zusätzliches Transferproblem (solange DPF gilt)
- Cloudflare stellt ein vollständiges DPA bereit
- Dennoch: **lokales Hosting von Font Awesome ist empfehlenswert**, um jeglichen externen Datentransfer zu vermeiden

### AVV-Pflicht
Ja – Cloudflare verarbeitet Daten im Auftrag. Das DPA ist über die Cloudflare-Website abrufbar und muss abgeschlossen werden. Für Nutzer des kostenlosen Plans gilt das Self-Serve DPA.

### Handlungsempfehlung
1. **Lokales Hosting von Font Awesome** – Font-Awesome-Dateien (CSS + Webfonts) herunterladen und vom eigenen Server ausliefern → kein Datentransfer an Cloudflare mehr
2. Falls weiterhin cdnjs genutzt wird: DPA mit Cloudflare abschließen (Self-Serve DPA), DSE-Eintrag pflegen

### Fertiger DSE-Mustertext (deutsch)

```
Cloudflare CDN (cdnjs.cloudflare.com)

Unsere Website lädt Schriftart-Icons (Font Awesome) über das Content Delivery Network (CDN) 
des Dienstes cdnjs.cloudflare.com der Cloudflare, Inc., 101 Townsend St., San Francisco, 
CA 94107, USA (EU-Niederlassung: Cloudflare Germany GmbH, Rosental 7, c/o Mindspace, 
80331 München), um die Ladegeschwindigkeit und Verfügbarkeit unserer Website zu verbessern.

Beim Laden dieser Ressourcen wird Ihre IP-Adresse sowie technische Informationen (Browser-Typ, 
Betriebssystem, Referrer-URL) automatisch an Cloudflare-Server übertragen und dort 
protokolliert.

Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer schnellen und 
sicheren Auslieferung von Website-Inhalten).

Cloudflare, Inc. ist unter dem EU-US Data Privacy Framework (DPF) zertifiziert 
(Angemessenheitsbeschluss der EU-Kommission vom 10.07.2023, C(2023) 4745). Die Daten-
übermittlung in die USA erfolgt daher auf Grundlage von Art. 45 DSGVO. Zusätzlich hat 
Cloudflare Standardvertragsklauseln (SCCs) als ergänzende Schutzmaßnahme implementiert.

Mit Cloudflare besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.

Weitere Informationen zum Datenschutz finden Sie in der Datenschutzerklärung von Cloudflare:
https://www.cloudflare.com/de-de/privacypolicy/
```

---

## Zusammenfassende Handlungsmatrix

| Dienst | Kritikalität | Sofortmaßnahme | Langfristig |
|---|---|---|---|
| **Formspree** | Hoch – kein DPF bestätigt, kein öffentliches AVV | AVV bei Formspree anfragen; DPF-Status prüfen; SCCs dokumentieren | EU-Alternative prüfen (Netlify Forms, eigenes Backend) |
| **Google Fonts (dynamisch)** | Sehr hoch – LG München Urteil, kein rechtlicher Hebel ohne Einwilligung | **Sofort auf lokales Hosting umstellen** | Fonts lokal hosten (Space Grotesk, Archivo) |
| **Cloudflare cdnjs** | Mittel – DPF-zertifiziert, DPA verfügbar | DPA abschließen, DSE-Eintrag ergänzen | Font Awesome lokal hosten |

---

## Quellen

- [Formspree Privacy Policy](https://formspree.io/legal/privacy-policy/)
- [Formspree Security Page](https://formspree.io/security/)
- [EU-US Data Privacy Framework – Offizielle Teilnehmerliste](https://www.dataprivacyframework.gov/s/participant-search)
- [EU-US Data Privacy Framework – Programmübersicht](https://www.dataprivacyframework.gov/Program-Overview)
- [eRecht24: Data Privacy Framework & Privacy Shield 2.0](https://www.e-recht24.de/datenschutz/13085-eu-us-data-privacy-framework.html)
- [datenschutz-generator.de: DPF-Erklärung](https://datenschutz-generator.de/data-privacy-framework/)
- [LG München I, Urteil 20.01.2022 (Az. 3 O 17493/20) – Datenschutz-Guru](https://www.datenschutz-guru.de/lg-munchen-i-100-schadensersatz-fur-den-einsatz-von-google-webfonts/)
- [LG München I, Urteil 30.03.2023 – Shopbetreiber-Blog](https://shopbetreiber-blog.de/2022/02/01/lg-muenchen-dynamische-nutzung-von-google-fonts-ohne-einwilligung-verstoesst-gegen-dsgvo)
- [BGH-Vorlage EuGH zu Google Fonts (Az. VI ZR 258/24) – Shopbetreiber-Blog](https://shopbetreiber-blog.de/eugh-muss-entscheiden-bgh-legt-fragen-zu-google-fonts-abmahnungen-vor)
- [BGH-Vorlage EuGH – Kanzlei Dr. Bahr](https://www.dr-bahr.com/news/dsgvo-schadensersatz-auch-bei-massenhaft-provozierter-datenschutzverstoss-google-fonts.html)
- [Google Fonts DSGVO aktueller Stand – MOLOTOW Web](https://www.molotow-web.com/blog/google-fonts-dsgvo-aktueller-stand)
- [eRecht24: Google Fonts DSGVO-konform einsetzen](https://www.e-recht24.de/artikel/datenschutz/13052-datenschutz-und-google-fonts.html)
- [Kanzlei Plutte: LG München Google Fonts](https://www.ra-plutte.de/lg-muenchen-dynamische-einbindung-google-web-fonts-ist-dsgvo/)
- [Cloudflare Trust Hub GDPR](https://www.cloudflare.com/de-de/trust-hub/gdpr/)
- [Cloudflare Privacy Policy](https://www.cloudflare.com/de-de/privacypolicy/)
- [eRecht24: Datenschutzerklärung für Cloudflare](https://www.e-recht24.de/dsg/12626-cloudflare.html)
- [opr.vc: Cloudflare Muster DSE](https://opr.vc/docs/cdn/cloudflare/)
- [adsimple: Cloudflare Datenschutzerklärung](https://www.adsimple.de/datenschutzerklaerung/cloudflare-datenschutzerklaerung/)
- [cookiebox.pro: Cloudflare DSGVO](https://www.cookiebox.pro/cookiepedia/cloudflare-dsgvo/)
- [dr-dsgvo.de: Cloudflare Datentransfers](https://dr-dsgvo.de/cloudflare-datentransfers-und-die-dsgvo/)
- [insights.casoon.de: DSGVO-konformer Einsatz von Cloudflare](https://insights.casoon.de/artikel/cloudflare-dsgvo-konform/)
