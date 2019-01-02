<template>
    <el-container>
        <el-header height="auto">
            <el-form size="mini" :model="selectForm" :inline="true" label-width="80px" label-position="left">
                <el-form-item label="学号">
                    <el-input v-model="selectForm.pmUser.puStuId" placeholder="学号、班级、年级"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="selectForm.pmUser.puFullName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="登记状态">
                    <el-select v-if="testQueryUser()" v-model="selectForm.pmInfo.phiInfoStep">
                        <el-option label="未选择" :value="null"></el-option>
                        <el-option label="未登记" :value="0"></el-option>
                        <el-option label="已登记" :value="1"></el-option>
                    </el-select>
                    <el-select v-else v-model="selectForm.pmInfo.phiInfoStep" placeholder="请选择">
                        <el-option label="未选择" :value="null"></el-option>
                        <el-option
                                v-for="(item,idx) in this.$util.PhiInfoStep"
                                :key="`PhiInfoStep_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实习状态">
                    <el-select v-model="selectForm.pmInfo.phiStatus" placeholder="请选择">
                        <el-option
                                v-for="(item,idx) in this.$util.PhiStatus"
                                :key="`PhiStatus_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实习公司">
                    <el-input v-model="selectForm.pmInfo.phiCompany" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="单位地址">
                    <el-input v-model="selectForm.pmInfo.phiCpyLoc" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker
                            v-model="selectForm.pmInfo.phiStartDate"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker
                            v-model="selectForm.pmInfo.phiEndDate"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="住宿地址">
                    <el-input v-model="selectForm.pmInfo.phiRentAddr" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="住宿状态">
                    <el-select v-model="selectForm.pmInfo.phiAccomType" placeholder="请选择">
                        <el-option
                                v-for="(item,idx) in this.$util.PhiAccomType"
                                :key="`PhiAccomType_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住宿协议">
                    <el-select v-model="selectForm.pmInfo.phiRentCert" placeholder="请选择">
                        <el-option
                                v-for="(item,idx) in this.$util.RentCert"
                                :key="`RentCert_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" :disabled="loading" @click="onSearch" type="primary">模糊搜索</el-button>
                    <el-button @click="onClear">清空</el-button>
                </el-form-item>
                <el-form-item>
                    <el-tooltip class="item" effect="dark" placement="top-start"
                                content="指定了学生信息将会忽略除登记状态以外其他选项！">
                        <i class="el-icon-warning" style="color: #F56C6C;"></i>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-table :data="pmInfoList" v-loading="loading" size="mini">
                <el-table-column label="学号" prop="pmUser.puStuId" width="120px"></el-table-column>
                <el-table-column label="姓名" prop="pmUser.puFullName" width="80px"></el-table-column>
                <el-table-column label="登记状态" prop="phiInfoStep" width="70px">
                    <template slot-scope="scope">
                        <span v-text="$util.getPhiInfoStep(scope.row.phiInfoStep)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="实习状态" prop="phiStatus" width="70px">
                    <template slot-scope="scope">
                        <span v-text="$util.enumVal2Label($util.PhiStatus,scope.row.phiStatus)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="实习公司" prop="phiCompany"></el-table-column>
                <el-table-column label="单位地址" prop="phiCpyLoc"></el-table-column>
                <el-table-column label="住宿状态" prop="phiAccomType" width="70px">
                    <template slot-scope="scope">
                        <span v-text="$util.enumVal2Label($util.PhiAccomType,scope.row.phiAccomType)"></span>
                    </template>
                </el-table-column>
                <el-table-column width="90px">
                    <template slot-scope="scope">
                        <el-button type="info" plain size="mini" @click="showHistoryDialog(scope.row.pmUser)">
                            查看历史
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline size="mini" class="table-expand">
                            <el-form-item label="学号">
                                <span v-text="props.row.pmUser.puStuId"></span>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <span v-text="props.row.pmUser.puFullName"></span>
                            </el-form-item>
                            <el-form-item label="登记状态">
                                <span v-text="$util.getPhiInfoStep(props.row.phiInfoStep)"></span>
                            </el-form-item>
                            <el-form-item label="实习状态">
                                <span v-text="$util.enumVal2Label($util.PhiStatus,props.row.phiStatus)"></span>
                            </el-form-item>
                            <el-form-item label="实习公司">
                                <span v-text="props.row.phiCompany"></span>
                            </el-form-item>
                            <el-form-item label="单位地址">
                                <span v-text="props.row.phiCpyLoc"></span>
                            </el-form-item>
                            <el-form-item label="开始日期">
                                <span v-text="dataFormat(props.row.phiStartDate)"></span>
                            </el-form-item>
                            <el-form-item label="结束日期">
                                <span v-text="dataFormat(props.row.phiEndDate)"></span>
                            </el-form-item>
                            <el-form-item label="住宿状态">
                                <span v-text="$util.enumVal2Label($util.PhiAccomType,props.row.phiAccomType)"></span>
                            </el-form-item>
                            <el-form-item label="住宿地址">
                                <span v-text="props.row.phiRentAddr"></span>
                            </el-form-item>
                            <el-form-item label="住宿协议">
                                <span v-if="props.row.phiRentCert == null || props.row.phiRentCert === ''">未上传</span>
                                <el-button v-else @click="dlRentFile(props.row.phiRentCert)" type="text">下载查看
                                </el-button>
                            </el-form-item>
                            <el-form-item label="备注">
                                <span v-text="props.row.phiRemark"></span>
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
        <HistoryDialog :dialog-visible="historyDialog.dialogVisible" :pm-user="historyDialog.pmUser"
                       @close="closeHistoryDialog"></HistoryDialog>
    </el-container>
