import React, { PureComponent } from 'react'
import Monitor from './Monitor'
import styled from 'styled-components'
import { connect } from 'dva'
import { Menu, Icon } from 'antd'

const { Item } = Menu

export default
@connect(({ monitors }) => ({ monitors }))
class extends PureComponent {
    state = {
        selectedKeys: []
    }
    Wrapper = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        z-index: 1;
        /* display: flex; */
        .menu,.view{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
            z-index: 10;
            overflow: auto;
        }
        .menu{
            width: 3rem;
            background-color: #001529;
        }
        .view{
            position: absolute;
            left: 3rem;
            right: 0;
            padding: .16rem;
        }
    `
    componentDidMount() {
        this.props.dispatch({
            type: 'monitors/pull'
        })
    }
    componentDidUpdate() {
        let { monitors } = this.props
        if (monitors.list.length && !this.state.selectedKeys.length) {
            this.setState({
                selectedKeys: [monitors.list[0].deviceSerial + '-' + monitors.list[0].channelNo]
            })
        }
    }
    render() {
        let { Wrapper, MenuRender } = this
        let { list } = this.props.monitors
        let { selectedKeys } = this.state
        let showMonitor = selectedKeys[0] && list.filter(item => {
            let temp = selectedKeys[0].split('-')
            return item.deviceSerial === temp[0] && item.channelNo == temp[1]
        })[0] || null
        return <Wrapper>
            {MenuRender(list)}
            <div className="view">
                {showMonitor && <Monitor
                    data={showMonitor}
                />}
            </div>
        </Wrapper>
    }
    onSelect = ({ selectedKeys }) => {
        this.setState({
            selectedKeys
        })
    }
    MenuRender = list => {
        return <div className="menu">
            <Menu
                theme='dark'
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
            >
                {list.map(item => <Item key={item.deviceSerial + '-' + item.channelNo}>
                    <Icon type="instagram" />
                    {item.channelName}
                </Item>)}
            </Menu>
        </div>
    }
}