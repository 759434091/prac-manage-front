module.exports = {
    baseUrl: '/prac-manage/',
    configureWebpack: {
        externals: {
            'element-ui': 'element-ui',
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'axios': 'axios',
        }
    }
}
