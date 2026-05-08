# DSE-Struktur-Recherche: DSGVO-konforme Datenschutzerklärung für www.sven-maibaum.com

**Stand:** Mai 2026 (Recherche auf Basis aktueller Quellen 2024/2025)  
**Website:** www.sven-maibaum.com — private Portfolio-Site, Betreiber in NRW (Burscheid)

---

## 1. Rechtlicher Rahmen: Anwendbare Gesetze

| Gesetz | Anwendungsbereich |
|--------|-------------------|
| **DSGVO** (Verordnung (EU) 2016/679) | Verarbeitung personenbezogener Daten — Kernregelung |
| **Art. 12–14 DSGVO** | Informationspflichten (Transparenz) |
| **Art. 15–22 DSGVO** | Betroffenenrechte |
| **Art. 32 DSGVO** | Datensicherheit / technisch-organisatorische Maßnahmen |
| **Art. 44–49 DSGVO** | Drittlandübermittlungen |
| **§ 25 TDDDG** (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz, vormals TTDSG) | Speicherung/Zugriff auf Endeinrichtungen (Cookies, localStorage) |
| **Art. 77 DSGVO + § 61 DSG NRW** | Beschwerderecht bei Aufsichtsbehörde |

---

## 2. Vollständige Pflicht-Struktur einer DSE

Empfohlene Abschnittsreihenfolge für eine DSGVO-konforme Datenschutzerklärung:

```
1. Allgemeines / Einleitung
2. Verantwortlicher (Art. 13 Abs. 1 lit. a DSGVO)
3. Datenschutzbeauftragter (Art. 13 Abs. 1 lit. b)  ← entfällt bei Privaten i.d.R.
4. Verarbeitungstätigkeiten im Überblick
   4.1 Server-Logfiles / Hosting
   4.2 Kontaktformular (Formspree)
   4.3 Google Fonts (externe CDN-Einbindung)
   4.4 Cloudflare CDN (cdnjs.cloudflare.com)
   4.5 localStorage (Theme-Einstellung)
   4.6 Externe Links (LinkedIn, GitHub)
5. SSL/TLS-Verschlüsselung (Art. 32 DSGVO)
6. Drittlandübermittlungen (Art. 44 ff. DSGVO)
7. Speicherdauer und Löschung (Art. 13 Abs. 2 lit. a)
8. Betroffenenrechte (Art. 15–22 DSGVO)
9. Beschwerderecht bei der Aufsichtsbehörde (Art. 77 DSGVO)
10. Aktualität und Änderungshinweis
```

---

## 3. Pflicht-Abschnitte mit Musterformulierungen

### 3.1 Allgemeines / Einleitung

**Pflicht?** Empfohlen (Art. 12 DSGVO: verständliche, transparente Information)

```markdown
## Datenschutzerklärung

Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Diese 
Datenschutzerklärung informiert Sie darüber, welche Daten bei dem Besuch dieser 
Website erhoben werden, zu welchem Zweck dies geschieht und welche Rechte Ihnen 
als betroffener Person zustehen.

Die Verarbeitung personenbezogener Daten erfolgt im Einklang mit der 
Datenschutz-Grundverordnung (DSGVO), dem Bundesdatenschutzgesetz (BDSG) sowie 
dem Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG).
```

---

### 3.2 Verantwortlicher

**Pflicht:** JA — Art. 13 Abs. 1 lit. a DSGVO (zwingend)

**Pflichtangaben:**
- Name und Anschrift der verantwortlichen Person
- Kontaktdaten (E-Mail und/oder Telefon)
- Ggf. Vertreter (nicht relevant für Einzelpersonen in DE)
- Ggf. Datenschutzbeauftragter (bei privaten Websites i.d.R. nicht verpflichtend, da keine Pflicht zur Bestellung nach Art. 37 DSGVO bei weniger als 20 Personen mit Datenverarbeitung)

```markdown
## Verantwortlicher

Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der DSGVO ist:

**Sven Maibaum**  
[Straße und Hausnummer]  
51399 Burscheid  
Deutschland

E-Mail: [E-Mail-Adresse]

Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen 
Voraussetzungen nach Art. 37 DSGVO nicht vorliegen.
```

