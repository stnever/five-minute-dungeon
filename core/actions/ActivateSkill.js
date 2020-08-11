import { canPay, modifyAttributes, invert } from '../utils'

// This function runs an active skill in response to a
// player's selection.
export default function ActivateSkill(skill) {
  let hero = Game.dungeon.hero,
    cost = { stars: skill.stars }

  if (!canPay(hero, cost))
    return;

  modifyAttributes(hero, invert(cost))
  modifyAttributes(hero, skill.gain)
}