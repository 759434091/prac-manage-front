<template>
    <el-container>
        <el-header>
            <el-form :model="selectForm" size="mini" inline="">
                <el-form-item label="学号">
                    <el-input v-model="selectForm.stuId" placeholder="学号、班级、年级"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="selectForm.fullName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="时间段">
                    <el-date-picker
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            v-model="selectForm.dateRange"
                            :default-time="['00:00:00', '00:00:00']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch()">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-table :data="pmHisList">
                <el-table-column label="学号" prop="puStuId" width="130px"></el-table-column>
                <el-table-column label="姓名" prop="puFullName" width="80px"></el-table-column>
                <el-table-column label="操作记录" prop="phOperation">
                    <template slot-scope="scope">
                        <span v-text="showOperation(scope.row.phOperation)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="phTime" width="190px">
                    <template slot-scope="scope">
                        <span v-text="new Date(scope.row.phTime).toLocaleString()"></span>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form size="mini" inline class="table-expand">
                            <el-form-item label="学号">
                                <span v-text="scope.row.puStuId"></span>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <span v-text="scope.row.puFullName"></span>
                            </el-form-item>
                            <el-form-item label="操作记录">
                                <span v-text="showOperation(scope.row.phOperation)"></span>
                            </el-form-item>
                            <el-form-item label="操作时间">
                                <span v-text="new Date(scope.row.phTime).toLocaleString()"></span>
                            </el-form-item>
                            <el-form-item label="操作备注">
                                <span v-text="scope.row.phRemark"></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-pagination
                    class="idx-main-pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pagination.currentPage"
                    :page-size="pagination.size"
                    :page-sizes="[10, 30, 50, 100, 200]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
            </el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "HistoryManage",
        created() {
            this.handleCurrentChange(1)
        },
        data() {
            return {
                loading: false,
                selectForm: {
                    stuId: null,
                    fullName: null,
                    dateRange: []
                },
                pagination: {
                    currentPage: 1,
                    total: 0,
                    size: 10
                },
                pmHisList: []
            }
        },
        methods: {
            onSearch() {
                this.handleCurrentChange(1)
            },
            handleCurrentChange(page) {
                this.loading = true

                this.$request
                    .get(
                        '/histories', {
                            params: {
                                page: page,
                                pageSize: this.pagination.size,
                                stuId: this.selectForm.stuId,
                                fullName: this.selectForm.fullName,
                                startDate: this.selectForm.dateRange[0] == null ? null : this.selectForm.dateRange[0],
                                endDate: this.selectForm.dateRange[1] == null ? null : this.selectForm.dateRange[1]
                            }
                        }
                    )
                    .then(res => {
                        const pageIntro = res.data
                        if (pageIntro.total === 0) this.$message.warning('暂无数据')
                        this.pagination.currentPage = pageIntro.pageNum
                        this.pagination.total = pageIntro.total
                        this.pmHisList = pageIntro.list
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
                    .finally(() => {
                        this.loading = false
                    })
            },
            handleSizeChange(size) {
                this.pagination.size = size
                this.onSearch()
            },
            showOperation(opStr) {
                const op = JSON.parse(opStr);
                if (op == null) return opStr

                let step = ''
                let res = ''
                for (let idx in op) {
                    if (!op.hasOwnProperty(idx) || op[idx] == null) continue

                    switch (idx) {
                        case 'phiInfoStep': {
                            const val = op[idx]
                            const PhiInfoStep = this.$util.PhiInfoStep
                            for (let i in PhiInfoStep) {
                                if (!PhiInfoStep.hasOwnProperty(i)) continue
                                if (val === PhiInfoStep[i].value) {
                                    step = `${PhiInfoStep[i].label}, `
                                    break
                                }
                            }
                            break
                        }
                        case 'phiStatus': {
                            const val = op[idx]
                            const PhiStatus = this.$util.PhiStatus
                            for (let i in PhiStatus) {
                                if (!PhiStatus.hasOwnProperty(i)) continue
                                if (val === PhiStatus[i].value) {
                                    res += `修改实习状态为 ${PhiStatus[i].label}, `
                                    break
                                }
                            }
                            break
                        }
                        case 'phiStartDate': {
                            res += `修改开始日期为 ${new Date(op[idx]).toLocaleDateString()}, `
                            break
                        }
                        case 'phiEndDate': {
                            res += `修改结束日期为 ${new Date(op[idx]).toLocaleDateString()}, `
                            break
                        }
                        case 'phiCompany': {
                            res += `修改公司为 ${op[idx]}, `
                            break
                        }
                        case 'phiCpyLoc': {
                            res += `修改公司地址为 ${op[idx]}, `
                            break
                        }
                        case 'phiAccomType': {
                            const val = op[idx]
                            const PhiAccomType = this.$util.PhiAccomType
                            for (let i in PhiAccomType) {
                                if (!PhiAccomType.hasOwnProperty(i)) continue
                                if (val === PhiAccomType[i].value) {
                                    res += `修改住宿状态为 ${PhiAccomType[i].label}, `
                                    break
                                }
                            }
                            break
                        }
                        case 'phiRentAddr': {
                            res += `修改住宿地址为 ${op[idx]}, `
                            break
                        }
                        case 'phiRemark': {
                            res += `修改备注为 ${op[idx]}, `
                            break
                        }
                        case 'phiRentCert': {
                            res += `上传租房协议, `
                            break
                        }
                        default:
                            break
                    }
                }

                if (res !== '') res = step + res
                else res = step + '无操作'

                if (res.endsWith(", ")) res = res.substring(0, res.length - 2)
                return res
            }
        }
    }
</script>

<style scoped>
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
</style>
