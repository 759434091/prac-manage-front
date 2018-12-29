<template>
    <div>
        index
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Index",
        computed: {
            ...mapState(['accessToken', 'jwtPmUser']),
        },
        created() {
            // reset state
            if (this.accessToken == null || this.jwtPmUser == null) {
                const accessToken = localStorage.getItem('accessToken')
                const jwtPmUser = JSON.parse(localStorage.getItem('jwtPmUser'))
                if (accessToken == null || jwtPmUser == null) {
                    this.$router.push('/login')
                    return
                }

                this.$store.commit('resetState', {
                    accessToken,
                    jwtPmUser
                })
                this.$router.push('/index')
            }
        }
    }
</script>

<style scoped>

</style>
