# Hosting-Anbieter: DSGVO-Analyse für Datenschutzerklärungen (Stand: Mai 2026)

> Recherche für www.sven-maibaum.com — persönliches Portfolio-Projekt

---

## 1. Vergleichstabelle: Alle Anbieter auf einen Blick

| Anbieter | Sitz (Land) | Drittland (non-EU)? | DPF-Zertifizierung | AVV/DPA verfügbar | Server-Logs verarbeitet | Speicherdauer Log | DSGVO-Risiko |
|---|---|---|---|---|---|---|---|
| **GitHub Pages** | USA (San Francisco) | Ja (USA) | Ja (via Microsoft/GitHub) | Ja (DPA + SCCs) | IP, Referer, UA, Timestamp, HTTP-Status, Bytes | ~7 Tage | Mittel (DPF) |
| **Vercel** | USA (San Francisco) | Ja (USA) | Ja (zertifiziert) | Ja (DPA unter vercel.com/legal/dpa) | IP, Location (Stadt/Land), UA, Referer, Device | Nicht spezifiziert | Mittel (DPF) |
| **Netlify** | USA (San Francisco) | Ja (USA) | Ja (zertifiziert, FTC-Jurisdiction) | Ja (in AGB integriert) | IP, Datum/Zeit, Anfragegröße, HTTP-Status, Referer | 30 Tage | Mittel (DPF) |
| **Cloudflare Pages** | USA (San Francisco) | Ja (USA) | Ja (seit 05.08.2024) | Ja (DPA + SCCs) | IP, Timestamp, Anfrage, UA, Security-Fingerprint | max. 24h (Standard), max. 7 Tage (Enterprise) | Mittel–Hoch* |
| **Hetzner** | Deutschland (Gunzenhausen) | Nein (EU/EEA only) | Nicht relevant | Ja (im Kundenportal) | IP (anonymisierbar), Timestamp, Method, Status, Bytes, Referer, UA | 7 Tage (konfigurierbar) | Niedrig |
| **IONOS / 1&1** | Deutschland (Montabaur) | Nein (wenn DE-RZ gewählt) | Nicht relevant | Ja (seit 2022 in AGB) | IP, Timestamp, angeforderte Seite, Browser-Info | k.A. (kurz) | Niedrig |
| **All-Inkl** | Deutschland (Friedersdorf/Sachsen) | Nein | Nicht relevant | Ja (auf Anfrage/downloadbar) | IP, Timestamp, angeforderte Seite, Browser-Info | k.A. | Niedrig |
| **Strato** | Deutschland (Berlin) | Nein | Nicht relevant | Ja (im Kunden-Login) | IP, Timestamp, angeforderte Seite, Browser-Info | k.A. | Niedrig |
| **AWS (Frankfurt)** | USA (Amazon.com Inc.) | Ja (USA-Konzern) | Ja (Amazon.com Inc.) | Ja (verpflichtend, Art. 28) | Abhängig von Dienst/Konfiguration | Konfigurierbar | Mittel (DPF, CLOUD Act) |
| **Azure (EU)** | USA (Microsoft Corp.) | Ja (USA-Konzern) | Ja | Ja (GDPR DPA) | Abhängig von Dienst/Konfiguration | Konfigurierbar | Mittel (DPF, CLOUD Act) |
| **GCP (Frankfurt)** | USA (Google LLC) | Ja (USA-Konzern) | Ja | Ja (Data Processing Addendum) | Abhängig von Dienst/Konfiguration | Konfigurierbar | Mittel (DPF, CLOUD Act) |

> \* Cloudflare: rechtlich umstritten, ob berechtigtes Interesse reicht oder Einwilligung nötig — Details siehe Abschnitt 4.

---

## 2. Detailanalyse pro Anbieter

### 2.1 GitHub Pages

**Unternehmensangaben:**
- GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA
- Tochterunternehmen von Microsoft Corporation

**DPF-Status:**
- GitHub ist über Microsoft unter dem EU-U.S. Data Privacy Framework (DPF) zertifiziert
- Zertifikat prüfbar unter: https://www.dataprivacyframework.gov/list
- Alternativmechanismus: EU-Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO

**AVV/DPA:**
- DPA verfügbar: https://github.com/customer-terms/github-data-protection-agreement
- Für rein statische Websites (keine Nutzerdaten fließen an Betreiber): Bayerische Datenschutzbehörde (BayLDA) hat eine Ausnahme für Auftragsverarbeitungsvertrag bei statischen Seiten eingeräumt — das BayLDA-Papier von 2019 ist jedoch nicht für alle Datenschutzbehörden bindend

**Server-Logs (verarbeitete Daten):**
- IP-Adresse
- Adresse der vorher besuchten Website (Referer-Header)
- Datum und Uhrzeit der Anfrage
- Zeitzonendifferenz zur GMT
- Inhalt der Anforderung (Seite)
- HTTP-Statuscode
- Übertragene Datenmenge
- Browser- und Betriebssystem-Informationen

