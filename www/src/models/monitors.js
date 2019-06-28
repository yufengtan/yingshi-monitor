import {
    GetCameraList,
} from '../service/Service'
import { message } from 'antd'

export default {
    state: {
        list: []
    },
    reducers: {
        // 更新列表
        update(state, { update }) {
            return {
                ...state,
                ...update
            }
        },
        // 追加列表
        push(state, { push }) {
            let list = [...state.list]
            return {
                ...state,
                list: list.concat(push)
            }
        }
    },
    effects: {
        // 拉取摄像头列表
        *pull(_, { put }) {
            let { page, data, code, msg } = yield GetCameraList().then(res => res.data).catch(console.error)
            if (code === '200') {
                yield put({
                    type: 'update',
                    update: {
                        list: data
                    }
                })
                let { total, size } = page
                let pageNum = Math.ceil(total / size)
                for (let i = 1; i < pageNum; i++) {
                    let { code, data, msg } = yield GetCameraList(i).then(res => res.data).catch(console.error)
                    if (code === '200') {
                        yield put({
                            type: 'push',
                            push: data
                        })
                    } else {
                        message.error(msg)
                    }
                }
            } else {
                message.error(msg)
            }
        }
    }
}