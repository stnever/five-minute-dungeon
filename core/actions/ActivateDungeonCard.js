import { canPay, modifyAttributes, invert } from '../utils'
import Game from '../Game'

// This function activates a dungeon event in response
// to a player's choice.
export default function ActivateDungeonCard(card) {
  let hero = Game.dungeon.hero

  // Prevents activation of events whose cost can't be paid.
  if (!canPay(hero, card.cost))
    return

  Game.trigger('dungeon-event-selected', card)

  // These card types give loot after paying the cost
  if (card.type == 'chest' ||
    card.type == 'merchant' ||
    card.type == 'trap') {
    Game.trigger('item-acquired', card.item, card)

    // Pays the cost and acquires the item.
    modifyAttributes(hero, invert(card.cost))
    modifyAttributes(hero, card.item.gain)

  }

  // Combat cards
  else {

    // Just in case the combat isn't already calculated
    // and stored.
    let combat = card.combat ||
      calculateCombat(card.monster, hero)

    if (hero.attributes.hp <= combat.totalDamageToHero)
      return

    // Pays the HP cost of defeating a monster and
    // acquires the loot, if any.
    modifyAttributes(hero, { hp: -combat.totalDamageToHero })
    if (card.loot)
      modifyAttributes(hero, card.loot.gain)

    // Broadcasts that a monster has been killed.
    Game.trigger('monster-kill', card.monster)
  }

  // Broadcasts the end of the event and discards it.
  Game.trigger('dungeon-event-end', card)
  _.pull(Game.dungeon.events, card)
}