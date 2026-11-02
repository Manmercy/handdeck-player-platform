// Keep a one-time copy of existing TOMEO browser data when visitors open Hand Deck.
// The new keys then remain independent, so the two previews cannot overwrite each other.
try {
  const marker = 'handdeck-storage-migrated-v1';
  if (!localStorage.getItem(marker)) {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith('verso-')) continue;
      const target = 'handdeck-' + key.slice('verso-'.length);
      if (localStorage.getItem(target) === null) {
        localStorage.setItem(target, localStorage.getItem(key));
      }
    }
    localStorage.setItem(marker, '1');
  }
} catch {
  // The app can still run with the storage available to the browser.
}
