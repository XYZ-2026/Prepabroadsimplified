'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const WHATSAPP_NUMBER = '917400191765'; // +91 74001 91765
const WHATSAPP_MESSAGE = 'Hi CLARVO, I would like to know more about your counselling services.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

/**
 * Floating WhatsApp chat button, pinned to the bottom-right of the viewport.
 * Rendered into document.body via a portal so that transformed ancestors
 * (e.g. the page-transition wrapper) don't break `position: fixed`.
 */
export default function WhatsAppFloatingButton({
  raisedOnMobile = false,
}: {
  /** Lift the button on small screens so it clears a sticky bottom CTA bar. */
  raisedOnMobile?: boolean;
} = {}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className={`fixed ${raisedOnMobile ? 'bottom-24 md:bottom-6' : 'bottom-5 sm:bottom-6'} right-5 sm:right-6 z-[60] flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40`}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 sm:h-9 sm:w-9" fill="currentColor">
        <path d="M16.004 3C8.825 3 3 8.82 3 15.995c0 2.293.6 4.533 1.74 6.51L3 29l6.66-1.705a12.98 12.98 0 0 0 6.34 1.65h.005C23.18 28.945 29 23.125 29 15.95 29 12.47 27.647 9.2 25.19 6.74A12.92 12.92 0 0 0 16.004 3Zm0 23.74h-.004a10.8 10.8 0 0 1-5.5-1.505l-.395-.235-3.953 1.012 1.055-3.85-.257-.395a10.73 10.73 0 0 1-1.65-5.772c0-5.96 4.85-10.81 10.81-10.81 2.887 0 5.6 1.125 7.64 3.168a10.73 10.73 0 0 1 3.163 7.646c-.002 5.96-4.852 10.74-10.91 10.74Zm5.93-8.08c-.325-.163-1.925-.95-2.223-1.058-.298-.108-.515-.163-.732.163-.217.325-.84 1.058-1.03 1.275-.19.217-.38.244-.705.081-.325-.163-1.373-.506-2.615-1.613-.967-.862-1.62-1.927-1.81-2.252-.19-.325-.02-.5.142-.663.146-.146.325-.38.488-.57.163-.19.217-.325.325-.542.108-.217.054-.407-.027-.57-.081-.163-.732-1.763-1.003-2.415-.264-.634-.533-.548-.732-.558l-.624-.011a1.2 1.2 0 0 0-.868.407c-.298.325-1.14 1.113-1.14 2.713s1.167 3.147 1.33 3.364c.163.217 2.297 3.507 5.565 4.918.778.336 1.385.536 1.858.687.78.248 1.49.213 2.052.13.626-.094 1.925-.787 2.197-1.547.271-.76.271-1.411.19-1.547-.081-.136-.298-.217-.623-.38Z" />
      </svg>
    </a>,
    document.body,
  );
}
