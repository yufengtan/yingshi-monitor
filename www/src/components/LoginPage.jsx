import React, { PureComponent } from 'react'
import { Form, Icon, Input, Button, Avatar, message } from 'antd'
import Redirect from 'umi/redirect'
import { connect } from 'dva'
const FormItem = Form.Item
// 登录区域组件类
const LoginPage = Form.create()(class extends PureComponent {
    // 登录处理函数
    handleSubmit(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) {
                return message.error('你的输入不正确')
            }
            // this.props.dispatch({
            //     type: 'login/login'
            // })
            this.props.dispatch({
                type: 'login/login',
            })
        })
    }
    onchange = e => {
        let {
            name,
            value
        } = e.target
        let update = {}
        update[name] = value
        this.props.dispatch({
            type: 'login/update',
            update
        })
    }
    // 渲染函数
    render() {
        let { getFieldDecorator } = this.props.form
        let {
            isLogin,
            username,
            password,
            loading,
        } = this.props.login
        if (isLogin) {
            return <Redirect to="/" />
        }
        return <Form style={{
            ...this.props.style,
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: 400,
            height: 420,
            marginTop: -210,
            padding: 32,
            backgroundColor: 'rgba(0,0,20,.7)',
        }} className='login-area' onSubmit={this.handleSubmit.bind(this)}>
            <FormItem style={{
                // textAlign: 'center',
                color: '#4DC1DE',
                fontFamily: '黑体',
                fontSize: 20,
                marginBottom: 56,
            }}>
                {/* <Avatar size={64} src='/images/logo.png' /> */}
                <p>萤石监控视频接入平台</p>
            </FormItem>
            <FormItem>
                {getFieldDecorator('username', {
                    rules: [{
                        required: true,
                        message: '请输入用户账号!'
                    }],
                    initialValue: username
                })(
                    <Input name='username' onChange={this.onchange} size='large' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户账号" />
                )}
            </FormItem>
            <FormItem>
                {getFieldDecorator('password', {
                    rules: [{
                        required: true,
                        message: '请输入用户密码!'
                    }],
                    initialValue: password
                })(
                    <Input name='password' onChange={this.onchange} size='large' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="用户密码" />
                )}
            </FormItem>
            <FormItem>
                <Button style={{
                    width: '100%',
                    marginTop: 56,
                }} loading={loading} type="primary" htmlType="submit" size='large'>登 录</Button>
            </FormItem>
        </Form>
    }
})

export default connect(({
    login
}) => ({
    login
}))(LoginPage)
