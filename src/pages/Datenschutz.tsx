import ConsentSettingsButton from "../consent/ConsentSettingsButton";
import { GA_SESSION_COOKIE } from "../consent/googleAnalytics";

/**
 * Privacy policy. Every vendor fact has a source with its reading date in
 * docs/research/2026-10-16-legal.md and docs/research/2026-10-17-google-analytics-consent.md;
 * the behaviour described in sections 5 to 7 is checked by tests/e2e/consent.spec.ts.
 */


function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="footer-link">
      {children}
    </a>
  );
}

export default function Datenschutz() {
  return (
    <article className="container mx-auto px-6 section-padding project-detail-container project-detail-content">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        <span className="gradient-text">Datenschutzerklärung</span>
      </h1>

      <h2>1. Überblick</h2>
      <p>
        Diese Seite informiert Sie darüber, welche personenbezogenen Daten beim Besuch dieser Website verarbeitet werden,
        zu welchem Zweck, auf welcher Rechtsgrundlage und welche Rechte Sie haben. Maßgeblich sind die
        Datenschutz-Grundverordnung (DSGVO), das Bundesdatenschutzgesetz (BDSG) und das
        Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG).
      </p>
      <p>
        Ohne Ihre Einwilligung lädt diese Website nur Dateien von ihrem eigenen Server und setzt keine Cookies. Google
        Analytics (Abschnitt 6) und das Steam-Widget (Abschnitt 7) laden erst, wenn Sie in den Cookie-Einstellungen
        eingewilligt haben (Abschnitt 5).
      </p>
      <p>
        Sie sind weder gesetzlich noch vertraglich verpflichtet, Daten bereitzustellen. Ohne die Verbindungsdaten aus
        Abschnitt 3 kann die Website nicht angezeigt werden, und ohne Kontaktdaten kann ich Ihre Anfrage nicht
        beantworten. Einwilligungen sind freiwillig; ohne sie funktioniert die Website vollständig, nur das Steam-Widget
        erscheint dann als Bild mit Link. Eine automatisierte Entscheidungsfindung einschließlich Profiling nach Art. 22
        DSGVO findet nicht statt.
      </p>

      <h2>2. Verantwortlicher</h2>
      <p>Verantwortlich nach Art. 4 Nr. 7 DSGVO:</p>
      <address className="not-italic leading-7">
        <strong>Sven Maibaum</strong>
        <br />
        Bürgermeister-Schmidt-Str. 72B
        <br />
        51399 Burscheid
        <br />
        Deutschland
      </address>
      <p>
        E-Mail: <a href="mailto:contact@sven-maibaum.com" className="footer-link">contact@sven-maibaum.com</a>
        <br />
        E-Mail (geschäftlich): <a href="mailto:company@maystudios.net" className="footer-link">company@maystudios.net</a>
      </p>
      <p>
        Ein Datenschutzbeauftragter ist nicht bestellt. Die Voraussetzungen nach Art. 37 DSGVO liegen nicht vor.
      </p>

      <h2>3. Hosting und Server-Logs (GitHub Pages)</h2>
      <p>
        Diese Website wird über GitHub Pages bereitgestellt, einen Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. St.,
        San Francisco, CA 94107, USA. GitHub liefert alle Dateien der Website aus, auch die Schriftarten Geist und Geist
        Mono, die Bilder und die Skripte. Schriften und Symbole werden nicht von anderen Anbietern nachgeladen.
      </p>
      <p>
        Wenn Sie die Website aufrufen, protokolliert GitHub nach eigener Angabe Ihre IP-Adresse zu Sicherheitszwecken.
        Solche Protokolle umfassen laut der Datenschutzerklärung von GitHub die IP-Adresse, Angaben zum Gerät, Angaben
        zur Sitzung sowie Datum und Uhrzeit der Anfrage.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse ist eine sichere und
        stabile Bereitstellung der Website.
      </p>
      <p>
        <strong>Speicherdauer:</strong> GitHub nennt keine feste Frist. Nach Angabe von GitHub richtet sich die Dauer
        nach dem Zweck der Erhebung, hier der Sicherheit, und nach gesetzlichen Pflichten.
      </p>
      <p>
        <strong>Drittlandübermittlung:</strong> GitHub stützt Übermittlungen nach eigener Angabe in der Regel auf die
        Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO) und ist zusätzlich nach dem EU-U.S. Data
        Privacy Framework zertifiziert (Angemessenheitsbeschluss der EU-Kommission vom 10.07.2023, Art. 45 DSGVO).
      </p>
      <p>
        Datenschutzerklärung von GitHub:{" "}
        <ExternalLink href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement">
          docs.github.com/site-policy/privacy-policies/github-general-privacy-statement
        </ExternalLink>
      </p>

      <h2>4. Kontakt per E-Mail und Kontaktformular</h2>
      <h3>E-Mail</h3>
      <p>
        Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre E-Mail-Adresse, Ihren Namen, soweit Sie ihn angeben, und
        den Inhalt Ihrer Nachricht, um Ihre Anfrage zu beantworten. Das Postfach contact@sven-maibaum.com liegt bei
        Google Workspace. Google verarbeitet die E-Mails dort als mein Auftragsverarbeiter nach dem
        Datenverarbeitungszusatz von Google Cloud. Danach können die Daten in jedem Land verarbeitet werden, in dem
        Google oder seine Unterauftragsverarbeiter Einrichtungen unterhalten; Übermittlungen in Drittländer stützt Google
        auf einen anerkannten Übermittlungsmechanismus oder auf die Standardvertragsklauseln.
      </p>
      <h3>Kontaktformular (EmailJS)</h3>
      <p>
        Wenn Sie das Kontaktformular nutzen, werden Ihre Eingaben (Name, E-Mail-Adresse, Nachricht) sowie technische
        Daten (IP-Adresse, Zeitstempel) an den Dienst EmailJS übertragen. EmailJS stellt die Nachricht über mein
        E-Mail-Postfach bei Google Workspace an mich zu und schickt Ihnen eine automatische Eingangsbestätigung an die
        angegebene E-Mail-Adresse. Das Formular sendet erst, wenn Sie auf „Nachricht senden“ klicken.
      </p>
      <p>
        <strong>Dienstleister:</strong> EmailJS Pte. Ltd., Singapur. Die Server von EmailJS stehen in den USA und
        werden von Amazon Web Services betrieben.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO. Die Verarbeitung ist zur Beantwortung Ihrer
        Anfrage und damit zur Aufnahme einer vorvertraglichen Kommunikation erforderlich. Das gilt für E-Mails ebenso.
      </p>
      <p>
        <strong>Drittlandübermittlung:</strong> EmailJS verarbeitet Daten auf Servern in den USA. Für EmailJS gilt
        weder ein Angemessenheitsbeschluss noch das EU-U.S. Data Privacy Framework. Die Datenübermittlung erfolgt
        deshalb auf Grundlage der EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO), die Teil der
        Datenverarbeitungsvereinbarung von EmailJS sind (emailjs.com/legal/data-protection-agreement/).
      </p>
      <p>
        <strong>Speicherdauer:</strong> Die übermittelten Daten verbleiben, bis die Anfrage abschließend bearbeitet ist
        (in der Regel innerhalb von drei Monaten nach der letzten Antwort). Auf Anfrage werden Ihre Daten unverzüglich
        gelöscht, soweit keine gesetzliche Aufbewahrungspflicht entgegensteht. Bei EmailJS bleiben die Daten nach Angabe
        des Anbieters 30 Tage gespeichert; IP-Protokolle kann EmailJS vorübergehend zur Abwehr von Missbrauch und Betrug
        aufbewahren.
      </p>
      <p>
        <strong>Hinweis:</strong> Das Kontaktformular setzt selbst keine Cookies und nutzt keinen lokalen Speicher. Ihre
        Eingaben im Formular gehen nie an Google Analytics (siehe Abschnitt 6).
      </p>
      <p>
        Datenschutzerklärung von EmailJS:{" "}
        <ExternalLink href="https://www.emailjs.com/legal/privacy-policy/">emailjs.com/legal/privacy-policy/</ExternalLink>
      </p>

      <h2>5. Einwilligung und gespeicherte Auswahl</h2>
      <p>
        Beim ersten Besuch fragt ein Hinweis nach Ihrer Einwilligung in zwei Kategorien: „Statistik“ (Google Analytics,
        Abschnitt 6) und „Externe Medien“ (Steam-Widget, Abschnitt 7). Nichts ist vorausgewählt, und „Ablehnen“ ist so
        einfach wie „Alle akzeptieren“. Der Hinweis ist ein eigener Bestandteil dieser Website; kein fremder Dienst ist
        daran beteiligt.
      </p>
      <p>
        Ihre Auswahl speichert die Website im lokalen Speicher (localStorage) Ihres Browsers unter dem Schlüssel
        „consent“: je Kategorie Ihre Entscheidung, die Version des Hinweises und den Zeitpunkt der letzten Änderung. Der
        Eintrag enthält keine Kennung, bleibt auf Ihrem Gerät und wird weder an mich noch an Dritte übertragen.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> § 25 Abs. 2 Nr. 2 TDDDG. Die Speicherung ist unbedingt erforderlich, damit die
        Website die Wahl beachten kann, die Sie ausdrücklich getroffen haben.
      </p>
      <p>
        <strong>Speicherdauer:</strong> Die Auswahl gilt zwölf Monate. Danach, oder wenn sich die Kategorien oder
        Anbieter ändern, fragt die Website erneut. Sie können den Eintrag jederzeit selbst löschen, indem Sie die
        Websitedaten in Ihrem Browser löschen.
      </p>
      <p>
        <strong>Widerruf:</strong> Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen, über
        „Cookie-Einstellungen“ im Fuß jeder Seite oder hier. Der Widerruf wirkt sofort, ohne dass die Seite neu geladen
        wird. Die Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt davon unberührt (Art. 7 Abs. 3 DSGVO).
      </p>
      <p>
        <ConsentSettingsButton className="swiss-btn-secondary" />
      </p>

      <h2>6. Statistik mit Google Analytics</h2>
      <p>
        Wenn Sie in „Statistik“ einwilligen, nutzt diese Website Google Analytics 4. Damit sehe ich, wie viele Menschen
        die Website besuchen, welche Seiten sie aufrufen und über welche Seiten sie kommen, und kann die Website danach
        verbessern. Ohne Ihre Einwilligung lädt die Website kein Skript von Google und sendet keine Daten an Google.
      </p>
      <p>
        <strong>Anbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Google
        verarbeitet die Daten als mein Auftragsverarbeiter (Art. 28 DSGVO) nach den Google
        Auftragsdatenverarbeitungsbedingungen für Werbeprodukte, die für Unternehmen im Europäischen Wirtschaftsraum
        Teil der Nutzungsbedingungen von Google Analytics sind. Nach den Einstellungen meines Google-Analytics-Kontos
        darf Google die Daten außerdem zur Verbesserung eigener Produkte und Dienste und für zusammengefasste
        Vergleichswerte nutzen; dafür ist Google selbst verantwortlich.
      </p>
      <p>
        <strong>Verarbeitete Daten:</strong> Bei jedem Seitenaufruf, auch beim Wechsel zwischen Seiten dieser Website,
        sendet Ihr Browser an Google: die Adresse und den Titel der Seite, die zuvor besuchte Seite, die Spracheinstellung,
        die Bildschirmauflösung, Angaben zu Browser, Betriebssystem und Gerät sowie die Kennung aus dem Cookie _ga. Zusätzlich erfasst Google Analytics, wenn Sie eine Seite zu 90 % durchscrollen, einen Link zu einer anderen
        Website anklicken, eine Datei herunterladen oder beginnen, das Kontaktformular auszufüllen, oder es absenden.
        Beim Kontaktformular übermittelt Google Analytics nur Merkmale des Formulars wie die Zieladresse, die Zahl der
        Felder und den Namen des ersten Feldes, nie Ihre Eingaben.
      </p>
      <p>
        Ihre IP-Adresse erreicht Google technisch bedingt. Bei Zugriffen aus der EU verwendet Google sie nach eigener
        Angabe nur, um daraus den ungefähren Standort (Land, Region, Stadt) abzuleiten, und verwirft sie danach sofort;
        Google Analytics protokolliert und speichert keine IP-Adressen.
      </p>
      <p>
        <strong>Cookies:</strong> _ga dient zur Unterscheidung von Besuchern, {GA_SESSION_COOKIE} speichert den Status der
        Sitzung. Google Analytics setzt beide als Cookies dieser Website. Sie gelten zwei Jahre ab Ihrem letzten Besuch,
        sofern Ihr Browser die Laufzeit nicht verkürzt.
      </p>
      <p>
        <strong>Einstellungen:</strong> Die Website schaltet Google-Signale ab und untersagt Google, die Daten für
        personalisierte Werbung zu nutzen. Im Einwilligungsmodus von Google bleiben die Kategorien für Werbung (ad_storage,
        ad_user_data, ad_personalization) verweigert; erteilt wird nur analytics_storage. Eine Nutzer-ID wird nicht
        verwendet.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG.
      </p>
      <p>
        <strong>Speicherdauer:</strong> Die Cookies gelten wie oben beschrieben. Daten zu einzelnen Ereignissen löscht
        Google automatisch nach 2 Monaten. Auf Besucher bezogene Daten löscht Google 14 Monate nach dem letzten Besuch;
        jeder neue Besuch setzt diese Frist zurück. Zusammengefasste Standardberichte sind von diesen Fristen nicht
        betroffen.
      </p>
      <p>
        <strong>Empfänger und Drittlandübermittlung:</strong> Empfänger ist Google, als mein Auftragsverarbeiter und
        für die oben genannten eigenen Zwecke als eigener Verantwortlicher. Google
        verarbeitet die Daten auch in den USA. Die Google LLC ist nach dem EU-U.S. Data Privacy Framework zertifiziert
        (Angemessenheitsbeschluss der EU-Kommission vom 10.07.2023, Art. 45 DSGVO). Google stützt Übermittlungen für
        seine Werbe- und Analyseprodukte nach eigener Angabe seit dem 01.09.2023 darauf und kann
        Standardvertragsklauseln nutzen, wo dieser Rahmen nicht greift.
      </p>
      <p>
        <strong>Widerruf:</strong> Über „Cookie-Einstellungen“ (Abschnitt 5). Ab dann erfasst Google Analytics auf dieser
        Website nichts mehr, und die Website löscht die Cookies _ga und {GA_SESSION_COOKIE}. Ein Ereignis, das unmittelbar
        vor dem Widerruf erfasst wurde, kann Google Analytics noch übertragen. Zusätzlich bietet Google ein Browser-Add-on
        zur Deaktivierung von Google Analytics an:{" "}
        <ExternalLink href="https://tools.google.com/dlpage/gaoptout">tools.google.com/dlpage/gaoptout</ExternalLink>
      </p>
      <p>
        Datenschutzerklärung von Google:{" "}
        <ExternalLink href="https://policies.google.com/privacy">policies.google.com/privacy</ExternalLink>. Wie Google
        Daten von Websites verwendet, die Google-Dienste nutzen:{" "}
        <ExternalLink href="https://policies.google.com/technologies/partner-sites">
          policies.google.com/technologies/partner-sites
        </ExternalLink>
      </p>

      <h2>7. Steam-Widget (Valve)</h2>
      <p>
        Auf den Projektseiten zu HeistLine und Mr. Dork 3 kann ein Widget aus dem Steam-Store eingebunden werden.
        Anbieter ist die Valve Corporation, P.O. Box 1688, Bellevue, WA 98009, USA. Vertreter von Valve in der EU ist
        die RIVACY GmbH, Mexikoring 33, 22297 Hamburg.
      </p>
      <p>
        Ohne Ihre Einwilligung zeigt die Seite stattdessen ein eigenes Bild und einen Link zum Steam-Store; dabei geht
        keine Anfrage an Valve. Erst wenn Sie in „Externe Medien“ einwilligen, auch über die Schaltfläche
        „Steam-Widget laden“, lädt Ihr Browser das Widget von store.steampowered.com und Bilder und Skripte dazu von
        Servern unter steamstatic.com. Dabei erhält Valve Ihre IP-Adresse, Angaben zu Ihrem Browser und die Adresse
        dieser Website.
        Valve protokolliert nach eigener Angabe die IP-Adresse.
      </p>
      <p>
        Valve setzt dabei Cookies auf seiner eigenen Domain. Bei einer Prüfung am 17.10.2026 war das das Cookie
        „sessionid“ von store.steampowered.com, das bis zum Ende der Browsersitzung gilt und nach Angabe von Valve dem
        Schutz vor Angriffen (Cross-Site-Request-Forgery) dient.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG.
      </p>
      <p>
        <strong>Speicherdauer:</strong> Wie lange Valve die Daten speichert, bestimmt Valve; für die weitere Verarbeitung
        ist Valve selbst verantwortlich. Einzelheiten nennt die Datenschutzerklärung von Valve.
      </p>
      <p>
        <strong>Drittlandübermittlung:</strong> Valve ist nach dem EU-U.S. Data Privacy Framework zertifiziert (Art. 45
        DSGVO) und nennt zusätzlich Standardvertragsklauseln.
      </p>
      <p>
        <strong>Widerruf:</strong> Über „Cookie-Einstellungen“ (Abschnitt 5); das Widget verschwindet sofort. Cookies,
        die Valve bereits gesetzt hat, gehören zur Domain von Valve, und diese Website kann sie nicht löschen. Sie können
        sie in Ihrem Browser löschen.
      </p>
      <p>
        Datenschutzerklärung von Valve:{" "}
        <ExternalLink href="https://store.steampowered.com/privacy_agreement/">
          store.steampowered.com/privacy_agreement/
        </ExternalLink>
      </p>

      <h2>8. Externe Links</h2>
      <p>
        Diese Website enthält Links zu anderen Websites, etwa GitHub, LinkedIn, TikTok, YouTube oder dem Steam-Store.
        Erst wenn Sie einen Link anklicken, ruft Ihr Browser die Seite des jeweiligen Betreibers auf; für den Datenschutz
        dort ist ausschließlich dieser Betreiber verantwortlich. Vor dem Klick werden keine Daten an die verlinkten
        Betreiber übertragen. Es handelt sich um einfache Links ohne Social-Plugins.
      </p>

      <h2>9. Übermittlung in Drittländer</h2>
      <p>Folgende Dienste übermitteln personenbezogene Daten in Länder außerhalb der EU:</p>
      <ul>
        <li>
          <strong>GitHub Pages</strong> (Hosting), GitHub, Inc., USA: Standardvertragsklauseln (Art. 46 Abs. 2 lit. c
          DSGVO) und Data Privacy Framework (Art. 45 DSGVO).
        </li>
        <li>
          <strong>EmailJS</strong> (Kontaktformular), EmailJS Pte. Ltd., Singapur (kein Angemessenheitsbeschluss), Server
          in den USA: Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
        </li>
        <li>
          <strong>Google Workspace</strong> (E-Mail-Postfach): anerkannter Übermittlungsmechanismus oder
          Standardvertragsklauseln nach dem Datenverarbeitungszusatz von Google Cloud (Abschnitt 4).
        </li>
        <li>
          <strong>Google Analytics</strong> (nur mit Ihrer Einwilligung), Google LLC, USA: Data Privacy Framework (Art. 45
          DSGVO), Standardvertragsklauseln, wo dieser Rahmen nicht greift.
        </li>
        <li>
          <strong>Valve</strong> (Steam-Widget, nur mit Ihrer Einwilligung), Valve Corporation, USA: Data Privacy Framework
          (Art. 45 DSGVO) und Standardvertragsklauseln.
        </li>
      </ul>
      <p>
        Der Angemessenheitsbeschluss zum EU-U.S. Data Privacy Framework ist der Durchführungsbeschluss (EU) 2023/1795
        der EU-Kommission vom 10.07.2023. Die Standardvertragsklauseln der EU-Kommission sind im Durchführungsbeschluss
        (EU) 2021/914 veröffentlicht; eine Kopie erhalten Sie auch auf Anfrage bei mir.
      </p>

      <h2>10. Verschlüsselung</h2>
      <p>
        Diese Website wird nur über HTTPS ausgeliefert; Aufrufe über HTTP werden auf HTTPS umgeleitet. Die Verbindung
        zwischen Ihrem Browser und dem Server ist damit verschlüsselt (Art. 32 Abs. 1 lit. a DSGVO), und Dritte können
        übertragene Daten nicht ohne Weiteres mitlesen.
      </p>

      <h2>11. Ihre Rechte</h2>
      <p>Sie haben gegenüber mir als Verantwortlichem folgende Rechte:</p>

      <h3>Auskunftsrecht (Art. 15 DSGVO)</h3>
      <p>
        Sie können Auskunft darüber verlangen, ob und welche personenbezogenen Daten ich über Sie verarbeite, zu welchem
        Zweck, aus welcher Quelle und für wie lange.
      </p>

      <h3>Recht auf Berichtigung (Art. 16 DSGVO)</h3>
      <p>Sie können die Berichtigung unrichtiger oder die Vervollständigung unvollständiger Daten verlangen.</p>

      <h3>Recht auf Löschung (Art. 17 DSGVO)</h3>
      <p>
        Sie können die Löschung Ihrer Daten verlangen, soweit keine gesetzlichen Aufbewahrungspflichten oder sonstige
        Rechtsgründe entgegenstehen.
      </p>

      <h3>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</h3>
      <p>Unter bestimmten Voraussetzungen können Sie verlangen, dass die Verarbeitung Ihrer Daten eingeschränkt wird.</p>

      <h3>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h3>
      <p>
        Daten, die auf einer Einwilligung oder einem Vertrag beruhen, erhalten Sie auf Anfrage in einem strukturierten,
        gängigen und maschinenlesbaren Format.
      </p>

      <h3>Widerspruchsrecht (Art. 21 DSGVO)</h3>
      <p>
        <strong>Wichtig:</strong> Soweit ich Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
        verarbeite, können Sie dieser Verarbeitung jederzeit widersprechen, wenn Gründe vorliegen, die sich aus Ihrer
        besonderen Situation ergeben. Ich verarbeite Ihre Daten dann nicht weiter, es sei denn, ich kann zwingende
        schutzwürdige Gründe nachweisen, die Ihre Interessen überwiegen.
      </p>

      <h3>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</h3>
      <p>
        Beruht eine Verarbeitung auf einer Einwilligung, können Sie diese jederzeit mit Wirkung für die Zukunft
        widerrufen, für Google Analytics und das Steam-Widget über „Cookie-Einstellungen“ (Abschnitt 5). Die
        Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt davon unberührt.
      </p>

      <p>
        Zur Ausübung Ihrer Rechte wenden Sie sich an:{" "}
        <a href="mailto:contact@sven-maibaum.com" className="footer-link">contact@sven-maibaum.com</a>
      </p>

      <h2>12. Beschwerderecht bei der Aufsichtsbehörde</h2>
      <p>
        Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt, können
        Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in dem Mitgliedstaat
        Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.
      </p>
      <p>Für den Verantwortlichen (Sitz in Nordrhein-Westfalen) ist zuständig:</p>
      <address className="not-italic leading-7">
        <strong>Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)</strong>
        <br />
        Postfach 20 04 44
        <br />
        40102 Düsseldorf
        <br />
        Besucheranschrift: Kavalleriestr. 2-4, 40213 Düsseldorf
      </address>
      <p>
        Telefon: +49 211 38424-0
        <br />
        E-Mail: <a href="mailto:poststelle@ldi.nrw.de" className="footer-link">poststelle@ldi.nrw.de</a>
        <br />
        Website: <ExternalLink href="https://www.ldi.nrw.de">ldi.nrw.de</ExternalLink>
      </p>

      <h2>13. Widerspruch gegen Werbe-E-Mails</h2>
      <p>
        Der Nutzung der in dieser Datenschutzerklärung und im Impressum veröffentlichten Kontaktdaten zur Übersendung
        nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird widersprochen. Der Betreiber behält
        sich rechtliche Schritte für den Fall der unverlangten Zusendung von Werbung, etwa durch Spam-Mails, ausdrücklich
        vor.
      </p>

      <h2>14. Stand dieser Datenschutzerklärung</h2>
      <p>
        Diese Datenschutzerklärung hat den Stand vom <time dateTime="2026-10-17">17. Oktober 2026</time>. Ändert sich die
        Website oder ändern sich gesetzliche oder behördliche Vorgaben, wird sie angepasst. Die jeweils aktuelle Fassung
        ist auf dieser Seite abrufbar.
      </p>

      <hr className="my-8 border-border" />

      <p className="text-sm footer-text-muted">
        © 2026 Sven Maibaum. Alle Rechte vorbehalten.
        <br />
        Zuletzt aktualisiert: <time dateTime="2026-10-17">17.10.2026</time>
      </p>
    </article>
  );
}
