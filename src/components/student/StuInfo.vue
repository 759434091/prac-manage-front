<template>
    <el-container>
        <el-header>
            <el-steps :active="active" finish-status="success">
                <el-step title="初期登记"></el-step>
                <el-step title="实习登记"></el-step>
                <el-step title="实习中"></el-step>
                <el-step title="离职登记"></el-step>
            </el-steps>
        </el-header>
        <el-main>
            <el-form v-loading="loading" :disabled="loading" v-show="active === 0"
                     :size="size"
                     :model="firstForm"
                     :rules="firstFormRules"
                     ref="firstForm" label-width="110px" :label-position="labelPosition">
                <el-form-item label="目前状态" prop="status">
                    <el-select v-model="firstForm.status" placeholder="请选择">
                        <el-option
                                v-for="(item,idx) in this.$util.PhiStatus"
                                :key="`PhiStatus_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预计实习时间" prop="dateRange">
                    <el-date-picker
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            v-model="firstForm.dateRange"
                            :default-time="['00:00:00', '00:00:00']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="实习公司" prop="company">
                    <el-input v-model="firstForm.company" placeholder="请输入公司全称"></el-input>
                </el-form-item>
                <el-form-item label="单位地点" prop="cpyLoc">
                    <el-input v-model="firstForm.cpyLoc" placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="预计住宿状态">
                    <el-select v-model="firstForm.accomType" placeholder="请选择">
                        <el-option
                                v-for="(item,idx) in this.$util.PhiAccomType"
                                :key="`PhiAccomType_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住宿地址">
                    <el-input v-model="firstForm.rentAddr" placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="firstForm.remark" placeholder="附加信息"></el-input>
                </el-form-item>
                <el-form-item label="住宿协议">
                    <el-upload
                            action="#"
                            ref="cozUpload"
                            :drag="true"
                            :file-list="firstForm.fileList"
                            :http-request="uploadFirstFile"
                            :on-change="handleFirstFileChange"
                            :multiple="false"
                            :auto-upload="true">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将凭证文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submitFirstForm">提交</el-button>
                </el-form-item>
            </el-form>

            <el-form v-loading="loading"
                     :disabled="loading" v-show="active === 1 || active === 2"
                     :size="size"
                     :rules="secondFormRules"
                     :model="secondForm"
                     ref="secondForm" label-width="110px" :label-position="labelPosition">
                <el-form-item label="目前状态" prop="status"
                              :size="size">
                    <el-select v-model="secondForm.status"
                               @change="changePhiStatus"
                               placeholder="请选择">
                        <el-option
                                v-for="(item,idx) in this.$util.PhiStatus"
                                :key="`PhiStatus_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="实习时间" prop="dateRange">
                    <el-date-picker
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            v-model="secondForm.dateRange"
                            :disabled="secondForm.disabled"
                            :default-time="['00:00:00', '00:00:00']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="实习公司" prop="company" autocomplete="off">
                    <el-input v-model="secondForm.company" :disabled="secondForm.disabled"
                              placeholder="请输入公司全称"></el-input>
                </el-form-item>
                <el-form-item label="单位地址" prop="cpyLoc" autocomplete="off">
                    <el-input v-model="secondForm.cpyLoc" :disabled="secondForm.disabled"
                              placeholder="请输入详细单位地址"></el-input>
                </el-form-item>
                <el-form-item label="住宿状态" prop="accomType">
                    <el-select v-model="secondForm.accomType"
                               :disabled="secondForm.disabled"
                               placeholder="请选择">
                        <el-option
                                v-for="(item,idx) in this.$util.PhiAccomType"
                                :key="`PhiStatus_${idx}`"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住宿地址" prop="rentAddr" autocomplete="off">
                    <el-input v-model="secondForm.rentAddr" :disabled="secondForm.disabled"
                              placeholder="请输入详细住宿地址"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="secondForm.remark"
                              :disabled="secondForm.disabled"
                              placeholder="附加信息"></el-input>
                </el-form-item>
                <el-form-item label="住宿协议">
                    <el-button size="small" v-if="secondForm.hideUpload" @click="dlSecFile">下载</el-button>
                    <el-button size="small" v-if="secondForm.hideUpload" type="info" @click="reUpSecFile">重新上传
                    </el-button>
                    <el-upload
                            v-if="!secondForm.hideUpload"
                            action="#"
                            ref="cozUpload"
                            :drag="true"
                            :file-list="secondForm.fileList"
                            :http-request="uploadSecondFile"
                            :on-change="handleSecondFileChange"
                            :multiple="false"
                            :auto-upload="true">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将凭证文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="!secondForm.disabled || get23SubmitShow()"
                               v-text="'提交'"
                               @click="submitSecondForm"
                               type="primary"></el-button>
                    <el-button v-if="secondForm.disabled"
                               v-text="get23ModifyTest()"
                               @click="unlockSecondForm" type="danger">
                    </el-button>
                    <el-button v-if="active === 2" :disabled="true">
                        <!--todo-->
                        开始离职登记(暂未开放)
                    </el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "StuInfo",
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
            const phiStatusValid = (rule, value, callback) => {
                if (value === this.$util.PhiStatus.NULL.value) {
                    callback(new Error('请选择'));
                    return
                }
                callback()
            }

            const phiAccomTypeValid = (rule, value, callback) => {
                if (value === this.$util.PhiAccomType.NULL.value) {
                    callback(new Error('请选择'));
                    return
                }
                callback()
            }

            return {
                loading: false,
                active: 0,
                firstForm: {
                    status: null,
                    dateRange: null,
                    company: null,
                    cpyLoc: null,
                    accomType: null,
                    rentAddr: null,
                    remark: null,
                    fileList: [],
                    fileRes: null
                },
                firstFormRules: {
                    status: [
                        {required: true, message: '请选择实习状态', trigger: 'blur'},
                        {validator: phiStatusValid, trigger: 'blur'}
                    ]
                },
                secondForm: {
                    status: null,
                    dateRange: null,
                    company: null,
                    cpyLoc: null,
                    accomType: null,
                    rentAddr: null,
                    remark: null,
                    fileList: [],
                    fileRes: null,
                    hideUpload: false,
                    disabled: true
                },
                rawForm: null,
                secondFormRules: {
                    status: [
                        {required: true, message: '请选择实习状态', trigger: 'blur'},
                        {validator: phiStatusValid, trigger: 'change'}
                    ],
                    dateRange: [
                        {required: true, message: '请选择实习时间', trigger: 'blur'}
                    ],
                    company: [
                        {required: true, message: '请键入实习公司全称', trigger: 'change'},
                        {min: 12, max: 100, message: '长度在 12 到 100 个字符', trigger: 'change'}
                    ],
                    cpyLoc: [
                        {required: true, message: '请键入详细单位地址', trigger: 'change'},
                        {min: 12, max: 100, message: '长度在 12 到 100 个字符', trigger: 'change'}
                    ],
                    rentAddr: [
                        {required: true, message: '请键入详细住宿地址', trigger: 'change'},
                        {min: 12, max: 100, message: '长度在 12 到 100 个字符', trigger: 'change'}
                    ],
                    accomType: [
                        {required: true, message: '请选择住宿状态', trigger: 'blur'},
                        {validator: phiAccomTypeValid, trigger: 'change'}
                    ]
                },
            }
        },
        created() {
            this.create();
        },
        methods: {
            create() {
                this.loading = true
                this.firstForm = {
                    status: null,
                    dateRange: null,
                    company: null,
                    cpyLoc: null,
                    accomType: null,
                    rentAddr: null,
                    remark: null,
                    fileList: [],
                    fileRes: null
                }
                this.secondForm = {
                    disabled: true,
                    status: null,
                    dateRange: null,
                    company: null,
                    cpyLoc: null,
                    accomType: null,
                    rentAddr: null,
                    remark: null,
                    fileList: [],
                    fileRes: null,
                    hideUpload: false
                }
                this.$request
                    .get(`/info/${this.jwtPmUser.id}`)
                    .then(res => {
                        const pmInfo = res.data
                        if (pmInfo == null || pmInfo === '') {
                            this.active = 0
                            return
                        }

                        this.active = pmInfo.phiInfoStep
                        switch (this.active) {
                            case 2:
                            case 1: {
                                this.secondForm.status = pmInfo.phiStatus
                                this.secondForm.dateRange = [
                                    this.$util.getDate(pmInfo.phiStartDate),
                                    this.$util.getDate(pmInfo.phiEndDate),
                                ]
                                this.secondForm.company = pmInfo.phiCompany
                                this.secondForm.cpyLoc = pmInfo.phiCpyLoc
                                this.secondForm.accomType = pmInfo.phiAccomType
                                this.secondForm.rentAddr = pmInfo.phiRentAddr
                                this.secondForm.remark = pmInfo.phiRemark
                                this.secondForm.fileRes = pmInfo.phiRentCert

                                this.rawForm = JSON.parse(JSON.stringify(this.secondForm))
                                if (pmInfo.fileRes !== '')
                                    this.secondForm.hideUpload = true
                                break
                            }
                            default:
                                break
                        }
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
                    .finally(() => this.loading = false)
            },
            submitFirstForm() {
                this.$refs.firstForm
                    .validate((valid) => {
                        if (!valid)
                            return;

                        if (this.firstForm.fileList.length > 0 && this.firstForm.fileRes == null) {
                            this.$message.error('请先上传选中的住宿凭证')
                            return
                        }

                        const pmInfo = {}
                        pmInfo.phiStatus = this.firstForm.status
                        pmInfo.phiStartDate = this.firstForm.dateRange[0]
                        pmInfo.phiEndDate = this.firstForm.dateRange[1]
                        pmInfo.phiCompany = this.firstForm.company
                        pmInfo.phiCpyLoc = this.firstForm.cpyLoc
                        pmInfo.phiAccomType = this.firstForm.accomType
                        pmInfo.phiRentAddr = this.firstForm.rentAddr
                        pmInfo.phiRentCert = this.firstForm.fileRes
                        pmInfo.phiRemark = this.firstForm.remark
                        this.$request
                            .put(`/info/${this.jwtPmUser.id}`, pmInfo, {
                                params: {
                                    type: 'first'
                                }
                            })
                            .then(res => {
                                if (!res.data.success) {
                                    this.$message.error(res.data.message)
                                    return
                                }

                                this.$message.success("提交成功")
                                this.create();
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

                    })
            },
            changePhiStatus(val) {
                const pmInfo = {}
                pmInfo.phiStatus = val
                if (val === this.$util.PhiStatus.NULL.value)
                    return
                this.$confirm('确定修改状态？', '实习状态')
                    .then(() => {
                        this.$request
                            .put(`/info/${this.jwtPmUser.id}`, pmInfo, {
                                params: {
                                    type: 'second'
                                }
                            })
                            .then(res => {
                                if (!res.data.success) {
                                    this.$message.error(res.data.message)
                                    return
                                }

                                this.$message.success("更新状态成功")
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
                    })
                    .catch(() => {
                    })
            },
            submitSecondForm() {
                debugger
                this.$refs.secondForm
                    .validate((valid) => {
                        if (!valid)
                            return;

                        if (this.secondForm.fileList.length > 0 && this.secondForm.fileRes == null) {
                            this.$message.error('请先上传选中的住宿凭证')
                            return
                        }

                        const pmInfo = {}
                        if (this.secondForm.status !== this.rawForm.status)
                            pmInfo.phiStatus = this.secondForm.status
                        if (this.secondForm.dateRange[0].toISOString() !== this.rawForm.dateRange[0])
                            pmInfo.phiStartDate = this.secondForm.dateRange[0]
                        if (this.secondForm.dateRange[1].toISOString() !== this.rawForm.dateRange[1])
                            pmInfo.phiEndDate = this.secondForm.dateRange[1]
                        if (this.secondForm.company !== this.rawForm.company)
                            pmInfo.phiCompany = this.secondForm.company
                        if (this.secondForm.cpyLoc !== this.rawForm.cpyLoc)
                            pmInfo.phiCpyLoc = this.secondForm.cpyLoc
                        if (this.secondForm.accomType !== this.rawForm.accomType)
                            pmInfo.phiAccomType = this.secondForm.accomType
                        if (this.secondForm.rentAddr !== this.rawForm.rentAddr)
                            pmInfo.phiRentAddr = this.secondForm.rentAddr
                        if (this.secondForm.fileRes !== this.rawForm.fileRes)
                            pmInfo.phiRentCert = this.secondForm.fileRes
                        if (this.secondForm.remark !== this.rawForm.remark)
                            pmInfo.phiRemark = this.secondForm.remark

                        this.$confirm("确定修改?")
                            .then(() => {
                                this.$request
                                    .put(`/info/${this.jwtPmUser.id}`, pmInfo, {
                                        params: {
                                            type: 'second'
                                        }
                                    })
                                    .then(res => {
                                        if (!res.data.success) {
                                            this.$message.error(res.data.message)
                                            return
                                        }

                                        this.$message.success("提交成功")
                                        this.create();
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
                            })
                            .catch(() => {
                            })

                    })
            },
            uploadFirstFile(data) {
                const file = data.file
                const formData = new FormData();
                formData.append('rentCert', file)

                this.$request
                    .post('/info/files', formData)
                    .then(res => {
                        this.firstForm.fileRes = res.data
                        this.firstForm.fileList[0].status = 'success'
                    })
                    .catch(err => {
                        this.firstForm.fileList[0].status = 'error'
                        if (!err.response || !err.response.data)
                            return
                        if (!err.response.data.message) {
                            this.$message.error(err.response.data)
                            return
                        }
                        this.$message.error(err.response.data.message)
                    })
            },
            handleFirstFileChange(file) {
                this.firstForm.fileList = []
                this.firstForm.fileList.push(file)
            },
            uploadSecondFile(data) {
                const file = data.file
                const formData = new FormData();
                formData.append('rentCert', file)

                this.$request
                    .post('/info/files', formData)
                    .then(res => {
                        this.secondForm.fileRes = res.data
                        this.secondForm.fileList[0].status = 'success'
                    })
                    .catch(err => {
                        this.secondForm.fileList[0].status = 'error'
                        if (!err.response || !err.response.data)
                            return
                        if (!err.response.data.message) {
                            this.$message.error(err.response.data)
                            return
                        }
                        this.$message.error(err.response.data.message)
                    })
            },
            handleSecondFileChange(file) {
                this.secondForm.fileList = []
                this.secondForm.fileList.push(file)
            },
            unlockSecondForm() {
                this.secondForm.disabled = false
            },
            get23SubmitShow() {
                switch (this.active) {
                    case 1:
                        return true
                    default:
                        return false
                }
            },
            get23ModifyTest() {
                switch (this.active) {
                    case 1:
                        return '修改初期信息'
                    default:
                        return '修改实习信息'
                }
            },
            dlSecFile() {
                const iframe = document.createElement('iframe')
                iframe.style.display = 'none'
                iframe.src = `${this.$request.defaults.baseURL}/files/${this.secondForm.fileRes}`
                iframe.onload = () => document.body.removeChild(iframe)
                document.body.appendChild(iframe)
            },
            reUpSecFile() {
                this.secondForm.fileRes = null
                this.secondForm.hideUpload = false
            }
        }
    }
</script>

<style scoped>

</style>
