import {
  PiFacebookLogo,
  PiTwitterLogo,
  PiInstagramLogo,
  PiYoutubeLogo,
  PiLinkedinLogo,
  PiGithubLogo,
  PiTiktokLogo,
  PiTelegramLogo,
  PiSnapchatLogo,
  PiRedditLogo,
  PiDiscordLogo,
  PiDribbbleLogo,
  PiBehanceLogo,
  PiMediumLogo,
  PiTwitchLogo,
  PiGlobe,
} from 'react-icons/pi'
import type { ComponentType } from 'react'

export const socialIconMap: Record<string, ComponentType<{ className?: string }>> = {
  facebook: PiFacebookLogo,
  twitter: PiTwitterLogo,
  instagram: PiInstagramLogo,
  youtube: PiYoutubeLogo,
  linkedin: PiLinkedinLogo,
  github: PiGithubLogo,
  tiktok: PiTiktokLogo,
  telegram: PiTelegramLogo,
  snapchat: PiSnapchatLogo,
  reddit: PiRedditLogo,
  discord: PiDiscordLogo,
  dribbble: PiDribbbleLogo,
  behance: PiBehanceLogo,
  medium: PiMediumLogo,
  twitch: PiTwitchLogo,
}

export function getSocialIcon(name: string): ComponentType<{ className?: string }> {
  const key = name.toLowerCase().replace(/[^a-z]/g, '')
  return socialIconMap[key] || PiGlobe
}
