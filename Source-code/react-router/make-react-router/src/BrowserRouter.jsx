import React from 'react'
import Context from './Context'
const { Provider, Consumer } = Context
// Provider 生产者: 把 xx 当作全局变量
// Comsumer 消费者: 把 xx 取下来

// 匹配浏览器当前 url
// <Router path="/users"><Users /></Router>
// path 这个 prop 能不能匹配上，匹配上了就展示

class BrowserRouter extends React.Component {
  // location 直接从 window.location 上取 -> DOM -> 限制在浏览器端
  // 不能放在服务端使用
  // 更新 pathname
  handlePathnameChange = (pathname) => {
    const history = this.state.history
    this.setState({
      history: {
        ...history,
        pathname
      }
    })
  }

  state = {
    history: {
      location: window.location,
      pathname: window.location.pathname,
      handlePathnameChange: this.handlePathnameChange
    }
  }

  render() {
    return (
      // value 中的数据传递给 Consumer
      <Provider value={{...this.state.history}}>
        { this.props.children }
      </Provider>
    )
  }
}

export default BrowserRouter;