**Speicherdauer:** Logs werden gelöscht, sobald der Zweck der Verarbeitung entfällt; in der Praxis ca. 7 Tage laut BayLDA-Empfehlung

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: Bereitstellung und Absicherung der Website)

**Besonderheit:** Betreiber haben keinen direkten Zugriff auf die Logs — GitHub führt diese intern. Kein eigenes Tracking durch den Website-Betreiber.

---

### 2.2 Vercel

**Unternehmensangaben:**
- Vercel, Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA

**DPF-Status:**
- Vercel ist DPF-zertifiziert (EU-U.S. DPF, UK Extension, Swiss-U.S. DPF)
- Veröffentlichung: https://vercel.com/changelog/vercel-is-now-certified-under-the-eu-us-data-privacy-framework-dpf
- Prüfbar: https://www.dataprivacyframework.gov/list

**AVV/DPA:**
- Vorhanden unter: https://vercel.com/legal/dpa
- SCCs sind eingebettet

**Server-Logs / verarbeitete Daten:**
- IP-Adresse und daraus abgeleiteter Standort (Stadt und Land, keine Präzisierung)
- Browser-Typ, Geräteinformationen, Betriebssystem
- Angefragte Seiten, Klicks, Verweildauer
- Referer und Exit-Seiten

**Speicherdauer:** Keine spezifische Frist genannt — "minimum necessary period"; Logs werden anonymisiert oder gelöscht, wenn Zweck entfällt

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb)

**EU-Edge:** Vercel betreibt Edge-Standorte in Europa (z. B. Frankfurt). Daten werden jedoch trotzdem an US-amerikanisches Unternehmen übertragen — Serverstandort allein ändert das nicht.

---

### 2.3 Netlify

**Unternehmensangaben:**
- Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA
- FTC hat Jurisdiktion über Netlify-DPF-Compliance

**DPF-Status:**
- Netlify und Jamstack Innovation Fund sind DPF-zertifiziert (EU-U.S. DPF, UK Extension, Swiss-U.S. DPF)
- Netlify verpflichtet sich, mit EU-Datenschutzbehörden zusammenzuarbeiten

**AVV/DPA:**
- DPA ist in Netlifys AGB integriert und als PDF downloadbar
- Inkorporiert SCCs

**Server-Logs / verarbeitete Daten:**
- IP-Adresse
- Datum und Uhrzeit der Anfrage
- Übertragene Datenmenge
- HTTP-Zugangsstatus
- Referer-URL

**Speicherdauer:** 30 Tage laut Netlify-Dokumentation

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)

**Besonderheit:** Netlify bietet EU-freundliche Konfigurationsoptionen. Kein "Netlify Analytics" notwendig für rein statische Seiten.

---

### 2.4 Cloudflare Pages

**Unternehmensangaben:**
- Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA
- Deutsche Kontaktadresse: Cloudflare Germany GmbH, Rosental 7, c/o Mindspace, 80331 München

**DPF-Status:**
- Cloudflare ist seit 05.08.2024 DPF-zertifiziert (EU-U.S. DPF, UK Extension, Swiss-U.S. DPF)
- Zusätzlich: SCCs als Auffangmechanismus

**AVV/DPA:**
- Standard DPA verfügbar: https://www.cloudflare.com/cloudflare-customer-dpa/
- Inkorporiert EU-SCCs

**Server-Logs / verarbeitete Daten:**
- IP-Adressen
- Kontakt- und Protokollinformationen
- Sicherheits-Fingerprints
- Performance-Daten der Website
- `_cfduid` Cookie (1 Jahr; andere Nutzerdaten max. 24h Standard, max. 7 Tage Enterprise)

**Speicherdauer:** Standard: max. 24 Stunden; Enterprise: max. 7 Tage

**Rechtsgrundlage:** UMSTRITTEN — zwei Positionen:
1. **Position A (strenger):** Cloudflare erfordert Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), da Daten über technische Notwendigkeit hinaus gespeichert werden
2. **Position B (moderat, Mehrheitsmeinung):** Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) reicht, wenn Cloudflare nur für Sicherheit/Auslieferung genutzt wird und eigene Analytics deaktiviert sind

**EuGH-Entscheid C-511/21 (Jan. 2025):** Bestätigt IP-Adressen als personenbezogene Daten und dass Reverse-Proxy-Verarbeitung einer Rechtsgrundlage bedarf — klärt Einwilligungs-Frage aber nicht abschließend.

**Serverstandort-Hinweis:** Der physische Serverstandort ist bei Cloudflare nachrangig, da Cloudflare als US-Unternehmen auch auf EU-Servern US-Behördenzugriff ermöglichen kann (CLOUD Act). Cloudflare nutzt weltweit >300 PoPs.

---

### 2.5 Hetzner Online

**Unternehmensangaben:**
- Hetzner Online GmbH, Industriestraße 25, 91710 Gunzenhausen, Deutschland
- Deutsches Unternehmen, vollständig in Privatbesitz

