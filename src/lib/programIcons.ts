import {
  PiGraduationCap,
  PiHeart,
  PiLightning,
  PiHouse,
  PiGear,
  PiUsers,
  PiBooks,
  PiFirstAid,
  PiBowlFood,
  PiHandshake,
} from 'react-icons/pi'
import type { IconType } from 'react-icons'

export const programIcons: Record<string, IconType> = {
  'graduation-cap': PiGraduationCap,
  heart: PiHeart,
  lightning: PiLightning,
  house: PiHouse,
  gear: PiGear,
  users: PiUsers,
  books: PiBooks,
  'first-aid': PiFirstAid,
  'bowl-food': PiBowlFood,
  handshake: PiHandshake,
}

export const programIconOptions = Object.keys(programIcons)
