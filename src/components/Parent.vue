<template>
    <el-container class="idx-second-container">
        <el-aside class="idx-el-aside" width="280px">
            <el-menu class="idx-second-menu" background-color="#4b4b4b" text-color="#fff"
                     active-text-color="#ffd04b" :default-active="activeIndex">
                <el-menu-item index="1" @click="pracInfo">实习信息</el-menu-item>
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
        name: "Parent",
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
                    case 'pracInfo':
                        this.activeIndex = "1"
                        break
                    default:
                        this.$router.push('/index/parent/pracInfo')
                        break
                }
            },
            pracInfo() {
                this.$router.push('/index/parent/pracInfo')
            }
        }
    }
</script>

<style scoped>

</style>