**DPF-Status:** Nicht relevant (deutsches Unternehmen, keine US-Übertragung bei EU-Standort)

**Drittland:** Kein Drittlandtransfer bei Wahl von DE/FI-Standort (Nürnberg, Falkenstein, Helsinki). Ausnahme: Cloudserver in Ashburn (USA) oder Hillsboro (USA) würde Drittlandtransfer auslösen.

**AVV/DPA:**
- Verfügbar im Hetzner-Kundenportal (vorsigniert von Hetzner)
- Kein individueller AVV — nur Standardformular
- DPA auf Englisch/Deutsch: https://www.hetzner.com/AV/DPA_de.pdf

**Zertifizierungen:** ISO/IEC 27001 für alle Rechenzentren

**Server-Logs / verarbeitete Daten:**
- IP-Adresse (anonymisierbar konfigurierbar)
- Timestamp
- HTTP-Methode und Ziel
- HTTP-Statuscode
- Übertragene Bytes
- Referer
- User-Agent

**Speicherdauer:** 7 Tage für Apache-Logs (konfigurierbar); 7 Tage für Mailserver-Logs

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse: sicherer Betrieb)

---

### 2.6 IONOS / 1&1

**Unternehmensangaben:**
- 1&1 IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland
- Börsennotiertes deutsches Unternehmen (United Internet AG)

**DPF-Status:** Nicht relevant (deutsches Unternehmen bei DE-Rechenzentrum)

**Drittland:** Kein Drittlandtransfer bei Wahl des deutschen Rechenzentrums (Frankfurt am Main oder Berlin). Hinweis: IONOS hat auch Rechenzentren in Las Vegas und New Jersey — bei Vertragsabschluss explizit DE-Standort konfigurieren.

**AVV/DPA:**
- Seit 19.07.2022 in IONOS-AGB integriert (kein separater Abschluss nötig)
- Abrufbar unter: https://www.ionos.de/terms-gtc/avv/

**Server-Logs / verarbeitete Daten:**
- IP-Adresse
- Datum und Uhrzeit
- Angeforderte Seite
- Browser-Informationen

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)

---

### 2.7 All-Inkl (Neue Medien Münnich)

**Unternehmensangaben:**
- ALL-INKL.COM - Neue Medien Münnich, René Münnich, Hauptstraße 68, 02742 Friedersdorf, Deutschland
- Inhabergeführtes deutsches Unternehmen aus Sachsen

**DPF-Status:** Nicht relevant (deutsches Unternehmen, keine US-Übertragung)

**Drittland:** Kein Drittlandtransfer (Server ausschließlich in Deutschland)

**AVV/DPA:**
- Auf Anfrage erhältlich; downloadbar über Kundenbereich
- IP-Anonymisierung konfigurierbar: vollständige Anonymisierung (0.0.0.0), letzten Oktett nullen, oder ganz deaktivieren

**Server-Logs / verarbeitete Daten:**
- IP-Adresse (anonymisierbar)
- Timestamp
- Angeforderte Seite
- Browser-Informationen

**Besonderheit:** Einziger Anbieter in dieser Liste, bei dem Logs vollständig deaktivierbar sind — DSGVO-freundlichste Option.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)

**Zertifizierung:** Keine eigene ISO 27001-Zertifizierung bekannt (Stand 2025)

---

### 2.8 Strato

**Unternehmensangaben:**
- Strato AG, Pascalstraße 10, 10587 Berlin, Deutschland
- Tochterunternehmen von United Internet AG (IONOS-Konzern)

**DPF-Status:** Nicht relevant (deutsches Unternehmen)

**Drittland:** Kein Drittlandtransfer (Rechenzentren in Berlin und Karlsruhe, ISO 27001 zertifiziert seit 2004)

**AVV/DPA:**
- Im Strato Kunden-Login verfügbar: Kundendaten → Auftragsverarbeitung
- Digitaler Abschluss, PDF-Download möglich

**Server-Logs / verarbeitete Daten:**
- IP-Adresse
- Datum und Uhrzeit
- Angeforderte Seite
- Browser-Informationen

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)

---

### 2.9 AWS / Azure / GCP (Cloud-Hyperscaler)

**Gemeinsame Punkte:**
- Alle US-amerikanische Konzerne: Amazon.com Inc., Microsoft Corp., Google LLC
- Alle DPF-zertifiziert (Stand 2025)
- Alle bieten EU-Regionen an (Frankfurt/EU für AWS und GCP, EU-Rechenzentren für Azure)
- Alle unterliegen dem US CLOUD Act und FISA §702 — Server-Standort allein reicht nicht

**AVV/DPA:**
- AWS: Automatisch in AGB (Art. 28 DSGVO), GDPR Center: https://aws.amazon.com/de/compliance/gdpr-center/
- Azure: GDPR DPA verfügbar über Microsoft Trust Center
- GCP: Data Processing Addendum verfügbar