> **Hinweis:** Die vollständige Postanschrift ist Pflicht. Ohne Straßenangabe ist die DSE unvollständig (vgl. Art. 13 Abs. 1 lit. a DSGVO). Diese Angabe sollte in Verbindung mit dem Impressum konsistent sein.

---

### 3.3 Server-Logfiles / Hosting

**Pflicht:** JA — Art. 13 Abs. 1 lit. c, d, e DSGVO  
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)  
**Berechtigtes Interesse:** Sicherstellung des Betriebs, Schutz vor Cyberangriffen, Fehlerdiagnose

**Erhobene Datenkategorien:**
- IP-Adresse des anfragenden Geräts
- Datum und Uhrzeit des Zugriffs
- Name und URL der abgerufenen Seite
- Referrer-URL (von welcher Seite der Abruf erfolgte)
- Browsertyp und -version, Betriebssystem
- HTTP-Statuscode

**Speicherdauer:** 7–30 Tage (7 Tage sind Standard, bis 30 Tage von bayerischer DSB als vertretbar anerkannt); danach automatische Löschung oder Anonymisierung.

```markdown
## Server-Logfiles

Beim Besuch dieser Website werden durch den Webserver automatisch sogenannte 
Server-Logfiles erfasst. Diese enthalten:

- IP-Adresse des anfragenden Endgeräts
- Datum und Uhrzeit des Zugriffs
- Name und URL der abgerufenen Datei
- Referrer-URL (zuvor besuchte Seite)
- Verwendeter Browser und Betriebssystem
- HTTP-Statuscode

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse 
besteht in der Sicherstellung eines störungsfreien Betriebs der Website, der 
Erkennung und Abwehr von Angriffen sowie der Fehleranalyse.

**Speicherdauer:** Die Logdaten werden nach spätestens 30 Tagen gelöscht oder 
anonymisiert, sofern sie nicht zur Aufklärung eines konkreten Sicherheitsvorfalls 
länger aufbewahrt werden müssen.

**Empfänger:** Die Daten werden ausschließlich zur Erbringung des Hosting-
Dienstes an den jeweiligen Hosting-Anbieter weitergegeben. Eine weitere 
Weitergabe an Dritte findet nicht statt.
```

> **Quellen:** BfDI (Logfile-Analyse), BayLDA (30-Tage-Frist), Art. 6 Abs. 1 lit. f DSGVO

---

### 3.4 Kontaktformular (Formspree)

**Pflicht:** JA — Art. 13 Abs. 1 lit. e DSGVO (Empfänger), Art. 44 ff. DSGVO (Drittland)  
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) oder Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)  
**Drittlandübermittlung:** USA — Formspree (formspree.io) nutzt AWS-Infrastruktur in den USA. Kein DPF-Zertifikat nachweisbar; Übertragung auf Basis von Standard-Vertragsklauseln (SCCs, Art. 46 Abs. 2 lit. c DSGVO).

```markdown
## Kontaktformular

Wenn Sie das Kontaktformular auf dieser Website nutzen, werden Ihre Angaben 
(Name, E-Mail-Adresse, Nachricht) zwecks Bearbeitung der Anfrage und für den 
Fall von Anschlussfragen bei uns verarbeitet.

**Dienstleister:** Formspree, Inc., 2261 Market Street #4990, San Francisco, 
CA 94114, USA (formspree.io)

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahme auf 
Anfrage der betroffenen Person) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes 
Interesse an der Beantwortung von Anfragen).

**Drittlandübermittlung:** Formspree verarbeitet Daten auf Servern in den USA. 
Die Datenübermittlung erfolgt auf Grundlage von Standardvertragsklauseln (SCC) 
gemäß Art. 46 Abs. 2 lit. c DSGVO. Formspree ist nach aktuellem Stand nicht 
im EU-U.S. Data Privacy Framework (DPF) zertifiziert.

**Speicherdauer:** Die über das Kontaktformular übermittelten Daten verbleiben 
bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung widerrufen oder 
der Zweck der Datenspeicherung entfällt. Gesetzliche Aufbewahrungspflichten 
bleiben unberührt.

**Hinweis nach § 25 TDDDG:** Das Kontaktformular selbst speichert keine Daten 
im Browser des Nutzers (keine Cookies, kein localStorage durch das Formular).
```

