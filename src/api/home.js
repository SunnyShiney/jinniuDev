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
function formatLocalDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
export function uploadClickLog(system) {
    var log = {
        phone: params.username,
        subsystem: system,
        clickTime: formatLocalDateTime(),
    }
    console.log("time:  " + log.clickTime);
    request({
        url: '/click-log/add',
        method: 'post',
        data: log,
        headers: {
            Authorization: "Bearer" + params.token
        }
    }).then((data) => {
        if (data) {
          console.log("日志上传成功");
        } else {
          console.log("日志上传失败");
        }
    });
}
export function getClickLog() {
    return request({
        url: '/click-log/get',
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