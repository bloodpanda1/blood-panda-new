import { createStore } from "@xstate/store"
import { undoRedo } from "@xstate/store/undo"
import { persist } from "@xstate/store/persist"
import { reset } from "@xstate/store/reset"

const store = createStore({
  context: { count: 0 },
  on: {
    inc: (context) => ({ count: context.count + 1 })
  }
}).with(undoRedo()).with(reset())

console.log('store.trigger:', store.trigger)
try {
  store.trigger.inc()
  console.log('inc worked')
} catch (e) {
  console.error('error calling trigger:', e)
}
