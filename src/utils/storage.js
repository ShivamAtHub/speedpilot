const DEFAULTS = {
  speed: 2,
  smartResume: true,
  perChannel: false,
  autoApply: true,
  maxSpeed: 3,
  keyboardShortcuts: true,
  channelSpeeds: {}, // channelId -> speed
}

/* ----------------------------------------
   Get values (with defaults)
-----------------------------------------*/
export function getSettings(keys = null) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys || DEFAULTS, (data) => {
      resolve({ ...DEFAULTS, ...data })
    })
  })
}

/* ----------------------------------------
   Set one or more values
-----------------------------------------*/
export function setSettings(values) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(values, () => {
      resolve()
    })
  })
}

/* ----------------------------------------
   Speed helpers
-----------------------------------------*/
export async function getDefaultSpeed() {
  const { speed } = await getSettings(["speed"])
  return speed
}

export async function setDefaultSpeed(speed) {
  await setSettings({ speed })
}

/* ----------------------------------------
   Channel-specific speed
-----------------------------------------*/
export async function getChannelSpeed(channelId) {
  const { channelSpeeds } = await getSettings(["channelSpeeds"])
  return channelSpeeds[channelId]
}

export async function setChannelSpeed(channelId, speed) {
  const { channelSpeeds } = await getSettings(["channelSpeeds"])

  channelSpeeds[channelId] = speed
  await setSettings({ channelSpeeds })
}

/* ----------------------------------------
   Feature flags
-----------------------------------------*/
export async function isSmartResumeEnabled() {
  const { smartResume } = await getSettings(["smartResume"])
  return smartResume
}

export async function isAutoApplyEnabled() {
  const { autoApply } = await getSettings(["autoApply"])
  return autoApply
}

/* ----------------------------------------
   Reset everything
-----------------------------------------*/
export async function resetSettings() {
  await setSettings(DEFAULTS)
}
