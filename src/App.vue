<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'app',
        created() {
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
                                this.$message.error('登录信息过期, 请重新登录')
                                this.$router.push('/login')
                                return reject()
                            }

                            const formData = new FormData()
                            formData.append('refreshToken', refreshToken)
                            _this.$request
                                .post('/refreshToken', formData)
                                .then((res) => {
                                    _this.$store.commit('login', res.data)

                                    const url = err.config.url
                                    const data = err.config.data
                                    const method = err.config.method
                                    const params = err.config.params
                                    const contentType = err.config.headers['Content-Type']

                                    _this
                                        .$request({
                                            url,
                                            data,
                                            params,
                                            method,
                                            headers: {
                                                'Content-Type': contentType,
                                                Authorization: `Bearer ${res.data.accessToken}`
                                            }
                                        })
                                        .then(res => resolve(res))
                                        .catch(err => reject(err))
                                })
                                .catch(() => {
                                    this.$message.error('登录信息过期, 请重新登录')
                                    this.$router.push('/login')
                                    return reject()
                                })
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
            } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
                this.$alert('为了您的最佳体验, 建议使用 Chrome 浏览器访问', '警告')
            } else if (!userAgent.includes('Chrome') && !userAgent.includes('Firefox')) {
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