> **Hinweis zur Praxis:** Formspree nennt SCCs als Grundlage in der Privacy Policy, jedoch ohne explizite DPF-Zertifizierung. Es empfiehlt sich, einen Data Processing Agreement (DPA) mit Formspree abzuschließen (über das Formspree-Dashboard verfügbar ab Pro-Plan). Alternativ: Formularverarbeitung über einen deutschen/EU-Anbieter (z.B. Netlify Forms, selbst gehostetes Backend).

---

### 3.5 Google Fonts (externe CDN-Einbindung)

**Pflicht:** JA (da dynamisch von fonts.googleapis.com/fonts.gstatic.com geladen)  
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO i.V.m. Art. 49 Abs. 1 lit. a DSGVO bzw. Art. 45 DSGVO (DPF)  
**Drittlandübermittlung:** USA — Google LLC ist DPF-zertifiziert (Stand 2024)  
**Problem:** Beim Laden überträgt der Browser die IP-Adresse des Nutzers an Google (LG München, Urt. v. 20.01.2022, Az. 3 O 17493/20 — Schadensersatz wegen unrechtmäßiger Übermittlung)

**Wichtig:** Da Google Fonts NICHT selbst gehostet wird, ist eine Drittlandübermittlung unvermeidlich. Die Einbindung sollte entweder:
1. Mit Einwilligung (Cookie-Banner) erfolgen, **oder**
2. Auf Basis des DPF-Adäquanzbeschlusses (Art. 45 DSGVO) — möglich, da Google LLC DPF-zertifiziert ist

```markdown
## Google Web Fonts

Diese Website nutzt zur einheitlichen Darstellung von Schriftarten sogenannte 
„Google Fonts", die von Google LLC, 1600 Amphitheatre Parkway, Mountain View, 
CA 94043, USA bereitgestellt werden.

Beim Aufruf einer Seite lädt Ihr Browser die benötigten Schriftarten direkt von 
den Servern von Google (fonts.googleapis.com / fonts.gstatic.com). Dabei wird 
Ihre IP-Adresse an Google übertragen.

**Rechtsgrundlage:** Die Einbindung erfolgt auf Grundlage von Art. 6 Abs. 1 
lit. f DSGVO (berechtigtes Interesse an einer einheitlichen und technisch 
optimierten Darstellung). 

**Drittlandübermittlung:** Die Daten werden in die USA übermittelt. Google LLC 
ist unter dem EU-U.S. Data Privacy Framework (DPF) zertifiziert (Angemessen-
heitsbeschluss der EU-Kommission vom 10.07.2023, C(2023) 4745). Die Übermittlung 
erfolgt daher auf Grundlage von Art. 45 DSGVO.

Weitere Informationen zu Google Fonts finden Sie unter:  
https://developers.google.com/fonts/faq/privacy  
https://policies.google.com/privacy
```

> **Empfehlung:** Für maximale Rechtssicherheit sollten Google Fonts lokal gehostet werden (kein Drittland-Transfer, kein IP-Transfer an Google). Dies ist technisch einfach umsetzbar und vermeidet das Abmahnrisiko nach LG München.

---

### 3.6 Cloudflare CDN (cdnjs.cloudflare.com)

**Pflicht:** JA  
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: CDN-Performance, Sicherheit)  
**Drittlandübermittlung:** USA — Cloudflare Inc. ist DPF-zertifiziert (Stand 05.08.2024)

```markdown
## Cloudflare CDN

Diese Website nutzt das Content Delivery Network (CDN) von Cloudflare, Inc., 
101 Townsend St., San Francisco, CA 94107, USA. Über das CDN werden statische 
Ressourcen (z.B. CSS-Dateien für Icon-Schriften) von cdnjs.cloudflare.com 
ausgeliefert. Dabei wird Ihre IP-Adresse von Cloudflare verarbeitet.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse 
besteht in der schnellen und sicheren Auslieferung der Website sowie dem Schutz 
vor bösartigen Zugriffen.

**Drittlandübermittlung:** Cloudflare ist unter dem EU-U.S. Data Privacy 
Framework (DPF) zertifiziert (Angemessenheitsbeschluss C(2023) 4745), sodass 
die Datenübermittlung in die USA auf Art. 45 DSGVO gestützt wird. Ergänzend 
stützt sich Cloudflare auf EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c 
DSGVO).

Datenschutzerklärung von Cloudflare: https://www.cloudflare.com/privacypolicy/
```

