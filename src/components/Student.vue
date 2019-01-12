<template>
    <el-container class="idx-second-container">
        <el-aside class="idx-el-aside" width="280px">
            <el-menu class="idx-second-menu" background-color="#4b4b4b" text-color="#fff"
                     active-text-color="#ffd04b" :default-active="activeIndex">
                <el-menu-item index="1" @click="clockIn">打卡</el-menu-item>
                <el-menu-item index="2" @click="stuInfo">实习登记</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main class="idx-main">
            <transition name="el-fade-in" mode="out-in">
                <router-view>
                </router-view>
            </transition>
        </el-main>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Student",

        computed: {
            ...mapState(['jwtPmUser']),
        },
        data() {
            return {
                activeIndex: null
            }
        },
        created() {
            if (this.jwtPmUser.role !== 'STUDENT') {
                this.$router.push('/index')
                return
            }
            this.switchActiveIndex(this.$route.name)
        },
        watch: {
            '$route'(to) {
                this.switchActiveIndex(to.name)
            }
        },
        methods: {
            switchActiveIndex(name) {
                switch (name) {
                    case 'stuInfo':
                        this.activeIndex = '2'
                        break
                    case 'clockIn':
                        this.activeIndex = '1'
                        break
                    default:
                        this.$router.push('/index/student/clockIn')
                        break
                }
            },
            stuInfo() {
                this.$router.push('/index/student/stuInfo')
            },
            clockIn() {
                this.$router.push('/index/student/clockIn')
            }
        }
    }
</script>

<style scoped>

</style>
