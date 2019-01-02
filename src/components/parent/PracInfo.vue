<template>
    <el-container>
        <el-main>
            <el-form :model="infoForm"
                     :size="size"
                     :label-position="labelPosition"
                     ref="infoForm" label-width="110px">
                <el-form-item label="目前状态" prop="status">
                    <span v-text="getStuStatus(infoForm.status)"></span>
                </el-form-item>
                <el-form-item label="实习时间" prop="dateRange">
                    <el-date-picker
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            v-model="infoForm.dateRange"
                            :disabled="infoForm.disabled"
                            :default-time="['00:00:00', '00:00:00']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="实习公司" prop="company">
                    <el-input v-model="infoForm.company" :disabled="infoForm.disabled"
                              placeholder="请输入公司"></el-input>
                </el-form-item>
                <el-form-item label="单位地点" prop="cpyLoc">
                    <el-input v-model="infoForm.cpyLoc" :disabled="infoForm.disabled"
                              placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="住宿状态" prop="accomType">
                    <el-select v-model="infoForm.accomType"
                               :disabled="infoForm.disabled"
                               placeholder="请选择">
                        <el-option
                                v-for="(item,idx) in this.$util.PhiAccomType"
                                :key="`PhiStatus_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住宿地址" prop="rentAddr">
                    <el-input v-model="infoForm.rentAddr"
                              :disabled="infoForm.disabled"
                              placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="infoForm.remark"
                              :disabled="infoForm.disabled"
                              placeholder="附加信息"></el-input>
                </el-form-item>
                <el-form-item label="住宿协议">
                    <el-button v-if="infoForm.fileRes != null && infoForm.fileRes !== ''"
                               :disabled="infoForm.fileRes == null || infoForm.fileRes === ''"
                               size="small"
                               @click="dlSecFile">下载
                    </el-button>
                    <el-button v-else :disabled="true" type="text">未上传</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "PracInfo",
        computed: {
            ...mapState(['jwtPmUser', 'screenWidth']),
            size() {
                if (this.screenWidth > 480)
                    return 'normal'

                return 'mini'
            },
            labelPosition() {
                if (this.screenWidth > 480)
                    return 'right'

                return 'top'
            }
        },
        data() {
            return {
                infoForm: {
                    disabled: true,
                    status: null,
                    dateRange: null,
                    company: null,
                    cpyLoc: null,
                    accomType: null,
                    rentAddr: null,
                    remark: null,
                    fileRes: null,
                }
            }
        },
        created() {
            this.$request
                .get(`/info/${this.jwtPmUser.id}`)
                .then(res => {
                    const pmInfo = res.data

                    this.infoForm.status = pmInfo.phiStatus
                    this.infoForm.dateRange = [
                        this.$util.getDate(pmInfo.phiStartDate),
                        this.$util.getDate(pmInfo.phiEndDate),
                    ]
                    this.infoForm.company = pmInfo.phiCompany
                    this.infoForm.cpyLoc = pmInfo.phiCpyLoc
                    this.infoForm.accomType = pmInfo.phiAccomType
                    this.infoForm.rentAddr = pmInfo.phiRentAddr
                    this.infoForm.remark = pmInfo.phiRemark
                    this.infoForm.fileRes = pmInfo.phiRentCert
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
        },
        methods: {
            dlSecFile() {

            },
            getStuStatus(val) {
                const PhiStatus = this.$util.PhiStatus
                for (let idx in PhiStatus) {
                    if (PhiStatus[idx].value === val)
                        return PhiStatus[idx].label
                }
                return '未知'
            }
        }
    }
</script>

<style scoped>

</style>