---

### 3.7 localStorage (Theme-Einstellung)

**Pflicht:** Hinweis empfohlen  
**Rechtsgrundlage:** § 25 Abs. 2 Nr. 2 TDDDG (keine Einwilligung erforderlich bei ausschließlich technisch notwendiger Speicherung)  
**Bewertung:** Die Speicherung der Hell-/Dunkel-Einstellung im localStorage dient ausschließlich der technischen Funktionalität (Darstellungseinstellung des Nutzers). Sie enthält keine Tracking-Funktion, keine personenbezogenen Daten im eigentlichen Sinne und dient nicht der Nutzerverfolgung. → Kein Cookie-Banner erforderlich; Hinweis in der DSE genügt.

```markdown
## Einstellungen im Browser-Speicher (localStorage)

Diese Website speichert Ihre Darstellungseinstellung (helles oder dunkles 
Farbschema) im sogenannten localStorage Ihres Browsers. Dies dient ausschließlich 
dazu, Ihre bevorzugte Ansicht beim nächsten Seitenaufruf beizubehalten.

**Rechtsgrundlage:** § 25 Abs. 2 Nr. 2 TDDDG, da die Speicherung ausschließlich 
dem Zweck der Übertragung einer Nachricht über ein öffentliches Telekommuni-
kationsnetz dient bzw. unbedingt erforderlich ist, um den von Ihnen ausdrücklich 
gewünschten Dienst zur Verfügung zu stellen. Es findet kein Tracking und keine 
Weitergabe dieser Einstellung an Dritte statt.

Sie können diese gespeicherten Daten jederzeit über die Einstellungen Ihres 
Browsers löschen.
```

---

### 3.8 Externe Links (LinkedIn, GitHub)

**Pflicht:** Hinweis empfohlen (keine Datenübertragung durch bloße Links, aber Transparenzgebot)  
**Hinweis:** Reine Textlinks übertragen beim Klick keine Daten an das Drittunternehmen — erst beim Klick und dem Aufruf der Zielseite gelten die dortigen Datenschutzrichtlinien. Kein Social-Plugin → keine Pflicht zur umfassenden Einbindung.

```markdown
## Externe Links

Diese Website enthält Links zu externen Websites (u.a. LinkedIn, GitHub). Wenn 
Sie auf diese Links klicken, werden Sie zu den Websites der jeweiligen Betreiber 
weitergeleitet. Für den Datenschutz auf diesen externen Websites sind ausschließlich 
deren Betreiber verantwortlich. Beim Aufruf externer Websites gelten deren 
Datenschutzbestimmungen.

Es werden keine Daten durch diese Links an die Betreiber der verlinkten Seiten 
übertragen, bevor Sie auf den Link klicken. Es handelt sich um einfache Hyperlinks 
ohne Social-Plugins oder Tracking-Integrationen.
```

---

### 3.9 SSL/TLS-Verschlüsselung

**Pflicht:** Empfohlen (Art. 32 DSGVO — Datensicherheit; keine explizite Formulierungspflicht, aber empfohlen als TOMs-Hinweis)

```markdown
## Datensicherheit / SSL-Verschlüsselung

Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung 
vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte 
Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" 
auf „https://" wechselt und an dem Schloss-Symbol in der Browserzeile.

Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie 
an uns übermitteln, nicht von Dritten mitgelesen werden. Dies entspricht den 
Anforderungen des Art. 32 Abs. 1 lit. a DSGVO (Verschlüsselung als technische 
Schutzmaßnahme).
```

---

### 3.10 Drittlandübermittlungen — Übersicht

**Pflicht:** JA — Art. 13 Abs. 1 lit. f DSGVO bei tatsächlicher Übermittlung in Drittländer

