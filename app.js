const { app } = require('./server')
const express = require('express')
const path = require('path')
const compression = require('compression')
const webeng = require('webeng')

const {
    AccessToken,
    DeviceList,
    CameraList,
    monitor
} = require('./monitor')

app.use(webeng.mw.deliver)
app.use(compression())
app.use(express.static(path.join(__dirname, 'www/dist'), {
    maxAge: 86400000
    //设置缓存
}))

app.get('/api/lapp/token/get', (req, res, next) => {
    AccessToken.then(AccessToken => res.json(JSON.parse(AccessToken))).catch(console.error)
})
app.get('/api/lapp/device/list', (req, res, next) => {
    DeviceList().then(DeviceList => res.json(JSON.parse(DeviceList)))
})
app.get('/api/lapp/camera/list', (req, res, next) => {
    let { page } = req.query
    CameraList(page || 0).then(CameraList => res.json(JSON.parse(CameraList)))
})
app.post('/api/lapp/device/ptz/start', monitor.unreserved())
app.post('/api/lapp/device/ptz/stop', monitor.unreserved())