const webeng = require('webeng')
const Schedule = require('node-schedule')
const web = new webeng('https://open.ys7.com')
const AppKey = 'c4ef748061474e929b84902d8dc90386'
const Secret = '52da64930072a511d9311f07aa90d8e8'
// const AppKey = 'e979684a2827458f93ed74c10b037619'
// const Secret = 'f45cfad0131f225fa85df4db79c13e32'

const getAccessToken = () => {
    return new Promise((resolve, reject) => {
        let xhr = web.request('/api/lapp/token/get', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, response => response.text().then(resolve))
        xhr.end(`appKey=${AppKey}&appSecret=${Secret}`)
        xhr.on('error', reject)
    })
}

let AccessToken = getAccessToken()

let DeviceList = () => new Promise((resolve, reject) => {
    AccessToken.then(res => {
        let data = JSON.parse(res)
        if (data.code === '200') {
            let xhr = web.request('/api/lapp/device/list', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, response => response.text().then(resolve))
            xhr.end(`accessToken=${data.data.accessToken}`)
            xhr.on('error', reject)
        }
    }).catch(reject)
})

let CameraList = (page) => new Promise((resolve, reject) => {
    AccessToken.then(res => {
        let data = JSON.parse(res)
        if (data.code === '200') {
            let xhr = web.request('/api/lapp/camera/list', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, response => response.text().then(resolve))
            xhr.end(`accessToken=${data.data.accessToken}&pageStart=${page}`)
            xhr.on('error', reject)
        }
    }).catch(reject)
})

Schedule.scheduleJob('0 0 * * * *', () => {
    AccessToken = getAccessToken()
})

module.exports = {
    AccessToken,
    DeviceList,
    CameraList,
    monitor: web,
}