**Empfehlung für Portfolio-Website:** Hyperscaler bieten die komplexeste Compliance-Konfiguration und sind für ein persönliches Portfolio unverhältnismäßig aufwändig. Nur sinnvoll, wenn bereits aus anderen Gründen in der Cloud.

---

## 3. DSE-Mustertexte (Deutsch)

### 3.1 Mustertext: GitHub Pages (Hosting in USA, DPF)

```
Webhosting (GitHub Pages)

Diese Website wird auf Servern von GitHub Inc., 88 Colin P Kelly Jr St, San Francisco, 
CA 94107, USA (im Folgenden: GitHub) gehostet.

Wenn Sie unsere Website besuchen, erhebt GitHub in sogenannten Logfiles folgende Daten, 
die Ihr Browser übermittelt:

- IP-Adresse
- Adresse der vorher besuchten Website (Referer-Header)
- Datum und Uhrzeit der Anfrage
- Zeitzonendifferenz zur Greenwich Mean Time
- Inhalt der Anforderung (aufgerufene Seite)
- HTTP-Statuscode
- Übertragene Datenmenge
- Website, von der die Anforderung kommt
- Informationen zu Browser und Betriebssystem

Dies ist erforderlich, um unsere Website anzuzeigen und die Stabilität und Sicherheit zu 
gewährleisten. Dies entspricht unserem berechtigten Interesse im Sinne von Art. 6 Abs. 1 
S. 1 lit. f DSGVO. Wir haben auf diese Daten keinen direkten Zugriff; es erfolgt kein 
Tracking durch uns.

Da der Serverstandort in den USA liegt, werden Ihre Daten in ein Drittland übermittelt. 
GitHub ist unter dem EU-U.S. Data Privacy Framework (DPF) zertifiziert und verpflichtet 
sich zur Einhaltung der DPF-Grundsätze. Zusätzlich setzt GitHub EU-Standardvertragsklauseln 
(SCCs) gemäß Art. 46 DSGVO ein.

Weitere Informationen finden Sie in der Datenschutzerklärung von GitHub: 
https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement

Die Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt, in der Regel nach 
spätestens sieben Tagen.
```

---

### 3.2 Mustertext: Vercel (Hosting in USA, DPF, EU-Edge)

```
Webhosting (Vercel)

Diese Website wird über die Plattform von Vercel, Inc., 340 S Lemon Ave #4133, Walnut, 
CA 91789, USA (im Folgenden: Vercel) bereitgestellt. Vercel nutzt ein globales 
Edge-Netzwerk, das auch Standorte in Europa umfasst.

Beim Aufruf unserer Website werden folgende Daten verarbeitet:

- IP-Adresse sowie daraus abgeleiteter Standort (nur Stadt und Land, keine genaue Lokalisierung)
- Geräteinformationen (Browser-Typ, Betriebssystem, Gerätekennungen)
- Aufgerufene Seiten, Datum und Uhrzeit des Zugriffs
- Referer-URL (vorher besuchte Website)

Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO (berechtigtes Interesse an der 
sicheren und fehlerfreien Bereitstellung der Website).

Da Vercel ein US-amerikanisches Unternehmen ist, kann eine Übermittlung personenbezogener 
Daten in die USA stattfinden. Vercel ist unter dem EU-U.S. Data Privacy Framework (DPF) 
zertifiziert und hat ergänzend EU-Standardvertragsklauseln (SCCs) implementiert. Mit Vercel 
wurde ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen (abrufbar unter 
https://vercel.com/legal/dpa).

Die Daten werden gelöscht, sobald sie für die Erfüllung des Verarbeitungszwecks nicht mehr 
erforderlich sind.
```

---

### 3.3 Mustertext: Netlify (Hosting in USA, DPF)

```
Webhosting (Netlify)

Diese Website wird bei Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, 
CA 94104, USA (im Folgenden: Netlify) gehostet.

Netlify verarbeitet beim Aufruf unserer Website folgende Daten in Server-Logfiles:

- IP-Adresse
- Datum und Uhrzeit der Anfrage
- Umfang der übertragenen Daten
- HTTP-Zugangsstatus
- Referer-URL

Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO (berechtigtes Interesse: sichere und 
zuverlässige Bereitstellung der Website).

Da Netlify seinen Sitz in den USA hat, werden Daten in ein Drittland übertragen. Netlify 
ist unter dem EU-U.S. Data Privacy Framework (DPF) zertifiziert und hat mit dem Verband 
der US-amerikanischen Federal Trade Commission (FTC) als zuständiger Aufsichtsbehörde 
kooperiert. Mit Netlify besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO, der 
in den Netlify-AGB integriert ist (https://www.netlify.com/gdpr-ccpa/).

Die Logdaten werden in der Regel nach 30 Tagen gelöscht.
```

---

### 3.4 Mustertext: Cloudflare Pages (Hosting + CDN, USA, DPF)

