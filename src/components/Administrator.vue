<template>
    <el-container class="idx-second-container">
        <el-aside class="idx-el-aside" width="280px">
            <el-menu class="idx-second-menu" background-color="#4b4b4b" text-color="#fff"
                     active-text-color="#ffd04b" :default-active="activeIndex">
                <el-menu-item index="1" @click="pracManage">实习管理</el-menu-item>
                <el-menu-item index="2" @click="historyManage">登记记录</el-menu-item>
                <el-menu-item index="3" @click="clockInManage">打卡记录</el-menu-item>
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
    export default {
        name: "Administrator",
        data() {
            return {
                activeIndex: null
            }
        },
        created() {
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
                    case 'pracManage':
                        this.activeIndex = "1"
                        break
                    case 'historyManage':
                        this.activeIndex = "2"
                        break
                    case 'clockInManage':
                        this.activeIndex = "3"
                        break
                    default:
                        this.$router.push('/index/administrator/pracManage')
                        break
                }
            },
            pracManage() {
                this.$router.push('/index/administrator/pracManage')
            },
            historyManage() {
                this.$router.push('/index/administrator/historyManage')
            },
            clockInManage(){
                this.$router.push('/index/administrator/clockInManage')
            }
        }
    }
</script>

<style scoped>

</style>
