<template>
    <el-container>
        <el-header>
            <el-menu class="idx-menu" mode="horizontal" background-color="#545c64" text-color="#fff"
                     active-text-color="#ffd04b">
                <li class="idx-menu-icon" @click="showAsideMenu">
                    <span><i class="el-icon-menu"></i></span>
                </li>
                <li class="idx-menu-brand">
                    <span class="idx-menu-brand-span">&emsp;</span>
                    <span>实习登记</span>
                    <span class="idx-menu-brand-span">系统&emsp;</span>
                </li>
                <li class="idx-menu-datetime" v-html="this.formatDateTime"></li>
                <li class="idx-menu-greeting" v-text="this.greetMsg"></li>
                <el-submenu class="idx-menu-setting" index="1">
                    <template slot="title">
                        <span v-text="jwtPmUser == null || jwtPmUser === '' ? '' : this.jwtPmUser.pmUser.puFullName"></span>
                    </template>
                    <el-menu-item index="1-1" @click="goSetting">个人中心</el-menu-item>
                    <el-menu-item index="1-3" @click="logout">退出</el-menu-item>
                    <el-menu-item index="1-2" @click="dialogVisible = true">关于</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-header>
        <transition name="el-fade-in" mode="out-in">
            <router-view>
            </router-view>
        </transition>
        <el-dialog
                title="实习登记系统"
                :visible.sync="dialogVisible"
                width="300px">
            <template slot="title">
                <span class="el-dialog__title">实习登记系统&nbsp;<small style="color: gray">beta</small></span>
            </template>
            <el-form class="table-expand" size="mini" label-width="80px" label-position="left">
                <el-form-item label="版本">
                    <span>0.0.1-beta</span>
                </el-form-item>
                <el-form-item label="反馈">
                    <span>QQ: 2541175183</span>
                    <br>
                    <span>EMAIL: 2541175183@qq.com</span>
                    <br>
                    <br>
                </el-form-item>
                <el-form-item label="请使用 Chrome 浏览器以获得最佳体验" label-width="300px"></el-form-item>
                <el-form-item label="时间仓促, 欢迎提BUG" label-width="300px"></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
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
                // TODO 角色串联
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
                dialogVisible: false,
                date: new Date(),
                timer: null,
            }
        },
        methods: {
            roleSwitchCase() {
                if (this.jwtPmUser == null)
                    this.$router.push('/login')
                switch (this.jwtPmUser.role) {
                    case 'STUDENT':
                        this.$router.push('/index/student')
                        return
                    case 'ADMINISTRATOR':
                        this.$router.push('/index/administrator')
                        return
                    case 'PARENT':
                        this.$router.push('/index/parent')
                        return
                    default: {
                        this.$message.warning("用户信息失效，请重新登录")
                        this.$router.push('/login')
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
            showAsideMenu() {
                const hideFunc = (e) => {
                    const items = document.querySelectorAll(".idx-el-aside, .idx-second-menu");
                    for (let item of items) {
                        item.style.visibility = 'hidden'
                        item.style.opacity = '0'
                        item.style.height = `0`
                    }
                    e.currentTarget.removeEventListener('mouseup', hideFunc)
                }
                const items = document.querySelectorAll(".idx-el-aside, .idx-second-menu");
                for (let item of items) {
                    const len = document.querySelectorAll(".idx-second-menu .el-menu-item").length;
                    item.style.visibility = 'visible'
                    item.style.opacity = '1'
                    item.style.height = `${35 * len}px`
                    item.addEventListener('mouseup', hideFunc, true)
                }
            }
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

    .idx-menu-icon {
        display: none;
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

    .table-expand {
        font-size: 0;
    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
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

    @media screen and (max-width: 1024px) {
        .idx-el-aside {
            width: 150px !important;
        }

        .idx-menu-brand {
            width: 110px;
            font-size: 1rem;
        }

        .idx-menu-brand-span {
            display: none;
        }
    }

    @media screen and (max-width: 768px) {
        body {
            margin: 0;
        }

        .el-header {
            padding: 0;
        }

        .idx-menu {
            border-top-left-radius: unset;
            border-top-right-radius: unset;
            box-shadow: unset;
        }

        .idx-menu-setting {
            border-top-right-radius: unset;
        }

        .idx-menu-setting .el-submenu__title {
            border-top-right-radius: unset;
        }

        .idx-menu-brand {
            border-top-left-radius: unset;
        }

        .idx-el-aside {
            visibility: visible;
            opacity: 1;
            margin-left: 0;
            border-bottom-left-radius: unset;
            box-shadow: unset;
        }

        .idx-menu-datetime, .idx-menu-greeting {
            display: none;
        }

        .idx-main {
            margin-right: 0;
            padding: 10px;
            border-bottom-right-radius: unset;
            box-shadow: unset;
            height: calc(100vh - 60px);
        }

        .idx-second-menu {
            visibility: visible;
            opacity: 1;
            height: calc(100vh - 60px);
        }
    }

    @media screen and (max-width: 480px) {
        body {
            width: calc(100vw);
        }

        .idx-menu-icon {
            float: left;
            display: inline;
            height: 40px;
            line-height: 40px;
            padding: 0 20px;
            color: rgb(239, 239, 239);
            background-color: #545c64;
            border-bottom-color: transparent;
            font-size: 1.2rem;
            transition: background-color 0.5s;
        }

        .idx-menu-icon:focus, .idx-menu-icon:hover, .idx-menu-icon:active {
            background-color: rgb(67, 74, 80);
        }

        .idx-second-container {
            margin-top: 0;
            padding-top: 8px;
        }

        .idx-el-aside {
            border-radius: 3px;
            visibility: hidden;
            opacity: 0;
            position: absolute;
            top: 45px;
            height: 0;
            width: 175px !important;
            z-index: 99999;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            transition: visibility, opacity 0.2s ease-in-out;
        }

        .idx-second-menu {
            position: relative;
            height: auto;
            border-radius: 3px;
        }

        .idx-second-menu .el-menu-item {
            border-radius: 3px;
            height: 35px;
            line-height: 35px;
            background-color: rgb(84, 92, 100) !important;
        }

        .idx-menu-brand {
            display: none;
        }

        .el-menu--horizontal > .el-submenu .el-submenu__title {
            height: 40px;
            line-height: 40px;
        }
    }
</style>