```
Webhosting und Content Delivery Network (Cloudflare)

Diese Website wird über Cloudflare Pages bereitgestellt und nutzt das Content Delivery 
Network (CDN) von Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA, 
vertreten in Deutschland durch Cloudflare Germany GmbH, Rosental 7, 80331 München 
(im Folgenden: Cloudflare).

Cloudflare ist Empfänger Ihrer personenbezogenen Daten und agiert als Auftragsverarbeiter 
für uns. Das CDN ist ein weltweit verteiltes Netzwerk von Servern, das die Auslieferung 
und Absicherung unserer Website beschleunigt. Dabei können folgende Daten in 
Server-Logfiles verarbeitet werden:

- IP-Adresse
- Datum und Uhrzeit des Zugriffs
- HTTP-Anfragedaten (Methode, Statuscode, aufgerufene URL)
- Informationen zu Browser und Betriebssystem
- Sicherheits-Fingerprints

Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO (berechtigtes Interesse: Sicherheit 
und Auslieferungsgeschwindigkeit der Website). Sie haben das Recht, der Verarbeitung zu 
widersprechen; ob der Widerspruch erfolgreich ist, ist im Rahmen einer 
Interessenabwägung zu ermitteln.

Da Cloudflare ein US-amerikanisches Unternehmen ist, werden Daten in die USA übermittelt. 
Cloudflare ist seit August 2024 unter dem EU-U.S. Data Privacy Framework (DPF) 
zertifiziert und hat zusätzlich EU-Standardvertragsklauseln (SCCs) implementiert. Mit 
Cloudflare wurde ein Auftragsverarbeitungsvertrag geschlossen.

Die Logdaten werden bei der Standardnutzung nach maximal 24 Stunden gelöscht.

Weitere Informationen: https://www.cloudflare.com/de-de/trust-hub/gdpr/
```

---

### 3.5 Mustertext: Hetzner (Hosting in Deutschland/EU)

```
Webhosting (Hetzner)

Diese Website wird auf Servern der Hetzner Online GmbH, Industriestraße 25, 
91710 Gunzenhausen, Deutschland (im Folgenden: Hetzner) gehostet.

Beim Aufruf unserer Website verarbeitet Hetzner in Server-Logfiles folgende Daten:

- IP-Adresse (anonymisiert)
- Datum und Uhrzeit der Anfrage
- HTTP-Methode und angeforderte URL
- HTTP-Statuscode
- Übertragene Datenmenge
- Referer-URL
- Informationen zu Browser und Betriebssystem

Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO (berechtigtes Interesse: sicherer 
und stabiler Betrieb unserer Website).

Hetzner ist ein deutsches Unternehmen. Die Daten werden ausschließlich auf Servern 
innerhalb der EU verarbeitet; es findet keine Übermittlung in Drittländer statt. 
Mit Hetzner wurde ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen. 
Die Rechenzentren von Hetzner sind nach ISO/IEC 27001 zertifiziert.

Logdaten werden in der Regel nach sieben Tagen automatisch gelöscht.
```

---

### 3.6 Mustertext: IONOS / 1&1 (Hosting in Deutschland)

```
Webhosting (IONOS)

Diese Website wird bei 1&1 IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland 
(im Folgenden: IONOS) gehostet.

Beim Aufruf unserer Website verarbeitet IONOS folgende Daten:

- IP-Adresse
- Datum und Uhrzeit des Zugriffs
- Aufgerufene Seite
- Informationen zu Browser und Betriebssystem

Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO (berechtigtes Interesse: 
Bereitstellung, Stabilität und Sicherheit unserer Website).

IONOS ist ein deutsches Unternehmen. Die Daten werden auf Servern in Deutschland 
verarbeitet; es findet keine Übermittlung in Drittländer statt. Die 
Auftragsverarbeitungsvereinbarung mit IONOS ist Bestandteil der IONOS-AGB 
(abrufbar unter https://www.ionos.de/terms-gtc/avv/).
```

---

### 3.7 Mustertext: All-Inkl (Hosting in Deutschland)

```
Webhosting (ALL-INKL.COM)

Diese Website wird bei ALL-INKL.COM - Neue Medien Münnich, Hauptstraße 68, 
02742 Friedersdorf, Deutschland (im Folgenden: All-Inkl) gehostet.

Beim Aufruf unserer Website werden folgende Daten in Server-Logfiles verarbeitet:

- IP-Adresse
- Datum und Uhrzeit des Zugriffs
- Aufgerufene Seite
- Informationen zu Browser und Betriebssystem

Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO (berechtigtes Interesse: sicherer 
und stabiler Websitebetrieb).

All-Inkl ist ein deutsches Unternehmen. Alle Daten werden auf Servern in Deutschland 
verarbeitet; eine Übermittlung in Drittländer findet nicht statt. Mit All-Inkl wurde 
ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen.
```

---

### 3.8 Mustertext: Strato (Hosting in Deutschland)

