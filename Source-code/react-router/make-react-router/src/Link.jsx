import React from 'react'
import Context from './Context'
const { Consumer } = Context

class Link extends React.Component {
  handleClick = (e) => {
    // Link 只需要切换显示对应的组件
    // 阻止 a 标签默认跳转事件
    e.preventDefault()
    // 切换显示组件
    // pathname 匹配 -> Provider
  }

  render() {
    return (
      <Consumer>
        {
          ({handlePathnameChange}) => {
            return (
              <a onClick={(e) => {
                e.preventDefault()
                // h5 history API
                window.history.pushState({}, '', this.props.to) // 导航栏路由改变
                handlePathnameChange(this.props.to)
              }}>
                { this.props.children }
              </a>
            )
          }
        }
        
      </Consumer>
    )
  }
}

export default Link
