"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Info } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
};

export default function PWAInstallButton({ variant = "header" }: { variant?: "header" | "hero" }) {
  const deferredPrompt = useRef<InstallPromptEvent | null>(null);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isInstalled = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    setInstalled(isInstalled());

    const onBeforeInstallPrompt = (event: Event) => {
      // Keep the browser's native prompt and show it only after the user's click.
      event.preventDefault();
      deferredPrompt.current = event as InstallPromptEvent;
      setInstallAvailable(true);
      setMessage("");
    };

    const onAppInstalled = () => {
      deferredPrompt.current = null;
      setInstallAvailable(false);
      setInstalled(true);
      setMessage("");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    // The browser can dispatch this event after the component mounts.
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function install() {
    setMessage("");

    if (installed) return;

    const promptEvent = deferredPrompt.current;
    if (promptEvent) {
      // Call prompt() directly from this click handler to preserve user activation.
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;

        deferredPrompt.current = null;
        setInstallAvailable(false);

        if (choice.outcome === "accepted") {
          setInstalled(true);
          setMessage("TREAN AI installation started.");
        } else {
          setMessage("Installation was cancelled. Tap Install now to try again.");
        }
      } catch {
        deferredPrompt.current = null;
        setInstallAvailable(false);
        setMessage("The native install prompt could not open. Use your browser menu to install TREAN AI.");
      }
      return;
    }

    // beforeinstallprompt is intentionally not available in every browser.
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setMessage(
      isIOS
        ? "To install TREAN AI, tap Share and choose Add to Home Screen."
        : "Install isn't available in this browser yet. In Chrome, open ⋮ and choose Install app or Add to Home screen."
    );
  }

  if (installed) return null;

  return (
    <div className={variant === "hero" ? "pwa-install-wrap hero-install-wrap" : "pwa-install-wrap"}>
      <button
        type="button"
        className={variant === "hero" ? "btn pwa-install hero-install" : "pwa-install"}
        onClick={install}
        aria-label="Install TREAN AI app"
      >
        <Download size={variant === "hero" ? 17 : 16} />
        <span>{variant === "hero" ? "Install now" : "Install App"}</span>
      </button>
      {message && (
        <div className="pwa-hint" role="status" aria-live="polite">
          <Info size={14} />
          {message}
        </div>
      )}
    </div>
  );
}