```
Webhosting (STRATO)

Diese Website wird auf Servern der Strato AG, Pascalstraße 10, 10587 Berlin, Deutschland 
(im Folgenden: Strato) gehostet.

Beim Aufruf unserer Website werden folgende Daten in Server-Logfiles verarbeitet:

- IP-Adresse
- Datum und Uhrzeit des Zugriffs
- Aufgerufene Seite
- Informationen zu Browser und Betriebssystem

Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO (berechtigtes Interesse: 
Bereitstellung und Absicherung unserer Website).

Strato ist ein deutsches Unternehmen. Alle Daten werden ausschließlich auf Servern 
in Berlin und Karlsruhe verarbeitet; es findet keine Übermittlung in Drittländer statt. 
Die Rechenzentren von Strato sind nach ISO 27001 zertifiziert. Mit Strato wurde ein 
Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen (abschließbar im 
Strato Kunden-Login unter "Kundendaten → Auftragsverarbeitung").
```

---

### 3.9 Mustertext: Kombiniertes Hosting — DE-Server + Cloudflare CDN davor

```
Webhosting und Content Delivery Network

Unser Hoster: [ANBIETER], [ADRESSE], Deutschland.
CDN-Anbieter: Cloudflare Germany GmbH (für Cloudflare, Inc.), Rosental 7, 80331 München, 
vertreten durch Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA.

Wenn Sie unsere Website aufrufen, wird Ihre Anfrage zunächst über das globale 
Content Delivery Network (CDN) von Cloudflare geleitet, bevor sie unseren deutschen 
Hosting-Server erreicht. Durch diesen Aufbau können folgende Daten verarbeitet werden:

- IP-Adresse (durch Cloudflare und durch unseren Hosting-Anbieter)
- Datum und Uhrzeit des Zugriffs
- Aufgerufene URL, HTTP-Methode und Statuscode
- Informationen zu Browser und Betriebssystem
- Sicherheits-Fingerprints (durch Cloudflare)

Unser Hosting-Anbieter verarbeitet diese Daten ausschließlich in Deutschland. 
Cloudflare als CDN-Betreiber ist ein US-amerikanisches Unternehmen; Daten werden 
insoweit in die USA übermittelt. Cloudflare ist unter dem EU-U.S. Data Privacy 
Framework (DPF) zertifiziert und hat ergänzend EU-Standardvertragsklauseln (SCCs) 
nach Art. 46 DSGVO implementiert.

Rechtsgrundlage für die Verarbeitung durch beide Dienstleister ist Art. 6 Abs. 1 
S. 1 lit. f DSGVO (berechtigtes Interesse: stabile, schnelle und sichere 
Bereitstellung unserer Website). Mit beiden Dienstleistern wurden 
Auftragsverarbeitungsverträge gemäß Art. 28 DSGVO geschlossen.

Logdaten des Hosting-Anbieters werden nach [X] Tagen gelöscht. Cloudflare-Logdaten 
werden nach maximal 24 Stunden gelöscht.
```

---

## 4. Status EU-U.S. Data Privacy Framework (DPF) — Stand Mai 2026

**Aktueller Status:**
- Am 3. September 2025 wies das Gericht der Europäischen Union (EuG) eine Klage auf Nichtigerklärung des DPF ab — der Angemessenheitsbeschluss (EU) 2023/1795 bleibt in Kraft.
- Am 31. Oktober 2025 legte der französische Parlamentsabgeordnete Philippe Latombe Berufung beim EuGH ein.
- Der EuGH prüft nun diese Berufung — eine endgültige Entscheidung steht noch aus (Stand: Mai 2026).

**Schrems-III-Risiko:**
- Max Schrems (noyb) hat angekündigt, den DPF anzufechten, u. a. mit dem Argument, dass US-Exekutivanordnungen unter Trump-Administration mit DPF-Garantien unvereinbar seien.
- Strukturelle Risiken: Trump feuerte im Januar 2025 demokratische Mitglieder des Data Protection Review Court — das fünfköpfige Gremium ist nicht mehr beschlussfähig.
- Änderungen bei FTC-Zusammensetzung gefährden unabhängige Aufsicht über DPF-Compliance.

**Empfehlung für Website-Betreiber:**
1. Bei US-Hostern immer beide Mechanismen nennen: DPF **und** SCCs
2. DPF allein als Transfergrundlage ist riskant — SCCs als Auffangbasis benennen
3. Bei sicherheitskritischen Anwendungen: EU/DE-Hoster bevorzugen

---

## 5. Umgang mit mehreren Verarbeitungskomponenten (z. B. DE-Server + Cloudflare CDN)

**Grundsatz:** Jeder Dienstleister, der personenbezogene Daten verarbeitet, muss in der DSE separat genannt werden.

