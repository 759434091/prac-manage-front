export default {
    PhiStatus: {
        NULL: {
            label: '未选择',
            value: 0
        },
        AT_SCHOOL: {
            label: '在校',
            value: 1
        },
        LEAVE_SCHOOL: {
            label: '离校',
            value: 2
        },
        AT_HOME: {
            label: '到家',
            value: 3
        },
        AT_RENT: {
            label: '实习',
            value: 4
        }
    },
    PhiAccomType: {
        NULL: {
            label: '未选择',
            value: 0
        },
        RESIDENCE: {
            label: '住校',
            value: 1
        },
        OUTSIDE: {
            label: '在外',
            value: 2
        }
    },
    PhiInfoStep: {
        ZERO: {
            label: '未登记',
            value: 0
        },
        ONE: {
            label: '初期登记',
            value: 1
        },
        TWO: {
            label: '实习登记',
            value: 2
        },
        FOUR: {
            label: '离职登记',
            value: 4
        }
    },
    RentCert: {
        NULL: {
            label: '未选择',
            value: null
        },
        TRUE: {
            label: '已上传',
            value: 'true'
        },
        FALSE: {
            label: '未上传',
            value: 'false'
        },
    },
    enumVal2Label(type, val) {
        for (let i in type) {
            const item = type[i]
            if (item.value === val)
                return item.label
        }
        return ''
    },
    getPhiInfoStep(val) {
        const res = this.enumVal2Label(this.PhiInfoStep, val)
        if (res === '') return '未登记'
        return res
    },
    formatDateTime(dateTimeStr) {
        const date = new Date(dateTimeStr);
        if (date == null) return ''
        return date.toLocaleString()
    }
}
