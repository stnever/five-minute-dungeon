import _ from 'lodash'


// If a listener returns this constant, it signals the game
// engine that the listener should be removed. This can be used
// to create listeners that run only once.
export const _REMOVE = {}

export default class MiniEE {
  constructor() {
    this.listeners = {}
  }

  // Registers a listener.
  on(evt, listener) {
    let l = this.listeners[evt]
    if ( l == null ) {
      l = []
      this.listeners[evt] = l
    }
    l.push(listener)
    return listener
  }

  // De-registers a listener.
  off(evt, listener) {
    let l = this.listeners[evt]
    if (l == null) return false

    for (let i = l.length - 1; i >= 0; i--) {
      if (l[i] == listener) {
        l.splice(i, 1)
        return true
      }
    }
  }

  // Notifies listeners of a certain event.
  trigger(evt, args) {
    // console.log('event triggered', evt, args);
    let l = Game.listeners[evt] || []
    args = _.isArray(args) ? args : [args]
    for (let i = l.length - 1; i >= 0; i--) {
      let result = l[i].apply(null, args)

      if (result === _REMOVE)
        l.splice(i, 1)
    }
  }
}
