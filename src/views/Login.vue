<template>
    <el-container class="login-box-container">
        <el-row class="login-box-row" type="flex" justify="center">
            <el-col class="login-box-col" :xl="5" :md="8" :sm="12" :xs="20" :span="12">
                <h1 class="login-box-brand">实习登记系统</h1>
                <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="loginRules">
                    <el-form-item label="用户名/学号/教工号" prop="puId">
                        <el-input v-model="loginForm.puId" @keyup.enter.native="onSubmit"/>
                    </el-form-item>
                    <el-form-item label="密码" prop="puPassword">
                        <el-input type="password" v-model="loginForm.puPassword" @keyup.enter.native="onSubmit"/>
                    </el-form-item>
                    <el-form-item class="login-button-group">
                        <el-button class="login-form-button" type="primary" @click="onSubmit" size="mini"
                                   :loading="loginProcessing"
                                   :disabled="loginProcessing">
                            登录
                        </el-button>
                        <el-button class="login-form-button" type="info" @click="goOstec" size="mini"
                                   :disabled="loginProcessing">
                            使用实验中心登录
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-form size="mini" label-width="40px" label-position="left">
                    <el-form-item label="学生">
                        <span>初次登录使用实验中心登录进行登记, 并请修改本系统密码</span>
                    </el-form-item>
                    <el-form-item label="家长">
                        <span>使用身份证去掉最后一位的后六位密码, 特殊证件直接输入学号登录查看</span>
                    </el-form-item>
                </el-form>
                <span>学生请勿使用身份证密码登录, 否则没有权限</span>
                <span>建议使用 Chrome 浏览器以获得最佳体验</span>
                <br>
                <br>
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
                        trigger: 'change'
                    }],
                    puPassword: [{
                        required: true,
                        message: '密码不能为空',
                        trigger: 'change'
                    }]
                },
                loginProcessing: false
            }
        },
        created() {
            this.$store.dispatch('logout')
        },
        methods: {
            onSubmit() {
                this.$notify.closeAll()
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
                    })
                    .finally(() => this.loginProcessing = false)
            },
            goOstec() {
                document.location.href = 'https://ostec.uestc.edu.cn/authcas/login?service=https://www.xsix103.cn/prac-manage/ostecAuth'
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

    .login-button-group {
        white-space: nowrap;
    }

    .login-form-info {
        margin-left: 1.5rem;
        cursor: pointer;
    }

    @media screen and (max-width: 768px) {
        .login-box-col {
            padding: 10px 20px;
        }
    }

    @media screen and (max-width: 350px) {
        .login-box-col {
            width: 95% !important;
            padding: 10px;
        }
    }
</style>
