import React from 'react';
import { MapPin, Phone, Instagram, Facebook, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mon(1)–Thu(4): 8:00 AM – 10:00 PM  |  Fri(5)–Sun(0): 8:00 AM – 10:30 PM
function getHoursForDay(dayIndex) {
  return dayIndex >= 1 && dayIndex <= 4
    ? '8:00 AM – 10:00 PM'
    : '8:00 AM – 10:30 PM';
}

function isOpenNow() {
  const now = new Date();
  const day = now.getDay();
  const asMinutes = now.getHours() * 60 + now.getMinutes();
  const closeMinutes = day >= 1 && day <= 4 ? 22 * 60 : 22 * 60 + 30;
  return asMinutes >= 8 * 60 && asMinutes < closeMinutes;
}

export function Footer() {
  const open = isOpenNow();
  const today = new Date().getDay();
  const tomorrow = (today + 1) % 7;

  return (
    <footer className="mt-20 border-t border-slate-100 bg-slate-50/60 py-10 text-sm text-slate-600 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
      <div className="section-shell grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div itemScope itemType="https://schema.org/LocalBusiness">
          <h3 className="flex items-center gap-2.5 text-base font-bold text-slate-900 dark:text-white">
            <img src="/logo-mark.svg" alt="" className="h-10 w-10 flex-shrink-0" />
            <span itemProp="name">Boutique La Différence</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            <span itemProp="description">
              A premium neighborhood grocery and home utensils store in Zindiro, Kigali — combining
              freshness, thoughtful curation, and warm service for every visit.
            </span>
          </p>
          <meta itemProp="latitude" content="-1.9286798" />
          <meta itemProp="longitude" content="30.1381128" />
          <div className="mt-4 h-28 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <iframe
              title="Boutique La Différence - Zindiro, Kigali"
              src="https://www.google.com/maps?q=-1.9286798,30.1381128&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://www.google.com/maps/place/34CQ%2BG77,+KG+11+Ave,+Kigali/@-1.9286798,30.1381128,17z"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-brand transition hover:text-brand-dark"
          >
            <MapPin className="h-3.5 w-3.5" />
            Get directions
          </a>
        </div>

        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Visit us
          </h4>
          <div className="mt-3 space-y-2.5 text-sm">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-brand" />
              <span itemScope itemType="https://schema.org/PostalAddress">
                <span itemProp="streetAddress">Zindiro</span>, 
                <span itemProp="addressLocality"> Kigali</span>, 
                <span itemProp="addressCountry"> Rwanda</span>
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-brand" />
              <a href="tel:+250794018454" className="hover:text-brand">
                <span itemScope itemType="https://schema.org/Organization">
                  <span itemProp="telephone">+250 794 018 454</span>
                </span>
              </a>
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  open ? 'bg-brand' : 'bg-red-500'
                }`}
              />
              {open ? 'We are open now' : 'Currently closed'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Opening hours
          </h4>
          <div className="mt-3 space-y-1.5 text-sm">
            <p className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-brand" />
              <span>Today: {getHoursForDay(today)}</span>
            </p>
            <p className="pl-[26px] text-slate-500">Tomorrow: {getHoursForDay(tomorrow)}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <a
              href="https://wa.me/250794018454"
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <div className="section-shell mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-5 text-xs text-slate-400 dark:border-slate-800 md:flex-row">
        <p>© {new Date().getFullYear()} Boutique La Différence. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 transition hover:-translate-y-0.5 hover:text-brand"
            aria-label="Visit our Instagram"
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 transition hover:-translate-y-0.5 hover:text-brand"
            aria-label="Visit our Facebook"
          >
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </a>
          <Link to="/contact" className="transition hover:-translate-y-0.5 hover:text-brand">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
