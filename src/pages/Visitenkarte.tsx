import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function Visitenkarte() {
  const [showQR, setShowQR] = useState(false);
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "https://sven-maibaum.com/visitenkarte";

  // noindex, nofollow — this page is a private business card
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Close QR modal on Escape key
  useEffect(() => {
    if (!showQR) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowQR(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showQR]);

  const downloadVCard = async () => {
    const vcardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Maibaum;Sven;;;",
      "FN:Sven Maibaum",
      "ORG:MayStudios",
      "TITLE:Software-Architekt & Spieleentwickler",
      "EMAIL;type=INTERNET;type=WORK:company@maystudios.net",
      "URL;type=WORK:https://sven-maibaum.com",
      "URL;type=LINKEDIN:https://www.linkedin.com/in/sven-maibaum",
      "URL;type=GITHUB:https://github.com/maystudios",
      "PHOTO;VALUE=URI:https://sven-maibaum.com/assets/images/sven_maibaum_profile.webp",
      "END:VCARD",
    ].join("\n");

    const file = new File([vcardData], "Sven_Maibaum.vcf", { type: "text/vcard" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Sven Maibaum - Kontakt",
          text: "Kontaktkarte von Sven Maibaum speichern.",
        });
        return;
      } catch {
        // Fall through to download fallback
      }
    }

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Sven_Maibaum.vcf";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const addToWallet = () => {
    const link = document.createElement("a");
    link.href = "/assets/sven_maibaum.pkpass";
    link.download = "sven_maibaum.pkpass";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-ink">
      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-3">
        <button
          type="button"
          onClick={() => setShowQR(true)}
          aria-label="QR-Code anzeigen"
          title="QR-Code anzeigen"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-graphite border border-border rounded-sm p-2 transition-colors text-muted hover:text-cloud"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
            />
          </svg>
        </button>

      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-sm overflow-hidden bg-graphite border border-border">
        {/* Brand accent bar */}
        <div className="h-1 bg-brand" />

        <div className="px-6 pt-8 pb-8">
          {/* Profile photo */}
          <div className="mb-4 flex justify-center">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/sven_maibaum_profile.webp`}
              alt="Sven Maibaum"
              className="w-32 h-32 rounded-full object-cover border-4 border-graphite"
            />
          </div>

          {/* Identity */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-cloud mb-1">Sven Maibaum</h1>
            <p className="text-sm text-muted mb-2">
              Software-Architekt &amp; Spieleentwickler
            </p>
            <p className="text-xs uppercase tracking-widest text-brand">
              MayStudios
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => void downloadVCard()}
              className="swiss-btn-primary flex items-center justify-center gap-2 min-h-[44px] text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.75-.75v-3.51c0-.445.408-.799.843-.672A8.26 8.26 0 0 1 20.25 12a8.26 8.26 0 0 1-8.25 8.25 8.25 8.25 0 0 1-8.25-8.25c0-4.136 3.03-7.573 7.004-8.243.438-.074.746.347.746.784v3.462c0 .372-.281.701-.65.745C9.294 8.95 7.5 10.775 7.5 12a4.5 4.5 0 1 0 9.504-1.593Z" />
              </svg>
              Kontakt
            </button>

            <button
              type="button"
              onClick={addToWallet}
              className="swiss-btn-secondary flex items-center justify-center gap-2 min-h-[44px] text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H5.25Zm7.5 7.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm3.75-.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
              </svg>
              Wallet
            </button>

            <a
              href="mailto:company@maystudios.net"
              className="swiss-btn-secondary flex items-center justify-center gap-2 min-h-[44px] text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              Email
            </a>

            <a
              href="https://sven-maibaum.com"
              target="_blank"
              rel="noopener noreferrer"
              className="swiss-btn-secondary flex items-center justify-center gap-2 min-h-[44px] text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
              </svg>
              Website
            </a>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-6 pt-6 border-t border-border">
            <a
              href="https://www.linkedin.com/in/sven-maibaum"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-faint hover:text-cloud transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>

            <a
              href="https://github.com/maystudios"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-faint hover:text-cloud transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7"
                aria-hidden="true"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>

            <a
              href="https://maystudios.itch.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="itch.io"
              className="text-faint hover:text-cloud transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7"
                aria-hidden="true"
              >
                <path d="M3.13 1.338C2.08 1.96.02 4.328 0 4.95v1.03c0 1.303 1.22 2.45 2.325 2.45 1.326 0 2.436-1.102 2.436-2.42 0 1.318 1.08 2.42 2.406 2.42 1.328 0 2.37-1.102 2.37-2.42 0 1.318 1.112 2.42 2.44 2.42h.024c1.328 0 2.44-1.102 2.44-2.42 0 1.318 1.04 2.42 2.37 2.42 1.326 0 2.406-1.102 2.406-2.42 0 1.318 1.11 2.42 2.436 2.42C22.78 8.43 24 7.282 24 5.98V4.95c-.02-.622-2.08-2.99-3.13-3.612C19.948 1.028 12 1 12 1S4.052 1.028 3.13 1.338Zm8.89 8.36s-3.44.178-5.467.444c-.6.078-.81.618-.876 1.213-.12 1.09-.117 2.882-.117 3.64 0 0-2.6-.178-2.6 2.45 0 1.765 1.023 5.567 1.74 7.2.57 1.3 1.72 1.355 1.72 1.355H12h7.58s1.15-.055 1.72-1.356c.717-1.632 1.74-5.434 1.74-7.2 0-2.627-2.6-2.45-2.6-2.45 0-.757.003-2.548-.117-3.638-.066-.596-.276-1.136-.875-1.214-2.028-.266-5.467-.444-5.467-.444h-.04Zm-.88 3.35h1.72c.47 0 .813.145 1.044.395.23.252.357.623.357 1.108v.624h-1.07v-.54c0-.44-.2-.658-.59-.658h-.47c-.39 0-.585.22-.585.66v2.36c0 .44.195.66.585.66h.47c.39 0 .59-.22.59-.66v-.74h-.6v-.924h1.67v1.57c0 .485-.127.855-.357 1.105-.23.25-.574.395-1.044.395h-1.72c-.47 0-.814-.145-1.044-.395-.23-.25-.357-.62-.357-1.105V14.55c0-.485.127-.856.357-1.107.23-.25.574-.394 1.044-.394z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer link */}
        <div className="py-3 text-center border-t border-border">
          <Link
            to="/"
            className="text-xs text-faint hover:text-cloud transition-colors duration-200"
          >
            &larr; Zurück zum Portfolio
          </Link>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
          role="dialog"
          aria-modal="true"
          aria-label="QR-Code"
        >
          <div
            className="bg-graphite border border-border p-6 rounded-sm shadow-2xl max-w-sm w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQR(false)}
              aria-label="Schließen"
              className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-faint hover:text-cloud transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold mb-2 text-cloud">Scanne mich!</h3>
            <p className="text-sm text-muted mb-6">
              Zeige diesen Code, um deinen Kontakt zu teilen.
            </p>

            <div className="flex justify-center mb-4">
              <QRCodeCanvas
                value={currentUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                className="border-4 border-white rounded-sm"
              />
            </div>

            <p className="text-xs text-faint">Führt zu: sven-maibaum.com/visitenkarte</p>
          </div>
        </div>
      )}
    </div>
  );
}