</template>

<script>
    import HistoryDialog from "@/components/administrator/HistoryDialog";

    const rawDate = new Date(1970, 1, 1)
    export default {
        name: "PracManage",
        components: {HistoryDialog},
        created() {
            this.handleCurrentChange(1)
        },
        data() {
            return {
                loading: false,
                selectForm: {
                    pmUser: {
                        puStuId: null,
                        puFullName: null
                    },
                    pmInfo: {
                        phiStatus: null,
                        phiCompany: null,
                        phiCpyLoc: null,
                        phiStartDate: null,
                        phiEndDate: null,
                        phiAccomType: null,
                        phiRentAddr: null,
                        phiRentCert: null
                    }
                },
                pagination: {
                    currentPage: 1,
                    total: 0,
                    size: 10
                },
                pmInfoList: [],
                historyDialog: {
                    pmUser: null,
                    dialogVisible: false
                }
            }
        },
        methods: {
            onSearch() {
                this.handleCurrentChange(1)
            },
            handleCurrentChange(page) {
                this.loading = true
                if (this.selectForm.pmInfo.phiStatus === 0)
                    this.selectForm.pmInfo.phiStatus = null
                if (this.selectForm.pmInfo.phiAccomType === 0)
                    this.selectForm.pmInfo.phiAccomType = null
                if (this.selectForm.pmUser.puStuId == null || this.selectForm.pmUser.puStuId.trim() === '')
                    this.selectForm.pmUser.puStuId = null
                if (this.selectForm.pmUser.puFullName == null || this.selectForm.pmUser.puFullName.trim() === '')
                    this.selectForm.pmUser.puFullName = null
                this.$request
                    .post(
                        '/info', this.selectForm, {
                            params: {
                                page: page,
                                pageSize: this.pagination.size,
                            }
                        }
                    )
                    .then(res => {
                        const pageIntro = res.data
                        if (pageIntro.total === 0) this.$message.warning('暂无数据')
                        this.pagination.currentPage = pageIntro.pageNum
                        this.pagination.total = pageIntro.total
                        this.pmInfoList = pageIntro.list
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
            dlRentFile(enStr) {
                const iframe = document.createElement('iframe')
                iframe.style.display = 'none'
                iframe.src = `${this.$request.defaults.baseURL}/files/${enStr}`
                iframe.onload = () => document.body.removeChild(iframe)
                document.body.appendChild(iframe)
            },
            testQueryUser() {
                if (this.selectForm.pmUser.puStuId != null && this.selectForm.pmUser.puStuId.trim() !== '')
                    return true
                return this.selectForm.pmUser.puFullName != null && this.selectForm.pmUser.puFullName.trim() !== '';
            },
            onClear() {
                this.selectForm = {
                    pmUser: {
                        puStuId: null,
                        puFullName: null
                    },
                    pmInfo: {
                        phiStatus: null,
                        phiCompany: null,
                        phiCpyLoc: null,
                        phiStartDate: null,
                        phiEndDate: null,
                        phiAccomType: null,
                        phiRentAddr: null,
                        phiRentCert: null
                    }
                }
            },
            dataFormat(dateStr) {
                if (dateStr == null) return ''
                const date = this.$util.getDate(dateStr)
                if (date.getFullYear() === rawDate.getFullYear() &&
                    date.getMonth() === rawDate.getMonth() &&
                    date.getDate() === rawDate.getDate())
                    return ''
                return date.toLocaleDateString()
            },
            showHistoryDialog(pmUser) {
                this.historyDialog.pmUser = pmUser
                this.historyDialog.dialogVisible = true
            },
            closeHistoryDialog() {
                this.historyDialog.pmUser = null
                this.historyDialog.dialogVisible = false
            }
        }
    }
</script>

<style>
</style>