| Dienst | Anbieter (Land) | Rechtsgrundlage Transfer | DPF-Status |
|--------|-----------------|--------------------------|------------|
| Google Fonts | Google LLC (USA) | Art. 45 DSGVO (DPF) | ✅ DPF-zertifiziert |
| Cloudflare CDN | Cloudflare Inc. (USA) | Art. 45 DSGVO (DPF) + SCCs | ✅ DPF-zertifiziert |
| Formspree | Formspree Inc. (USA) | Art. 46 Abs. 2 lit. c DSGVO (SCCs) | ❓ kein DPF-Nachweis |

**Rechtsgrundlagen für Drittlandtransfers:**
- **Art. 45 DSGVO**: Angemessenheitsbeschluss (EU-U.S. DPF, seit 10.07.2023)
- **Art. 46 Abs. 2 lit. c DSGVO**: EU-Standardvertragsklauseln (SCCs)

```markdown
## Datenübermittlung in Drittländer

Einige der auf dieser Website eingesetzten Dienste übermitteln personenbezogene 
Daten in die USA. Die USA gelten seit dem Angemessenheitsbeschluss der EU-
Kommission vom 10. Juli 2023 (C(2023) 4745) als sicheres Drittland für 
DPF-zertifizierte Unternehmen (EU-U.S. Data Privacy Framework, Art. 45 DSGVO).

Für Dienste, die nicht DPF-zertifiziert sind, werden als Schutzmaßnahme 
EU-Standardvertragsklauseln (Standard Contractual Clauses, SCC) gemäß Art. 46 
Abs. 2 lit. c DSGVO vereinbart.

Die entsprechenden Anbieter und die jeweils anwendbare Übertragungsgrundlage 
sind in den jeweiligen Abschnitten dieser Datenschutzerklärung angegeben.
```

---

### 3.11 Betroffenenrechte (Art. 15–22 DSGVO)

**Pflicht:** JA — Art. 13 Abs. 2 lit. b–d DSGVO (vollständige Auflistung zwingend)

```markdown
## Ihre Rechte als betroffene Person

Sie haben gegenüber dem Verantwortlichen folgende Rechte hinsichtlich Ihrer 
personenbezogenen Daten:

### Auskunftsrecht (Art. 15 DSGVO)
Sie können jederzeit Auskunft darüber verlangen, ob und welche personenbezogenen 
Daten wir über Sie verarbeiten, zu welchem Zweck, aus welcher Quelle und wie 
lange diese gespeichert werden.

### Recht auf Berichtigung (Art. 16 DSGVO)
Sie haben das Recht, die Berichtigung unrichtiger oder die Vervollständigung 
unvollständiger personenbezogener Daten zu verlangen.

### Recht auf Löschung (Art. 17 DSGVO)
Sie können die Löschung Ihrer personenbezogenen Daten verlangen, sofern keine 
gesetzlichen Aufbewahrungspflichten oder andere Rechtsgründe der Löschung 
entgegenstehen.

### Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
Sie haben das Recht, unter bestimmten Voraussetzungen die Einschränkung der 
Verarbeitung Ihrer Daten zu verlangen.

### Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
Sie haben das Recht, die Sie betreffenden personenbezogenen Daten, die Sie uns 
bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesbaren 
Format zu erhalten (gilt nur für per Einwilligung oder Vertrag verarbeitete Daten).

### Widerspruchsrecht (Art. 21 DSGVO)
Sie haben das Recht, der Verarbeitung Ihrer personenbezogenen Daten auf Basis 
von Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen) jederzeit zu 
widersprechen, sofern Gründe vorliegen, die sich aus Ihrer besonderen Situation 
ergeben. Wir verarbeiten Ihre Daten dann nicht mehr, es sei denn, wir können 
zwingende schutzwürdige Gründe für die Verarbeitung nachweisen.

### Widerrufsrecht bei Einwilligung (Art. 7 Abs. 3 DSGVO)
Soweit die Verarbeitung auf einer Einwilligung beruht, können Sie diese jederzeit 
mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der bis zum Widerruf 
erfolgten Verarbeitung bleibt davon unberührt.

### Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)
Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die 
Verarbeitung Ihrer personenbezogenen Daten zu beschweren (siehe Abschnitt unten).

Zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannten Kontakt-
daten des Verantwortlichen.
```

---

### 3.12 Beschwerderecht bei der Aufsichtsbehörde (Art. 77 DSGVO)