**Vorgehen in der DSE:**
1. Hosting-Anbieter (z. B. Hetzner) und CDN-Anbieter (z. B. Cloudflare) als separate Abschnitte oder gemeinsam unter "Webhosting und Content Delivery Network" aufführen
2. Für jeden Anbieter separat angeben: Adresse, Rechtsgrundlage, Datenarten, Speicherdauer, Transfermechanismus
3. Mit jedem Anbieter separat einen AVV nach Art. 28 DSGVO schließen
4. Bei US-CDN vor DE-Server: der US-Anbieter ist der "erste Verarbeiter" — der Drittlandtransfer findet statt, auch wenn der eigentliche Server in DE steht
5. Datenschutzfolgeabschätzung (DSFA) nach Art. 35 DSGVO erwägen, wenn Daten systematisch in Drittländer übertragen werden

**Praxisbeispiel: Hetzner (DE) + Cloudflare CDN:**
- Hetzner: kein Drittland, AVV vorhanden, kurzer Text
- Cloudflare: US-Transfer, DPF + SCCs als Grundlage, separate AVV, Einwilligung vs. berechtigtes Interesse abwägen
- In der DSE: gemeinsamen Abschnitt "Webhosting und Content Delivery Network" verwenden, beide Anbieter und ihre jeweiligen Besonderheiten beschreiben (Mustertext 3.9 verwenden)

---

## 6. Aufsichtsbehörden-Entscheide und Beschwerden (2023–2025)

### Relevante behördliche Entscheide:

| Datum | Behörde | Gegenstand | Ergebnis |
|---|---|---|---|
| Jan. 2025 | EuGH (C-511/21) | IP-Adressen und Reverse Proxy | IP-Adressen als personenbezogene Daten bestätigt; Verarbeitung durch CDN/Proxy braucht Rechtsgrundlage |
| Sept. 2025 | EuG (Latombe ./. Kommission) | Gültigkeit DPF | DPF-Angemessenheitsbeschluss aufrechterhalten |
| 2023 | Österreich DSB | Google Fonts via CDN (Nachfolge-Fälle) | Drittlandtransfer ohne Rechtsgrundlage = DSGVO-Verstoß |
| 2023–2024 | noyb (Sammelklagen) | US-Hosting-Anbieter allgemein | Verschiedene Verfahren gegen US-CDN-/Hosting-Anbieter initiiert |
| 2024 | Diverse EU-DPAs | Cloudflare-Cookies / Analytics | Keine einheitliche Entscheidung; weiterhin umstrittene Rechtslage |

### Keine spezifischen, abgeschlossenen Bußgeldverfahren gegen GitHub Pages, Vercel oder Netlify bekannt (Stand Mai 2026).

### Wichtiger Hinweis "Google Fonts"-Analogie:
Das LG München I (Az. 3 O 17493/20, Jan. 2022) verurteilte einen Website-Betreiber wegen Google-Fonts-Einbindung (IP-Übertragung in die USA ohne Rechtsgrundlage). Das Prinzip ist auf externe Ressourcen von US-Anbietern übertragbar. Bei statischem Hosting ohne externe Ressourcen ist das Risiko geringer.

---

## 7. Empfehlung: Welcher Anbieter ist aus DSGVO-Sicht am unproblematischsten?

### Ranking (von unproblematisch zu komplex):

**1. Platz: Hetzner Online GmbH** ⭐⭐⭐⭐⭐
- Rein deutsches Unternehmen, Server in EU/EEA (DE + FI)
- Kein Drittlandtransfer, keine DPF-Abhängigkeit
- ISO 27001 zertifiziert
- AVV im Portal verfügbar (vorsigniert)
- IP-Anonymisierung konfigurierbar
- Kurzer, unkomplizierter DSE-Text ausreichend

**2. Platz: Strato AG** ⭐⭐⭐⭐½
- Deutsches Unternehmen (Berlin-basiert), Teil United Internet AG
- Server ausschließlich in DE (Berlin + Karlsruhe), ISO 27001 seit 2004
- AVV digital abschließbar
- Minimal riskanter als Hetzner, da Konzernstruktur (United Internet/IONOS)

**3. Platz: All-Inkl** ⭐⭐⭐⭐½
- Inhabergeführtes deutsches Unternehmen
- Server ausschließlich in Deutschland
- Log-Deaktivierung möglich (einzigartige Funktion)
- Keine ISO-Zertifizierung bekannt — leichter Abzug

**4. Platz: IONOS / 1&1** ⭐⭐⭐⭐
- Großes deutsches Unternehmen, AVV in AGB integriert
- Vorsicht: auch US-Rechenzentren vorhanden — explizit DE-Standort buchen
- Ansonsten unkompliziert

**5. Platz: Netlify** ⭐⭐⭐
- DPF-zertifiziert, DPA in AGB
- Klare 30-Tage-Log-Retention
- US-Drittlandtransfer bleibt Risiko (DPF-Unsicherheit)

**6. Platz: Vercel** ⭐⭐⭐
- DPF-zertifiziert, DPA verfügbar
- Keine konkrete Speicherdauer in Policy
- EU-Edge-Standorte vorhanden, aber kein "EU-only"-Modus
- US-Drittlandtransfer bleibt Risiko

