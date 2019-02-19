<template>
    <el-container>
        <el-header height="auto">
            <el-form ref="clockInQueryForm" size="mini" :model="clockInQuery" :inline="true" label-width="auto"
                     label-position="right"
                     :rules="clockInQueryRules">
                <el-form-item label="年级" prop="pmUser.puGrade">
                    <el-select v-model="clockInQuery.pmUser.puGrade" placeholder="请选择">
                        <el-option label="未选择" :value="null"></el-option>
                        <el-option label="2016" :value="2016"></el-option>
                        <el-option label="2015" :value="2015"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" prop="date">
                    <el-date-picker v-model="clockInQuery.date" type="date" placeholder="选择日期"
                                    :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" :disabled="loading" @click="onSearch" type="primary">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main>
            <el-table :data="pmUserWithClockInList" size="mini" v-loading="loading">

            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "ClockInManage",
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                clockInQueryRules: {
                    'pmUser.puGrade': [
                        {required: true, message: '请选择年级', trigger: 'blur'}
                    ],
                    'date': [
                        {required: true, message: '请选择日期', trigger: 'blur'}
                    ]
                },
                clockInQuery: {
                    pmUser: {
                        puStuId: null,
                        puFullName: null,
                        puGrade: 2016
                    },
                    clockIn: null,
                    date: (() => {
                        const date = new Date()
                        date.setHours(0, 0, 0, 0)
                        return date
                    })()
                },
                pagination: {
                    currentPage: 1,
                    total: 0,
                    size: 10
                },
                loading: false,
                pmUserWithClockInList: []
            }
        },
        mounted() {
            this.$refs.clockInQueryForm.validate((valid) => {
                    if (!valid) return
                    this.handleCurrentChange(1)
                }
            )
        },
        methods: {
            onSearch() {
                this.$refs.clockInQueryForm.validate((valid) => {
                        if (!valid) return
                        this.handleCurrentChange(1)
                    }
                )
            },
            handleCurrentChange(page) {
                this.loading = true
                this.clockInQuery.pageNum = page
                this.clockInQuery.pageSize = this.pagination.size
                this.$request
                    .post('/getClockIns', this.clockInQuery)
                    .then(res => {
                        const pageIntro = res.data
                        if (pageIntro.total === 0) this.$message.warning('暂无数据')
                        this.pagination.currentPage = pageIntro.pageNum
                        this.pagination.total = pageIntro.total
                        this.pmUserWithClockInList = pageIntro.list
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
            }
        }
    }
</script>

<style scoped>

</style>
