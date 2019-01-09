<template>
    <div>
        <form v-if="imgs.length > 1">
            <div ref="master-img-wrapper" class="master-img-wrapper">
                <img class="master-img" @click="masterClick" :src="`data:image/png;base64,${imgs[0]}`"/>
            </div>
            <img :src="`data:image/png;base64,${imgs[1]}`"/>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Ostec",
        data() {
            return {
                imgs: [],
                coordinates: []
            }
        },
        created() {
            this.$request
                .get('/ostec')
                .then(res => {
                    this.imgs = res.data
                })
        },
        methods: {
            masterClick(event) {
                const coordinate = {
                    x: event.pageX,
                    y: event.pageY
                }

                const checkedIcon = document.createElement('i')
                checkedIcon.className = 'el-icon-success tmpl-checked'
                checkedIcon.style.left = `${coordinate.x - 15}px`
                checkedIcon.style.top = `${coordinate.y - 15}px`

                this.$refs['master-img-wrapper'].append(checkedIcon);
                this.coordinates.push(coordinate)
            }
        }
    }
</script>

<style>
    .master-img {
        width: 259px;
        height: 160px;
        cursor: pointer;
    }

    .tmpl-checked {
        position: absolute;
        width: 30px;
        height: 30px;
        color: #67C23A;
        font-size: 30px;
        cursor: pointer;
    }
</style>