**7. Platz: GitHub Pages** ⭐⭐⭐
- DPF-zertifiziert (über Microsoft)
- DPA + SCCs vorhanden
- Kein direkter Betreiber-Zugriff auf Logs — praktischer Vorteil
- BayLDA-Ausnahme für statische Seiten (nicht allgemein gültig)
- US-Drittlandtransfer bleibt Risiko

**8. Platz: Cloudflare Pages** ⭐⭐
- DPF-zertifiziert, DPA + SCCs vorhanden
- Rechtslage Einwilligung vs. berechtigtes Interesse ungeklärt
- Weltweit verteilte PoPs — unkontrollierbare Datenflusspfade
- Komplexeste DSE-Formulierung erforderlich

**Fazit für sven-maibaum.com (persönliches Portfolio):**
Empfohlen wird **Hetzner** (rein EU, kein Drittlandrisiko, günstig, klare Rechtslage) oder als US-Alternative **Netlify/Vercel mit DPF + SCCs** (wenn Developer-Experience Priorität hat). GitHub Pages ist pragmatisch vertretbar mit korrekter DSE. Cloudflare Pages als alleiniges Hosting ist aus DSGVO-Sicht die komplexeste Variante.

---

## 8. Quellen

- [GitHub General Privacy Statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement)
- [GitHub Pages — DSE-Muster (opr.vc)](https://opr.vc/docs/hosting/github_pages/)
- [GitHub Pages DSE-Muster (adsimple.de)](https://www.adsimple.de/datenschutzerklaerung/github-pages-datenschutzerklaerung/)
- [Vercel DPA](https://vercel.com/legal/dpa)
- [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy)
- [Vercel DPF-Zertifizierung](https://vercel.com/changelog/vercel-is-now-certified-under-the-eu-us-data-privacy-framework-dpf)
- [Netlify GDPR/CCPA](https://www.netlify.com/gdpr-ccpa/)
- [Netlify Privacy Policy](https://www.netlify.com/privacy/)
- [Cloudflare — DSE-Muster (opr.vc)](https://opr.vc/docs/cdn/cloudflare/)
- [Cloudflare GDPR Compliance](https://www.cloudflare.com/de-de/trust-hub/gdpr/)
- [Cloudflare DSGVO (dr-dsgvo.de)](https://dr-dsgvo.de/cloudflare-datentransfers-und-die-dsgvo/)
- [Cloudflare DSGVO (legalweb.io)](https://legalweb.io/en/gdpr/cdn_cloudflare/)
- [Hetzner Datenschutz-FAQ](https://docs.hetzner.com/de/general/general-terms-and-conditions/data-privacy-faq/)
- [Hetzner DSGVO (legalweb.io)](https://legalweb.io/en/gdpr/hosting_hetzner_online/)
- [Hetzner DSE (eRecht24)](https://www.e-recht24.de/dsg/12970-hetzner.html)
- [IONOS AVV](https://www.ionos.de/hilfe/datenschutz/allgemeine-informationen-zur-datenschutz-grundverordnung-dsgvo/vereinbarung-zur-auftragsverarbeitung-avv-mit-ionos-abschliessen/)
- [IONOS DSGVO (legalweb.io)](https://legalweb.io/en/gdpr/hosting_1_1_ionos/)
- [All-Inkl DSGVO (legalweb.io)](https://legalweb.io/en/gdpr/hosting_allinkl/)
- [All-Inkl DSE (eRecht24)](https://www.e-recht24.de/dsg/12965-all-inkl.html)
- [Strato AVV FAQ](https://www.strato.de/faq/vertrag/fragen-zur-auftragsverarbeitungsvertrag-avv-und-der-neuen-eu-datenschutzgrundverordnung-dsgvo/)
- [Strato DSGVO (legalweb.io)](https://legalweb.io/en/gdpr/hosting_strato/)
- [AWS GDPR Center](https://aws.amazon.com/de/compliance/gdpr-center/)
- [CDN DSGVO (eRecht24)](https://www.e-recht24.de/datenschutz/13279-cdn-dsgvo.html)
- [DPF 2025 Status (didomi.io)](https://www.didomi.io/blog/eu-us-data-privacy-framework-dpf-2025)
- [DPF Survives Challenge (DLA Piper)](https://privacymatters.dlapiper.com/2025/09/eu-u-s-data-privacy-framework-survives-first-challenge/)
- [EuGH prüft DPF-Berufung (WilmerHale)](https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20251201-european-court-of-justice-to-review-challenge-to-eu-us-data-privacy-framework)
- [Data Privacy Framework — offizielle Liste](https://www.dataprivacyframework.gov/list)

---

*Erstellt: Mai 2026 | Hinweis: Diese Recherche ersetzt keine rechtliche Beratung. Für die finale Datenschutzerklärung empfiehlt sich die Konsultation eines Datenschutzbeauftragten oder Fachanwalts.*
