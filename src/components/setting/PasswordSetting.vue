<template>
    <el-container>
        <el-main>
            <template v-if="passwordCheck.canModify">
                <el-form :model="passwordForm" :rules="passwordFormRules"
                         label-width="100px" label-position="right"
                         ref="passwordForm" class="pass-form"
                         v-loading="loading" :disabled="loading">
                    <el-form-item label="原密码" v-show="!passwordCheck.noLogin" prop="oriPass">
                        <el-col :span="12" :xl="8" :lg="14" :md="18">
                            <el-input type="password" v-model="passwordForm.oriPass" placeholder="请输入原密码"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPass">
                        <el-col :span="12" :xl="8" :lg="14" :md="18">
                            <el-input type="password" v-model="passwordForm.newPass" placeholder="请输入新密码"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkPass">
                        <el-col :span="12" :xl="8" :lg="14" :md="18">
                            <el-input type="password" v-model="passwordForm.checkPass" placeholder="请确认新密码"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="loading" :loading="loading" type="primary" @click="doModify">
                            提交
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <p v-else>没有权限</p>
        </el-main>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "PasswordSetting",
        computed: {
            ...mapState(['jwtPmUser'])
        },
        created() {
            this.$request
                .get(`/users/${this.jwtPmUser.id}/password`)
                .then(res => {
                    this.passwordCheck = res.data
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
        data() {
            const checkOriFuc = (rule, value, callback) => {
                if (this.passwordCheck.noLogin) {
                    callback()
                    return
                }
                if (value == null || value === '') {
                    callback(new Error("请输入原密码"))
                    return
                }
                callback();
            }
            const checkPassFuc = (rule, value, callback) => {
                if (value !== this.passwordForm.newPass)
                    callback(new Error("两次密码不相同"))
                callback();
            }

            return {
                loading: false,
                passwordCheck: {
                    canModify: false,
                    noLogin: false
                },
                passwordForm: {
                    oriPass: null,
                    newPass: null,
                    checkPass: null
                },
                passwordFormRules: {
                    oriPass: [
                        {validator: checkOriFuc, trigger: 'blur'}
                    ],
                    newPass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 ~ 20 个字符', trigger: 'change'}
                    ],
                    checkPass: [
                        {required: true, message: '请确认新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 ~ 20 个字符', trigger: 'change'},
                        {validator: checkPassFuc, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            doModify() {
                this.$refs.passwordForm
                    .validate((valid) => {
                        if (!valid)
                            return;

                        const formData = new FormData();
                        if (this.passwordForm.oriPass != null && this.passwordForm.oriPass.trim() !== '')
                            formData.append("oriPass", this.passwordForm.oriPass)
                        formData.append("newPass", this.passwordForm.newPass.trim())

                        this.loading = true
                        this.$request
                            .put(`/users/${this.jwtPmUser.id}/password`, formData)
                            .then((res) => {
                                if (res.data.success) {
                                    this.$message.success("修改成功, 请重新登陆")
                                    this.$router.push('/login')
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
                            .finally(() => this.loading = false)
                    })
            }
        }
    }
</script>

<style scoped>
</style>