**Pflicht:** JA — Art. 13 Abs. 2 lit. d DSGVO (explizit verpflichtend)  
**Zuständige Behörde für NRW:** Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)

```markdown
## Beschwerderecht bei der Aufsichtsbehörde

Gemäß Art. 77 DSGVO haben Sie das Recht, sich bei einer Datenschutz-Aufsichts-
behörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung der 
Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.

Die zuständige Aufsichtsbehörde für den Verantwortlichen ist:

**Landesbeauftragte für Datenschutz und Informationsfreiheit  
Nordrhein-Westfalen (LDI NRW)**  
Postfach 20 04 44  
40102 Düsseldorf

Telefon: +49 (0)211 / 38424 - 0  
Telefax: +49 (0)211 / 38424 - 999  
E-Mail: poststelle@ldi.nrw.de  
Website: https://www.ldi.nrw.de
```

---

### 3.13 Speicherdauer und Löschung

**Pflicht:** JA — Art. 13 Abs. 2 lit. a DSGVO (konkrete Angabe oder Kriterien zwingend)

```markdown
## Speicherdauer und Löschung

Ihre personenbezogenen Daten werden nur so lange gespeichert, wie es für die 
jeweiligen Verarbeitungszwecke erforderlich ist oder gesetzliche Aufbewahrungs-
pflichten bestehen.

Im Einzelnen gilt:
- **Server-Logfiles:** Automatische Löschung nach spätestens 30 Tagen
- **Kontaktformular-Daten:** Bis zur abschließenden Bearbeitung Ihrer Anfrage 
  und danach nach Ablauf eventueller Verjährungsfristen; auf Anfrage sofortige 
  Löschung möglich (soweit keine gesetzliche Aufbewahrungspflicht besteht)
- **Browser-Speicher (localStorage):** Verbleibt lokal in Ihrem Browser; kann 
  von Ihnen jederzeit über die Browser-Einstellungen gelöscht werden

Nach Ablauf der jeweiligen Speicherdauer werden die Daten routinemäßig und 
entsprechend den gesetzlichen Vorschriften gelöscht oder anonymisiert.
```

---

### 3.14 Aktualität und Änderungsvorbehalt

**Pflicht:** Nicht ausdrücklich gesetzlich gefordert, aber dringend empfohlen — wer die DSE nicht aktuell hält, verletzt die Informationspflichten nach Art. 12 DSGVO laufend.

```markdown
## Aktualität dieser Datenschutzerklärung

Diese Datenschutzerklärung hat den Stand **[Datum einfügen]**. Durch die 
Weiterentwicklung dieser Website oder aufgrund geänderter gesetzlicher oder 
behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung 
anzupassen. Die jeweils aktuelle Version ist auf dieser Website abrufbar.
```

---

## 4. Checkliste: Vollständigkeit nach Art. 13 DSGVO

| Pflichtangabe | Art. 13 | Enthalten? |
|---------------|---------|------------|
| Name + Anschrift Verantwortlicher | Abs. 1 lit. a | ☐ |
| Kontaktdaten Verantwortlicher | Abs. 1 lit. a | ☐ |
| Kontaktdaten DSB (falls bestellt) | Abs. 1 lit. b | ☐ / nicht anwendbar |
| Verarbeitungszwecke | Abs. 1 lit. c | ☐ |
| Rechtsgrundlage je Verarbeitung | Abs. 1 lit. c | ☐ |
| Berechtigte Interessen (bei lit. f) | Abs. 1 lit. d | ☐ |
| Empfänger / Kategorien von Empfängern | Abs. 1 lit. e | ☐ |
| Drittlandübermittlungen + Schutzmaßnahmen | Abs. 1 lit. f | ☐ |
| Speicherdauer oder Kriterien | Abs. 2 lit. a | ☐ |
| Auskunftsrecht Art. 15 | Abs. 2 lit. b | ☐ |
| Berichtigungsrecht Art. 16 | Abs. 2 lit. b | ☐ |
| Löschungsrecht Art. 17 | Abs. 2 lit. b | ☐ |
| Einschränkungsrecht Art. 18 | Abs. 2 lit. b | ☐ |
| Datenübertragbarkeit Art. 20 | Abs. 2 lit. b | ☐ |
| Widerspruchsrecht Art. 21 | Abs. 2 lit. b | ☐ |
| Widerrufsrecht (bei Einwilligung) | Abs. 2 lit. c | ☐ |
| Beschwerderecht Art. 77 DSGVO | Abs. 2 lit. d | ☐ |
| Pflicht zur Datenbereitstellung / Konsequenzen | Abs. 2 lit. e | ☐ |
| Profiling / automat. Entscheidung (falls genutzt) | Abs. 2 lit. f | ☐ / nicht anwendbar |

