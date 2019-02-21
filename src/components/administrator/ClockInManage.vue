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
                <el-table-column label="年级" prop="puGrade" width="50px"/>
                <el-table-column label="学号" prop="puStuId" width="150px"/>
                <el-table-column label="姓名" prop="puFullName" width="150px"/>
                <el-table-column label="打卡时间" prop="pmCloclkIn.PciDateTime" width="200px">
                    <template slot-scope="scope">
                        <span v-text="$util.formatDateTime(scope.row.pmClockIn.pciDateTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="打卡地点(预测)">
                    <template slot-scope="scope">
                        <span v-text="scope.row.locInfo == null ? '检索中' : scope.row.locInfo"></span>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline size="mini" class="table-expand">
                            <el-form-item label="年级">
                                <span v-text="scope.row.puGrade"></span>
                            </el-form-item>
                            <el-form-item label="学号">
                                <span v-text="scope.row.puStuId"></span>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <span v-text="scope.row.puFullName"></span>
                            </el-form-item>
                            <el-form-item label="打卡日期">
                                <span v-text="$util.formatDate(scope.row.pmClockIn.pciDate)"></span>
                            </el-form-item>
                            <el-form-item label="打卡时间">
                                <span v-text="$util.formatDateTime(scope.row.pmClockIn.pciDateTime)"></span>
                            </el-form-item>
                            <el-form-item label="打卡地点(预测)">
                                <span v-text="scope.row.locInfo == null ? '检索中' : scope.row.locInfo"></span>
                            </el-form-item>
                            <el-form-item label="经度">
                                <span v-text="scope.row.pmClockIn.pciLong"></span>
                            </el-form-item>
                            <el-form-item label="纬度">
                                <span v-text="scope.row.pmClockIn.pciLat"></span>
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
                    :page-sizes="[10, 30, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
            </el-pagination>
        </el-footer>
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
                pmUserWithClockInList: [],
                geocoder: null
            }
        },
        mounted() {
            this.$refs.clockInQueryForm.validate((valid) => {
                    if (!valid) return
                    this.handleCurrentChange(1)
                }
            )
            // eslint-disable-next-line
            this.geocoder = new qq.maps.Geocoder();
        },
        methods: {
            getLocInfo(pmUserWithClockIn) {
                const clockIn = pmUserWithClockIn.pmClockIn
                const cbName = `locInfoCb${pmUserWithClockIn.puId}`
                const script = document.createElement('script')
                const _this = this
                window[cbName] = result => {
                    if (result.info == null
                        || result.info.error == null
                        || result.info.error !== 0
                        || result.detail.poi_count < 1)
                        pmUserWithClockIn.locInfo = '获取失败'
                    else
                        pmUserWithClockIn.locInfo = result.detail.poilist[0].addr
                    _this.$set(
                        _this.pmUserWithClockInList,
                        _this.pmUserWithClockInList.indexOf(pmUserWithClockIn),
                        pmUserWithClockIn)
                    window[cbName] = undefined
                    document.body.removeChild(script)
                }
                script.setAttribute('src', `https://apis.map.qq.com/jsapi?qt=rgeoc&lnglat=${clockIn.pciLong}%2C${clockIn.pciLat}&key=OXNBZ-FK2W5-6NMI7-QYXJY-IAY7F-WEFBS&output=jsonp&pf=jsapi&ref=jsapi&cb=${cbName}`)
                document.body.appendChild(script)
            },
            onSearch() {
                this.$refs.clockInQueryForm.validate((valid) => {
                        if (!valid) return
                        this.handleCurrentChange(1)
                    }
                )
            },
            handleSizeChange(size) {
                this.pagination.size = size
                this.onSearch()
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

                        let timeout = 0;
                        this.pmUserWithClockInList
                            .forEach(uwc => {
                                const _this = this
                                setTimeout(() => {
                                    _this.getLocInfo(uwc)
                                }, timeout)
                                timeout += 100
                            })
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
