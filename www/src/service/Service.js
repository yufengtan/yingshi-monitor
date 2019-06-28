import axios from 'axios'
const qs = require('qs')

export const GetAccessToken = () => {
    return axios.get('/api/lapp/token/get')
}

export const GetDeviceList = () => {
    return axios.get('/api/lapp/device/list')
}

export const GetCameraList = (page) => {
    return axios.get('/api/lapp/camera/list', {
        params: {
            page
        }
    })
}

export const StartControll = (options) => {
    return axios.post('/api/lapp/device/ptz/start', qs.stringify(options), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

export const StopControll = (options) => {
    return axios.post('/api/lapp/device/ptz/stop', qs.stringify(options), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}
