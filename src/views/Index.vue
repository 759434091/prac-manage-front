<template>
    <el-container>
        <el-header>
            <el-menu class="idx-menu" mode="horizontal" background-color="#545c64" text-color="#fff"
                     active-text-color="#ffd04b">
                <li class="idx-menu-brand">&emsp;实习管理系统&emsp;</li>
                <li class="idx-menu-datetime" v-html="this.formatDateTime"></li>
                <li class="idx-menu-greeting" v-text="this.greetMsg"></li>
                <el-submenu class="idx-menu-setting" index="1">
                    <template slot="title">
                        <span v-text="this.jwtPmUser.pmUser.puFullName"></span>
                    </template>
                    <el-menu-item index="1-1" @click="goSetting">个人中心</el-menu-item>
                    <el-menu-item index="1-3" @click="logout">退出</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-header>
        <transition name="el-fade-in" mode="out-in">
            <router-view>
            </router-view>
        </transition>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Index",
        computed: {
            ...mapState(['accessToken', 'jwtPmUser']),
            formatDateTime() {
                const year = this.date.getFullYear()
                const month = (this.date.getMonth() + 1) < 10 ? `0${this.date.getMonth() + 1}` : this.date.getMonth() + 1
                const day = this.date.getDate() < 10 ? `0${this.date.getDate()}` : this.date.getDate()
                const hour = this.date.getHours() < 10 ? `0${this.date.getHours()}` : this.date.getHours()
                const minute = this.date.getMinutes() < 10 ? `0${this.date.getMinutes()}` : this.date.getMinutes()
                const second = this.date.getSeconds() < 10 ? `0${this.date.getSeconds()}` : this.date.getSeconds()
                return `${year}年${month}月${day}日
                        ${hour}:${minute}:${second}`
            },
            greetMsg() {
                const hour = this.date.getHours();

                if (hour >= 0 && hour < 6)
                    return '凌晨时间，请注意休息哦'
                if (hour >= 6 && hour < 12)
                    return '早上好'
                if (hour >= 12 && hour < 13)
                    return '中午好'
                if (hour >= 13 && hour < 19)
                    return '下午好'
                if (hour >= 19 && hour < 20)
                    return '傍晚好'
                if (hour >= 20 && hour < 24)
                    return '晚上好'
                return ''
            }
        },
        created() {
            this.timer = setInterval(() => this.date = new Date(), 500);
            // reset state
            if (this.accessToken == null || this.jwtPmUser == null) {
                const accessToken = localStorage.getItem('accessToken')
                const jwtPmUser = JSON.parse(localStorage.getItem('jwtPmUser'))
                if (accessToken == null || jwtPmUser == null) {
                    this.$router.push('/login')
                    return
                }

                this.$store.commit('resetState', {
                    accessToken,
                    jwtPmUser
                })
                this.$router.push('/index')
            }

            const _this = this
            this.$store
                .dispatch('getLocalStorageState')
                .then(res => {
                    if (!res)
                        _this.$router.push('/')

                    if (this.$route.fullPath === '/index' || this.$route.fullPath === '/index/')
                        _this.roleSwitchCase()
                })
        },
        watch: {
            '$route'(to) {
                if (to.fullPath !== '/index') return

                const _this = this
                this.$store.dispatch('getLocalStorageState').then(res => {
                    if (!res)
                        _this.$router.push('/login')

                    _this.roleSwitchCase()
                })
            }
        },
        data() {
            return {
                date: new Date(),
                timer: null,
            }
        },
        methods: {
            roleSwitchCase() {
                switch (this.jwtPmUser.role) {
                    case 'STUDENT':
                        return this.$router.push('/index/student')
                    case 'ADMINISTRATOR':
                        return this.$router.push('/index/administrator')
                    case 'PARENT':
                        return this.$router.push('/index/parent')
                    default: {
                        this.$message.warning("用户信息失效，请重新登录")
                        return this.$router.push('/login')
                    }
                }
            },
            logout() {
                const _this = this
                this.$store.dispatch('logout')
                    .then(() => {
                        _this.$router.push('/login')
                    })
            },
            goSetting() {
                this.$store.commit('backSetting', this.$route.path)
                this.$router.push('/index/setting')
            },
        },
        beforeDestroy() {
            if (this.timer)
                clearInterval(this.timer)
        }
    }
</script>

<style>
    .idx-second-container {
        margin-top: 8px;
    }

    .idx-el-aside {
        margin-left: 20px;
        background-color: #4b4b4b;
        border-bottom-left-radius: 5px;
        box-shadow: 0 4px 15px #888888;
    }

    .idx-second-menu {
        height: calc(100vh - 24px - 60px);
    }

    .idx-main {
        height: calc(100vh - 24px - 60px);
        margin-right: 20px;
        padding: 10px 10%;
        background-color: transparent;
        border-bottom-right-radius: 5px;
        box-shadow: 3px 4px 15px #888888;
    }

    .idx-menu {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        box-shadow: 3px 1px 15px #888888;
    }

    .idx-menu-brand {
        float: left;
        height: 60px;
        width: 240px;
        border-top-left-radius: 5px;
        text-align: center;
        font-size: 1.5rem;
        line-height: 60px;
        padding: 0 20px;
        margin: 0;
        color: rgb(255, 255, 255);
        background-color: rgb(67, 74, 80);
        border-bottom-color: transparent;
    }

    .idx-menu-datetime {
        float: left;
        height: 60px;
        line-height: 60px;
        letter-spacing: 0.3rem;
        padding: 0 20px;
        margin: 0;
        color: rgb(255, 255, 255);
        background-color: #545c64;
        border-bottom-color: transparent;
    }

    .idx-menu-brand:focus, .idx-menu-datetime:focus, .idx-menu-greeting:focus {
        outline: unset;
    }

    .idx-menu-greeting {
        float: left;
        height: 60px;
        line-height: 60px;
        padding: 0;
        color: rgb(255, 255, 255);
        background-color: #545c64;
        border-bottom-color: transparent;
    }

    .idx-menu-setting {
        float: right !important;
        border-top-right-radius: 5px;
    }

    .idx-menu-setting .el-submenu__title {
        border-top-right-radius: 5px;
    }

    .idx-main-pagination {
        float: right;
    }

    @media screen and (max-width: 1440px) {
        .idx-main {
            color: #4b4b4b;
            height: calc(100vh - 24px - 60px);
            margin-right: 20px;
            padding: 10px 0;
            background-color: transparent;
            border-bottom-right-radius: 5px;
        }
    }
</style>
