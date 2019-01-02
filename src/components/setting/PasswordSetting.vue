<template>
    <el-container>
        <el-main>
            <el-form v-if="passwordCheck.canModify" :model="passwordForm" :rules="passwordFormRules"
                     label-width="100px" label-position="right"
                     ref="passwordForm" class="pass-form">
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
                    <el-button type="primary" @click="doModify">
                        提交
                    </el-button>
                </el-form-item>
            </el-form>
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
            const checkPassFuc = (rule, value, callback) => {
                if (value !== this.passwordForm.newPass)
                    callback(new Error("两次密码不相同"))
                callback();
            }

            return {
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
                        {required: true, message: '请输入原密码', trigger: 'blur'}
                    ],
                    newPass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 ~ 20 个字符', trigger: 'blur'}
                    ],
                    checkPass: [
                        {required: true, message: '请确认新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 ~ 20 个字符', trigger: 'blur'},
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
                        this.$request
                            .put(`/users/${this.jwtPmUser.id}/password`, formData)
                            .then((res) => {
                                if (res.data.success) {
                                    this.$message.success("修改成功, 请重新登陆")
                                    const _this = this
                                    this.$store.dispatch('logout')
                                        .then(() => {
                                            _this.$router.push('/login')
                                        })
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
                    })
            }
        }
    }
</script>

<style scoped>
</style>
