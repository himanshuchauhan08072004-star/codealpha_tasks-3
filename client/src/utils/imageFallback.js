// Swaps a broken product image for a neutral inline placeholder - no network request,
// so it always renders even if the remote photo host is unreachable.
const FALLBACK_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#F6F7F9"/>
      <path d="M60 130 L85 95 L105 115 L130 80 L150 130 Z" fill="#12213B" opacity="0.15"/>
      <circle cx="75" cy="75" r="12" fill="#12213B" opacity="0.15"/>
    </svg>`
  );

export const handleImageError = (e) => {
  if (e.target.src !== FALLBACK_IMAGE) {
    e.target.src = FALLBACK_IMAGE;
    e.target.onerror = null; // prevent loop if the fallback itself somehow fails
  }
};
