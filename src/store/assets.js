import ASSETS from '../services/assetService'

export default {
    namespaced: true,
    state: {
        data: [],
        meta: {},
    },
    mutations: {
        setAssets(state, assets) {
            state.data = assets
        },
    },
    actions: {
        async getAssets({ commit }, page = 1) {
            const assets = await ASSETS.ASSETS_get(page)
            commit('setAssets', assets.data)
        },
    },
}