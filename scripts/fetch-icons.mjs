// Downloads the Iconify icons used by the site into src/icons/ so they ship with the bundle
// (no runtime API calls). Browse sets at https://icon-sets.iconify.design/ and add names here.
import { mkdir, writeFile } from 'node:fs/promises'

const sets = {
  solar: [
    'smartphone-linear', 'global-linear', 'code-linear', 'cpu-bolt-linear', 'play-circle-linear',
    'cart-large-2-linear', 'rocket-2-linear', 'pallete-2-linear', 'plug-circle-linear',
    'gamepad-linear', 'book-2-linear', 'music-notes-linear', 'hamburger-menu-linear',
    'close-linear', 'sun-2-linear', 'moon-linear', 'arrow-right-linear', 'arrow-right-up-linear',
    'alt-arrow-down-linear', 'home-2-linear', 'user-circle-linear',
    'widget-5-linear', 'clapperboard-play-linear', 'letter-linear', 'users-group-rounded-linear',
    'database-linear', 'heart-linear', 'heart-bold', 'share-linear', 'link-round-linear',
    'map-point-linear', 'moon-stars-linear', 'videocamera-record-linear', 'alt-arrow-right-linear', 'bell-linear', 'volume-loud-linear', 'volume-cross-linear',
    'arrow-left-linear', 'magnifer-linear', 'menu-dots-bold', 'add-circle-linear', 'chat-round-dots-linear', 'plain-linear', 'bookmark-linear', 'widget-4-linear', 'paperclip-linear', 'microphone-linear', 'smile-circle-linear', 'book-bookmark-linear', 'star-linear', 'eye-linear', 'lock-linear', 'check-read-linear', 'home-angle-2-linear', 'videocamera-linear', 'user-plus-linear', 'hamburger-menu-linear', 'bell-bing-linear', 'compass-big-linear', 'home-smile-linear', 'users-group-two-rounded-linear', 'play-bold', 'arrow-up-linear', 'branching-paths-up-linear', 'star-linear', 'copy-linear', 'restart-linear', 'stop-circle-linear', 'power-linear', 'layers-minimalistic-linear', 'compass-linear', 'check-circle-bold', 'flashlight-linear', 'camera-linear',
  ],
  'simple-icons': ['youtube', 'instagram', 'telegram', 'github'],
  logos: ['flutter-icon', 'android-icon', 'kotlin-icon', 'java', 'python', 'html-5', 'css-3', 'javascript'],
}

await mkdir(new URL('../src/icons/', import.meta.url), { recursive: true })
for (const [prefix, icons] of Object.entries(sets)) {
  const res = await fetch(`https://api.iconify.design/${prefix}.json?icons=${icons.join(',')}`)
  const data = await res.json()
  if (data.not_found?.length) throw new Error(`${prefix}: not found: ${data.not_found.join(', ')}`)
  await writeFile(new URL(`../src/icons/${prefix}.json`, import.meta.url), JSON.stringify(data))
  console.log(prefix, Object.keys(data.icons).length, 'icons')
}
