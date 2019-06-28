import MonitorManager from '../components/MonitorManager'
import { connect } from 'dva'
import Redirect from 'umi/redirect'
import { Button } from 'antd'
import router from 'umi/router'

// export default function () {
//   return <div>
//     <MonitorManager></MonitorManager>
//   </div>
// }

export default connect(({ login }) => ({ login }))(function (props) {
  let { isLogin } = props.login
  if (!isLogin) {
    return <Redirect to='login' />
  }
  return <div>
    <MonitorManager></MonitorManager>
    <Button onClick={exit => {
      props.dispatch({
        type: 'login/update',
        update: {
          isLogin: false
        }
      })
      window.localStorage.setItem('isLogin', false)
      router.push('/login')
    }} type='danger' size='small' ghost style={{
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 1e4,
    }}>安全退出</Button>
  </div>
})