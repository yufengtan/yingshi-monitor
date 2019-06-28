import { message } from 'antd'

const { NODE_ENV } = process.env

export default {
    state: {
        isLogin: JSON.parse(window.localStorage.getItem('isLogin') || 'false'),
        username: NODE_ENV === 'development' ? 'admin' : '',
        password: NODE_ENV === 'development' ? 'express' : '',
        loading: false,
    },
    reducers: {
        update(state, { update }) {
            let newState = {
                ...state,
                ...update
            }
            return newState
        }
    },
    effects: {
        * login(_, { put, select }) {
            yield put({
                type: 'update',
                update: {
                    loading: true
                }
            })
            let { username, password } = yield select(({ login }) => login)
            if (username === 'admin' && password === 'express') {
                window.localStorage.setItem('isLogin', true)
                yield put({
                    type: 'update',
                    update: {
                        loading: false,
                        isLogin: true
                    }
                })
            } else {
                message.error('你输入的账号或密码不正确！')
                yield put({
                    type: 'update',
                    update: {
                        loading: false,
                    }
                })
            }
            /* let { data } = yield login({
                userName: username,
                userPwd: password
            })
            yield put({
                type: 'update',
                update: {
                    loading: false
                }
            })
            if (data.result) {
                ws.json({
                    type: 'online'
                })
            } else {
                message.error(data.msg)
            } */
        }
    }
}
