<template>
    <el-container>
        <el-main>
            <el-form>
                <el-form-item v-if="src != null">
                    <iframe width="320px" height="480px" :src="src"></iframe>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onClockIn" type="primary">打卡</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "ClockIn",
        computed: {
            ...mapState(['jwtPmUser']),
            src() {
                if (this.loc.longitude == null || this.loc.latitude == null) return null
                return `https://3gimg.qq.com/lightmap/components/locationCluster/index.html?type=0&marker=coord:${this.loc.latitude},${this.loc.longitude};title:目前地点;addr: &key=OXNBZ-FK2W5-6NMI7-QYXJY-IAY7F-WEFBS&referer=pm_loc`
            }
        },
        data() {
            return {
                loc: {
                    latitude: null,
                    longitude: null
                },
                geo: null
            }
        },
        mounted() {
            const loading = this.$loading({
                lock: true,
                text: '定位中',
                spinner: 'el-icon-loading',
                background: '#fafafa'
            })
            this.geo = new window.qq.maps.Geolocation('OXNBZ-FK2W5-6NMI7-QYXJY-IAY7F-WEFBS', 'pm_loc')
            this.geo.getLocation(
                (pos) => {
                    this.loc.latitude = pos.lat
                    this.loc.longitude = pos.lng
                    loading.close()
                },
                (err) => {
                    this.$message.error(err)
                    loading.close()
                })
        },
        methods: {
            onClockIn() {
                if (this.loc.longitude == null || this.loc.latitude == null) {
                    this.$message.warning('定位未完成')
                    return
                }
                this.$request
                    .post(`/clockIn/${this.jwtPmUser.id}`, this.loc)
                    .then(res => {
                        if (res.data.success) {
                            this.$message.success('今日打卡成功')
                            return
                        }
                        this.$message.error(res.data.message)
                    })
                    .catch(err => {
                        if (!err.response || !err.response.data)
                            return
                        if (!err.response.data.message) {
                            this.$message.error(err.response.data)
                            return
                        }
                        this.$message.error(err.response.data.message)
                    })
            }
        }
    }
</script>

<style scoped>

</style>