// Flat filled icons. Brands: simple-icons (CC0). General: Material Design Icons (Apache-2.0).
import { siAirbnb, siApplemusic, siAppstore, siBehance, siBitcoin, siBluesky, siBuymeacoffee, siDiscord, siDribbble, siEthereum, siFacebook, siFigma, siGithub, siGitlab, siGmail, siGojek, siGooglemaps, siGoogleplay, siInstagram, siKofi, siLine, siMastercard, siMastodon, siMedium, siMessenger, siNetflix, siNotion, siPatreon, siPaypal, siPinterest, siReddit, siShopee, siShopify, siSignal, siSnapchat, siSoundcloud, siSpotify, siStackoverflow, siStripe, siTelegram, siTether, siThreads, siTiktok, siTumblr, siTwitch, siUber, siVimeo, siVisa, siWechat, siWhatsapp, siX, siYoutube, siZoom } from "simple-icons";
import { mdiLink, mdiEmail, mdiPhone, mdiWifi, mdiMapMarker, mdiCart, mdiStore, mdiStar, mdiHeart, mdiRocketLaunch, mdiWeb, mdiCalendar, mdiAccountBox, mdiTicket, mdiGift, mdiMusicNote } from "@mdi/js";

const si = { siAirbnb, siApplemusic, siAppstore, siBehance, siBitcoin, siBluesky, siBuymeacoffee, siDiscord, siDribbble, siEthereum, siFacebook, siFigma, siGithub, siGitlab, siGmail, siGojek, siGooglemaps, siGoogleplay, siInstagram, siKofi, siLine, siMastercard, siMastodon, siMedium, siMessenger, siNetflix, siNotion, siPatreon, siPaypal, siPinterest, siReddit, siShopee, siShopify, siSignal, siSnapchat, siSoundcloud, siSpotify, siStackoverflow, siStripe, siTelegram, siTether, siThreads, siTiktok, siTumblr, siTwitch, siUber, siVimeo, siVisa, siWechat, siWhatsapp, siX, siYoutube, siZoom };
const md = { mdiLink, mdiEmail, mdiPhone, mdiWifi, mdiMapMarker, mdiCart, mdiStore, mdiStar, mdiHeart, mdiRocketLaunch, mdiWeb, mdiCalendar, mdiAccountBox, mdiTicket, mdiGift, mdiMusicNote };

const uri = (s) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
const lum = (hex) => { const n = parseInt(hex, 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const svg = (path, fill, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="256" height="256">${defs}<path d="${path}" fill="${fill}"/></svg>`;
const IG = '<linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#feda75"/><stop offset=".3" stop-color="#fa7e1e"/><stop offset=".55" stop-color="#d62976"/><stop offset=".8" stop-color="#962fbf"/><stop offset="1" stop-color="#4f5bd5"/></linearGradient>';

// Icon data only; the color is applied later so users can recolor.
const brand = ([key, label]) => {
  const i = si["si" + key];
  if (!i) return null;
  const b = key === "Instagram" ? "url(#ig)" : lum(i.hex) > 0.8 ? "#111827" : "#" + i.hex;
  return { id: key, label, path: i.path, brand: b };
};
const general = ([key, label]) => (md["mdi" + key] ? { id: key, label, path: md["mdi" + key], brand: "#111827" } : null);

/** Final SVG for the QR. fill = "#hex" or "brand". */
export const iconSrc = (icon, fill) => {
  const f = fill === "brand" ? icon.brand : fill;
  return uri(svg(icon.path, f, f.startsWith("url(") ? IG : ""));
};
/** Alpha-only SVG used as a CSS mask so thumbnails follow the UI theme color. */
export const maskSrc = (icon) => uri(svg(icon.path, "#000"));

const B = (l) => l.map(brand).filter(Boolean);
export const CATEGORIES = [
  { name: "Social", icons: B([["Instagram", "Instagram"], ["Facebook", "Facebook"], ["X", "X"], ["Tiktok", "TikTok"], ["Threads", "Threads"], ["Snapchat", "Snapchat"], ["Pinterest", "Pinterest"], ["Reddit", "Reddit"], ["Bluesky", "Bluesky"], ["Tumblr", "Tumblr"], ["Mastodon", "Mastodon"]]) },
  { name: "Messaging", icons: B([["Whatsapp", "WhatsApp"], ["Telegram", "Telegram"], ["Discord", "Discord"], ["Signal", "Signal"], ["Line", "LINE"], ["Messenger", "Messenger"], ["Wechat", "WeChat"], ["Gmail", "Gmail"], ["Zoom", "Zoom"]]) },
  { name: "Media", icons: B([["Youtube", "YouTube"], ["Spotify", "Spotify"], ["Twitch", "Twitch"], ["Soundcloud", "SoundCloud"], ["Applemusic", "Apple Music"], ["Netflix", "Netflix"], ["Vimeo", "Vimeo"]]) },
  { name: "Dev & Design", icons: B([["Github", "GitHub"], ["Gitlab", "GitLab"], ["Figma", "Figma"], ["Notion", "Notion"], ["Behance", "Behance"], ["Dribbble", "Dribbble"], ["Medium", "Medium"], ["Stackoverflow", "Stack Overflow"]]) },
  { name: "Payment", icons: B([["Paypal", "PayPal"], ["Stripe", "Stripe"], ["Visa", "Visa"], ["Mastercard", "Mastercard"], ["Bitcoin", "Bitcoin"], ["Ethereum", "Ethereum"], ["Tether", "Tether"], ["Patreon", "Patreon"], ["Kofi", "Ko-fi"], ["Buymeacoffee", "Buy Me a Coffee"]]) },
  { name: "Apps", icons: B([["Googlemaps", "Google Maps"], ["Googleplay", "Google Play"], ["Appstore", "App Store"], ["Shopify", "Shopify"], ["Shopee", "Shopee"], ["Gojek", "Gojek"], ["Uber", "Uber"], ["Airbnb", "Airbnb"]]) },
  { name: "General", icons: [["Link", "Link"], ["Email", "Email"], ["Phone", "Phone"], ["Wifi", "Wi-Fi"], ["MapMarker", "Location"], ["Cart", "Cart"], ["Store", "Store"], ["Star", "Star"], ["Heart", "Heart"], ["RocketLaunch", "Rocket"], ["Web", "Website"], ["Calendar", "Event"], ["AccountBox", "Contact"], ["Ticket", "Ticket"], ["Gift", "Gift"], ["MusicNote", "Music"]].map(general).filter(Boolean) },
];

export const ALL_ICONS = CATEGORIES.flatMap((c) => c.icons);