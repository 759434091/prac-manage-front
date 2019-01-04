<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'app',
        created() {
            let lock = false

            const _this = this

            this.$request.interceptors.request.use(
                config => {
                    const accessToken = _this.$store.state.accessToken;
                    if (accessToken)
                        config.headers.Authorization = `Bearer ${accessToken}`;
                    return config;
                },
                err => {
                    return Promise.reject(err);
                })
            this.$request.interceptors.response.use(
                res => {
                    return res
                },
                err => {
                    return new Promise((resolve, reject) => {
                        if (null == err.response) {
                            this.$message.error('服务器无反应, 请稍后再试')
                            return reject()
                        }

                        if (err.config && !err.config.url.includes('/token') && 401 === err.response.status) {
                            const refreshToken = localStorage.getItem('refreshToken')
                            if (refreshToken == null) {
                                this.$message.error('[no cred]登录信息过期, 请重新登录')
                                this.$router.push('/login')
                                return reject()
                            }

                            const config = err.config
                            config.baseURL = '';

                            if (!lock) {
                                lock = true
                                const formData = new FormData()
                                formData.append('refreshToken', refreshToken)

                                _this.$request
                                    .post('/refreshToken', formData)
                                    .then((res) => {
                                        _this.$store.commit('login', res.data)

                                        _this.$request(config)
                                            .then(res => resolve(res))
                                            .catch(err => reject(err))
                                    })
                                    .catch(() => {
                                        this.$message.error('[fail refresh]登录信息过期, 请重新登录')
                                        this.$router.push('/login')
                                        return reject()
                                    })
                                    .finally(() => lock = false)
                            }
                            else {
                                const itl = setInterval(() => {
                                    if (lock) return
                                    clearInterval(itl)
                                    _this.$request(config)
                                        .then(res => resolve(res))
                                        .catch(err => reject(err))
                                }, 200)
                            }
                        } else {
                            return reject(err)
                        }
                    })
                })
        },
        mounted() {
            const that = this
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.body.clientWidth
                    that.$store.dispatch('updateScreenWidth', window.screenWidth)
                })()
            }

            const userAgent = navigator.userAgent;
            if (userAgent.includes('compatible') || userAgent.includes('MSIE') || userAgent.includes('Trident')) {
                this.$alert('本网站不兼容IE, 为了您的最佳体验, 建议使用 Chrome 浏览器访问', '对不起', {
                    showClose: false,
                    showConfirmButton: false
                })
            } else if (!userAgent.includes('Chrome') && !userAgent.includes('Firefox') && !userAgent.includes('Safari')) {
                this.$alert('为了您的最佳体验, 建议使用 Chrome 浏览器访问', '警告')
            }
        }
    }
</script>

<style>
    html {
        background-color: #fcfcfc;
        font-family: Roboto, -apple-system, BlinkMacSystemFont,
        "Segoe UI", Helvetica, Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
</style>
