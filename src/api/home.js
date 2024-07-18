import request from '@/utils/request'
export { get } from '@/api/common.js'
import { params } from '@/store/store.js'

export function getDeptList() {
    return request({
        url: '/getDeptList',
        method: 'get',
        headers: {
            Authorization: "Bearer" + params.token
        }
    })
}

export function getSystemList() {
    return request({
        url: '/getSystemsList',
        method: 'get',
        headers: {
            Authorization: "Bearer" + params.token
        }
    })
}
export function getLogin(user) {
    return request({
        url: '/auth/login',
        method: 'post',
        data: user
    })
}
export function sendSMS(tel) {
    return request({
        url:'/sms/send/' + tel,
        method: 'get'
    })
}
export function validateSMS(tel, code) {
    return request({
        url: '/sms/validate/' + tel + '/' + code,
        method: 'get'
    })
}
export function resetPasswordSMS(params) {
    return request({
        url: '/sms/changePwd',
        method: 'post',
        data: params
    })
}
export function changePassword(password) {
    return request({
        url: '/auth/change_password',
        method: 'post',
        data: password.new_password
    })
}
export function getTelephone(tel) {
    return request({
        url: '/csgj-to-ddzh/getTel?tel=' + tel,
        method: 'get',
    })
}