---

## 5. Aktuelle Rechtsprechung 2024/2025

### EuGH C-394/23 (09.01.2025) — Informationspflicht bei berechtigten Interessen
Bei Verarbeitung auf Basis berechtigter Interessen (Art. 6 Abs. 1 lit. f) müssen Betroffene *vorab* informiert werden. Ohne Information: Verarbeitung rechtswidrig. → Viele bestehende Datenschutzerklärungen müssen nachgebessert werden, die die Interessenabwägung nicht transparent machen.

### EuGH (November 2024) — Schadensersatz bei Kontrollverlust
Auch ein kurzzeitiger Kontrollverlust über personenbezogene Daten kann einen immateriellen Schaden nach Art. 82 DSGVO begründen. Dies erhöht das Risiko bei datenschutzwidrigen Einbindungen (z.B. Google Fonts ohne Einwilligung).

### BGH (März 2025) — Verbandsklagerecht bei DSGVO-Verstößen
Verbraucherschutzverbände und Mitbewerber können DSGVO-Verstöße (z.B. intransparente Datenschutzerklärungen) vor Zivilgerichten verfolgen. Dies erhöht das Abmahnrisiko für unvollständige oder irreführende DSEs erheblich.

### LG München, Az. 3 O 17493/20 (20.01.2022) — Google Fonts
Schadensersatz (100 €) für jeden betroffenen Besucher bei Einbindung von Google Fonts ohne Einwilligung, da die IP-Adresse ungefragt an Google übertragen wurde. → Entweder Einwilligung einholen oder Google Fonts lokal hosten.

### EU-U.S. Data Privacy Framework (DPF), seit 10.07.2023
Der Adäquanzbeschluss C(2023) 4745 der EU-Kommission ermöglicht Datentransfers in die USA an DPF-zertifizierte Unternehmen auf Basis von Art. 45 DSGVO. Dieser kann (wie Privacy Shield) durch den EuGH für ungültig erklärt werden ("Schrems III") — Experten empfehlen ergänzend SCCs als Sicherungsnetz.

### OLG Dresden Az. 4 U 422/24 (15.10.2024) — Löschnachweise
Pauschale Aussagen zur Datenlöschung genügen nicht. Es sind konkrete Angaben erforderlich: Wer, wann, wie und wo gelöscht wurde.

---

## 6. Handlungsempfehlungen (spezifisch für sven-maibaum.com)

1. **Google Fonts selbst hosten:** Einfachste Lösung, um Drittlandtransfer, IP-Übertragung und LG-München-Risiko zu vermeiden. Fonts können mit `@font-face` aus `public/fonts/` eingebunden werden. Kein Abschnitt in der DSE nötig.

2. **Formspree DPA abschließen:** Formspree bietet ab dem Pro-Plan ein Data Processing Agreement (DPA) an. Dies sollte für DSGVO-Konformität abgeschlossen werden. Alternativ: EU-basierter Formular-Dienst (z.B. Netlify Forms, Basin).

3. **Vollständige Postanschrift in DSE:** Name + Straße + PLZ + Ort ist Pflicht (Art. 13 Abs. 1 lit. a). Kann mit Impressum identisch sein.

4. **Speicherdauer konkret benennen:** Pauschalformulierungen ("so lange erforderlich") reichen nach aktueller Rechtsprechung nicht aus. Konkrete Fristen angeben (z.B. "30 Tage" für Logfiles, "bis zur Anfrage-Erledigung" für Kontaktformular).

5. **Widerspruchshinweis Art. 21 DSGVO hervorheben:** Bei Verarbeitungen auf Art. 6 Abs. 1 lit. f gestützter Grundlage muss das Widerspruchsrecht gesondert und deutlich hervorgehoben werden (Art. 21 Abs. 4 DSGVO).

