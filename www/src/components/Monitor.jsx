import React, { PureComponent } from 'react'
import { message, Spin } from 'antd'
import styled from 'styled-components'

import {
    GetAccessToken,
    StartControll,
    StopControll,
} from '../service/Service'

const EZUIKit = window.EZUIKit
const Delay = time => new Promise(resolve => window.setTimeout(resolve, time))
/**
 * 监控组件基于萤石视频封装
 */
export default class extends PureComponent {
    Wrapper = styled.div`
        width: 100%;
        height: 100%;
        position: relative;
        #playWind{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .monitor-title{
            color: #fff;
            background-color: rgba(0,0,0,.65);
            padding: .08rem 0;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
            text-align: center;
        }
        .screenshot{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .ant-spin{
            position: absolute;
            z-index: 10;
            width: 2rem;
            height: 1rem;
            top: 50%;
            left: 50%;
            margin-left: -1rem;
            margin-top: -.5rem;
        }
    `
    componentDidMount() {
        this.play()
    }

    componentDidUpdate() {
        this.decoder = null
        this.play()
    }

    play() {
        this.screenshot.style.display = 'block'
        let {
            deviceSerial,
            channelNo,
            channelName,
            picUrl,
            status
        } = this.props.data
        GetAccessToken().then(res => res.data).then(data => {
            if (data.code === '200') {
                this.accessToken = data.data.accessToken
                let url = `ezopen://open.ys7.com/${deviceSerial}/${channelNo}.live`
                console.log(url)
                let accessToken = this.accessToken
                this.decoder = new EZUIKit.EZUIPlayer({
                    id: 'playWind',
                    autoplay: true,
                    url,
                    accessToken,
                    decoderPath: '',
                    width: this.video.offsetWidth,
                    height: this.video.offsetHeight,
                    handleError: () => {
                        message.error('监控视频初始化失败！')
                        this.screenshot.style.display = 'none'
                    },
                    handleSuccess: () => {
                        this.screenshot.style.display = 'none'
                        return
                        let target = this.crt
                        target && (() => {
                            let position = [0, 0]
                            let controllning = false
                            let delta = 0
                            let timer = null
                            target.onmousedown = () => {
                                position = [0, 0]
                            }
                            target.onmouseup = () => {
                                if (controllning) {
                                    return false
                                }
                                let X = parseInt(position[0] / 50)
                                let Y = parseInt(position[1] / 50)
                                let direction = 0
                                let ABS = 0
                                if (X && Y) {
                                    ABS = Math.max(Math.abs(X), Math.abs(Y))
                                    direction = (() => {
                                        if (X > 0 && Y > 0) {
                                            return 7
                                        }
                                        if (X > 0 && Y < 0) {
                                            return 6
                                        }
                                        if (X < 0 && Y < 0) {
                                            return 4
                                        }
                                        if (X < 0 && Y > 0) {
                                            return 5
                                        }
                                    })()
                                }
                                if (X && !Y) {
                                    ABS = Math.abs(X)
                                    direction = (() => {
                                        if (X > 0) {
                                            return 3
                                        }
                                        if (X < 0) {
                                            return 2
                                        }
                                    })()
                                }
                                if (!X && Y) {
                                    ABS = Math.abs(Y)
                                    direction = (() => {
                                        if (Y > 0) {
                                            return 1
                                        }
                                        if (Y < 0) {
                                            return 0
                                        }
                                    })()
                                }
                                let controllTime = ABS * 200
                                if (controllTime) {
                                    message.info('云台控制开始')
                                    controllning = true
                                    // 开始控制
                                    StartControll({
                                        accessToken,
                                        deviceSerial: this.list[0].deviceSerial,
                                        channelNo: 1,
                                        direction,
                                        speed: 1
                                    }).then(res => res.data).then(data => {
                                        console.log('开始控制反馈 : ', data)
                                        if (data.code !== '200') {
                                            controllning = false
                                            return message.error(data.msg)
                                        }
                                        Delay(controllTime).then(() => {
                                            // 停止控制
                                            StopControll({
                                                accessToken,
                                                deviceSerial: this.list[0].deviceSerial,
                                                channelNo: 1,
                                                direction,
                                            }).then(res => res.data).then(data => {
                                                console.log('停止控制反馈 : ', data)
                                                controllning = false
                                                message.info('云台控制结束')
                                            }).catch(console.error)
                                        })
                                    }).catch(console.error)
                                }
                            }
                            target.onmousemove = ({ movementX, movementY }) => {
                                if (controllning) {
                                    return false
                                }
                                position[0] += movementX
                                position[1] += movementY
                            }
                            target.onwheel = ({ deltaY }) => {
                                if (controllning) {
                                    return false
                                }
                                deltaY > 0 ? delta++ : delta--
                                timer && window.clearTimeout(timer)
                                if (delta === 0) {
                                    return false
                                }
                                message.info('云台控制开始')
                                controllning = true
                                timer = window.setTimeout(() => {
                                    let controllTime = Math.abs(delta) * 200
                                    let direction = delta > 0 ? 9 : 8
                                    delta = 0
                                    // 开始控制
                                    StartControll({
                                        accessToken,
                                        deviceSerial: this.list[0].deviceSerial,
                                        channelNo: 1,
                                        direction,
                                        speed: 1
                                    }).then(res => res.data).then(data => {
                                        console.log('开始控制反馈 : ', data)
                                        if (data.code !== '200') {
                                            controllning = false
                                            return message.error(data.msg)
                                        }
                                        Delay(controllTime).then(() => {
                                            // 停止控制
                                            StopControll({
                                                accessToken,
                                                deviceSerial: this.list[0].deviceSerial,
                                                channelNo: 1,
                                                direction,
                                            }).then(res => res.data).then(data => {
                                                console.log('停止控制反馈 : ', data)
                                                controllning = false
                                                message.info('云台控制结束')
                                            }).catch(console.error)
                                        })
                                    }).catch(console.error)
                                }, 500)
                            }
                        })()
                    },
                })
            } else {
                message.error(data.msg)
            }
        }).catch(console.error)
    }
    render() {
        let {
            deviceSerial,
            channelNo,
            channelName,
            picUrl,
            status
        } = this.props.data
        let { Wrapper } = this
        return <Wrapper>
            <div
                id='playWind'
                key={deviceSerial + channelNo}
                ref={video => this.video = video}
            ></div>
            <div className="monitor-title">
                {channelName}
            </div>
            <div
                className="screenshot"
                ref={screenshot => this.screenshot = screenshot}
            >
                <img src={picUrl} alt={channelName} />
                <Spin size='large' tip='Loading ···' />
            </div>
        </Wrapper>
    }
}