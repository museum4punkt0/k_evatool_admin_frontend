import ASSETS from '../services/assetService'

export default {
    namespaced: true,
    state: {
        assets: [],
    },
    mutations: {
        setAssets(state, assets) {
            state.assets = assets
        },
    },
    actions: {
        async getAssets({ commit }, page = 1) {
            const assets = await ASSETS.getAssets(page)
            commit('setAssets', assets.data)
        },
        async deleteAsset({ dispatch }, assetId) {
            await ASSETS.deleteAsset(assetId)
            dispatch('getAssets')
        },
    },
}