6. **Datum der letzten Aktualisierung angeben:** Nicht gesetzlich gefordert, aber gängige Praxis und zeigt Aktualität.

---

## 7. Quellen

### Gesetzestexte
- [Art. 13 DSGVO — dsgvo-gesetz.de](https://dsgvo-gesetz.de/art-13-dsgvo/)
- [Art. 14 DSGVO — dsgvo-gesetz.de](https://dsgvo-gesetz.de/art-14-dsgvo/)
- [Art. 6 DSGVO — dsgvo-gesetz.de](https://dsgvo-gesetz.de/art-6-dsgvo/)
- [§ 25 TDDDG — gesetze-im-internet.de](https://www.gesetze-im-internet.de/ttdsg/__25.html)

### BfDI (Bundesbeauftragte für Datenschutz)
- [BfDI: Informationspflichten](https://www.bfdi.bund.de/DE/Buerger/Inhalte/Allgemein/Datenschutz/Informationspflichten.html)
- [BfDI: Logfile-Daten (Datenschutzrechtliche Aspekte)](https://www.bfdi.bund.de/DE/Buerger/Inhalte/Telemedien/LogFile_Analyse.html)
- [BfDI: Internationale Datenübermittlungen](https://www.bfdi.bund.de/DE/Fachthemen/Inhalte/Europa-Internationales/Internationaler_Datentransfer.html)

### LDI NRW
- [LDI NRW: Websites — Muster für Datenschutzhinweise](https://www.ldi.nrw.de/datenschutz/medien-und-technik/websites-muster-fuer-datenschutzhinweise)
- [LDI NRW: Kontakt und Beschwerde](https://www.ldi.nrw.de/kontakt/ihre-beschwerde)
- [LDI NRW: Zuständigkeiten Datenschutz](https://www.ldi.nrw.de/zustaendigkeiten-datenschutz)

### Fachportale und Kanzleien
- [eRecht24: Datenschutzerklärung Google Web Fonts](https://www.e-recht24.de/dsg/12669-google-web-fonts.html)
- [eRecht24: Cloudflare](https://www.e-recht24.de/dsg/12626-cloudflare.html)
- [eRecht24: SSL-Verschlüsselung](https://www.e-recht24.de/dsg/12736-ssl-verschluesselung-der-webseite.html)
- [dr-datenschutz.de: Alle Betroffenenrechte](https://www.dr-datenschutz.de/alle-betroffenenrechte-der-dsgvo-in-einer-uebersicht/)
- [dr-datenschutz.de: Cookies und TDDDG](https://www.dr-datenschutz.de/cookies-und-datenschutz-zwischen-tdddg-und-dsgvo/)
- [IITR: Speicherdauer Logfiles](https://www.iitr.de/blog/datenschutz-it-sicherheit-speicherdauer-webseite-logfiles/18556/)
- [datenschutz-generator.de: Data Privacy Framework](https://datenschutz-generator.de/data-privacy-framework/)
- [gdpc.de: Datenschutz-Urteile 2024/2025](https://gdpc.de/datenschutz-urteile-2024-2025/)

### Rechtsprechung
- [LG München I, Az. 3 O 17493/20 (20.01.2022) — Google Fonts Urteil](https://www.ra-plutte.de/lg-muenchen-dynamische-einbindung-google-web-fonts-ist-dsgvo/)
- [BGH: Verbandsklagerecht (März 2025)](https://www.wbs.legal/wettbewerbsrecht/wichtige-bgh-urteile-verbraucherschutzverbaende-und-mitbewerber-duerfen-datenschutz-verstoesse-verfolgen-82253/)

### EU-Kommission
- [EU-U.S. Data Privacy Framework (Angemessenheitsbeschluss C(2023) 4745)](https://policies.google.com/privacy/frameworks?hl=de)
- [EDPB FAQ zum DPF für Unternehmen (PDF)](https://www.edpb.europa.eu/system/files/2024-12/edpb_dpf_faq-for-businesses_de.pdf)

### Formspree
- [Formspree Privacy Policy](https://formspree.io/legal/privacy-policy/)

---

*Recherchiert: Mai 2026 | Gilt für: www.sven-maibaum.com*
