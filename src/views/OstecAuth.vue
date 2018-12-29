<!--suppress ALL -->
<template>
    <div></div>
</template>

<script>
    export default {
        name: 'OstecAuth',
        created() {
            const ticket = this.$route.query.ticket
            if (ticket == null || ticket === '') this.$router.push('/')

            const formData = new FormData();
            formData.append('type', 'ticket')
            formData.append('st', ticket)

            const loading = this.$loading({
                lock: true,
                text: '认证中',
                spinner: 'el-icon-loading',
                background: '#fafafa'
            });

            this.$request
                .post('/token', formData)
                .then((res) => {
                    this.$store.commit('login', res.data)
                    this.$router.push('/index')
                })
                .catch((err) => {
                    if (err.response && err.response.status === 502) {
                        this.$message.error("认证错误, 请重新认证")
                        this.$router.push('/login')
                        return
                    }

                    console.log(err.response)
                })
                .finally(() => loading.close())
        }
    }
</script>

<style scoped>

</style>
