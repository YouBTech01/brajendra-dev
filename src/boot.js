// True while the boot screen is up: nothing is allowed to "land" (animate or play a sound)
// until it has gone, so every section starts fresh the moment the site is revealed.
let booting = true
export const isBooting = () => booting
export const endBoot = () => {
  booting = false
}
