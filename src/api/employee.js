import request from '@/utils/request'
export function getEmployee(){
    return request({
        url:"/sys/user/simple"
    })
}