// https://markus.oberlehner.net/blog/usestate-and-usereducer-with-the-vue-3-composition-api/
import { readonly, ref } from 'vue'

export function useReducer(reducer, initialArg, init) {
    const state = ref(init ? init(initialArg) : initialArg)
    const dispatch = (action) => {
        state.value = reducer(state.value, action)
    }

    return [readonly(state), dispatch]
}
