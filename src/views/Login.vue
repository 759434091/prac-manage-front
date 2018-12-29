<template>
    <el-container class="login-box-container">
        <el-row class="login-box-row" type="flex" justify="center">
            <el-col class="login-box-col" :xl="5" :xs="12" :md="8" :sm="9" :span="12">
                <h1 class="login-box-brand">Practical Management</h1>
                <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="loginRules">
                    <el-form-item label="用户名/学号/教工号" prop="puId">
                        <el-input v-model="loginForm.puId" @keyup.enter.native="onSubmit"/>
                    </el-form-item>
                    <el-form-item label="密码" prop="puPassword">
                        <el-input type="password" v-model="loginForm.puPassword" @keyup.enter.native="onSubmit"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login-form-button" type="primary" @click="onSubmit"
                                   :loading="loginProcessing"
                                   :disabled="loginProcessing">
                            登录
                        </el-button>
                        <el-button class="login-form-button" type="info" @click="goOstec"
                                   :disabled="loginProcessing">
                            实验中心认证入口
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-container>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                loginForm: {
                    puId: '',
                    puPassword: ''
                },
                loginRules: {
                    puId: [{
                        required: true,
                        message: '用户名不能为空',
                        trigger: 'blur'
                    }],
                    puPassword: [{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }]
                },
                loginProcessing: false
            }
        },
        methods: {
            onSubmit() {
                this.loginProcessing = true
                const formData = new FormData()
                formData.append('type', 'username')
                formData.append('username', this.loginForm.puId)
                formData.append('password', this.loginForm.puPassword)
                this.$request
                    .post('token', formData)
                    .then((res) => {
                        this.$store.commit('login', res.data)
                        this.$router.push('/index')
                    })
                    .catch((err) => {
                        if (err.response && (err.response.status === 400 || err.response.status === 401)) {
                            this.$message.error("用户名或密码错误")
                            return
                        }

                        if (err.response && err.response.status === 403) {
                            this.$message.error("请使用认证中心登录, 并修改密码")
                            return
                        }

                        console.log(err.response)
                    })
                    .finally(() => this.loginProcessing = false)
            },
            goOstec() {
                document.location.href = 'https://ostec.uestc.edu.cn/authcas/login?service=http://localhost:8080/ostecAuth'
            }
        }
    }
</script>

<style>
    .login-box-container {
        height: calc(100vh - 16px);
    }

    .login-box-row {
        width: 100%;
    }

    .login-box-col {
        padding: 10px 60px;
        border-radius: 10px;
        margin: auto auto;
        background-color: #d8d8d8;
    }

    .login-box-brand {
        color: #686f77;
    }

    .login-form-button {
        margin-top: 12px !important;
        margin-bottom: 12px !important;
    }

    .login-form .el-form-item.is-required .el-form-item__label:before {
        content: none;
    }
</style>
