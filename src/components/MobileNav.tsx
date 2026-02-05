import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const services = [
  { href: "/diensten/groepenkast/", label: "Groepenkast Vervangen" },
  { href: "/diensten/laadpaal/", label: "Laadpaal Installatie" },
  { href: "/diensten/renovatie/", label: "Elektra Renovatie" },
  { href: "/diensten/verlichting/", label: "Verlichting & Lichtplan" },
  { href: "/diensten/zonnepanelen/", label: "Zonnepanelen & Omvormer" },
  { href: "/diensten/inductie/", label: "Inductie & Kookgroep" },
];

export default function MobileNav() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dienstenOpen, setDienstenOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    setDienstenOpen(false);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow animation to start
      requestAnimationFrame(() => closeRef.current?.focus());
    } else {
      burgerRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <>
      <button
        ref={burgerRef}
        onClick={() => setIsOpen(true)}
        aria-label="Menu openen"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        className="p-2 text-primary hover:text-accent transition-colors"
      >
        <Menu size={28} />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 z-[9998]"
                onClick={close}
                aria-hidden="true"
              />

              {/* Nav Panel */}
              <motion.nav
                id="mobile-nav-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Mobiel navigatiemenu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 right-0 bottom-0 w-[280px] max-w-[85vw] bg-surface z-[9999] shadow-xl flex flex-col overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="text-lg font-bold font-heading text-primary">
                    Menu
                  </span>
                  <button
                    ref={closeRef}
                    onClick={close}
                    aria-label="Menu sluiten"
                    className="p-2 text-primary hover:text-accent transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 py-4 pb-[84px]">
                  {/* Diensten Accordion */}
                  <div>
                    <button
                      onClick={() => setDienstenOpen(!dienstenOpen)}
                      aria-expanded={dienstenOpen}
                      aria-controls="diensten-submenu"
                      className="w-full flex items-center justify-between px-6 py-3 text-base font-medium text-primary hover:text-accent transition-colors"
                    >
                      Diensten
                      <motion.span
                        animate={{ rotate: dienstenOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {dienstenOpen && (
                        <motion.div
                          id="diensten-submenu"
                          role="region"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-6 pr-4 pb-1">
                            {services.map((service) => (
                              <a
                                key={service.href}
                                href={service.href}
                                className="block px-4 py-2.5 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                {service.label}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <a
                    href="/projecten/"
                    className="block px-6 py-3 text-base font-medium text-primary hover:text-accent transition-colors"
                  >
                    Projecten
                  </a>

                  <a
                    href="/over-ons/"
                    className="block px-6 py-3 text-base font-medium text-primary hover:text-accent transition-colors"
                  >
                    Over Ons
                  </a>

                  {/* CTA */}
                  <div className="px-6 pt-6">
                    <a href="/offerte/" className="btn-primary w-full text-center">
                      Offerte Aanvragen
                    </a>
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
