import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'
import { Menu, Icon, Spin } from 'antd'
import { updateTabList } from 'actions/tabList'

const SubMenu = Menu.SubMenu
//connect 感知redux
@connect(
    (state, props) => ({ config: state.config }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)
export default class LeftNav extends Component {

  constructor(props, context) {
    super(props, context)

    const { pathname } = props.location
    this.state = {
      current: pathname,
      openKeys: ['sub1'],
      isLeftNavMini: true,
    }

    this._handleClick = this._handleClick.bind(this)
    this._handleToggle = this._handleToggle.bind(this)
    this.navMini = this.navMini.bind(this)
    this.renderLeftNav = this.renderLeftNav.bind(this)
  }

  componentWillMount() {
    // 初始化左侧菜单是mini模式还是正常模式
    if (sessionStorage.getItem('isLeftNavMini') == 'false') {
      this.setState({
        isLeftNavMini: false,
      })
    } else {
      this.setState({
        isLeftNavMini: true,
      })
    }
  }

  _handleClick(e) {
    //this.props.push('')  实现跳转 更新对应的store
    const { actions } = this.props
    // console.log('click ', e)
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1),
    }, () => {
      actions.push(e.key)
      this.props.dispatch(updateTabList({ title: e.item.props.name, content: '', key: e.key }))
    })
  }

  _handleToggle(openKeys) {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
  }
  getAncestorKeys(key) {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  }
  // 左侧菜单切换显示模式
  navMini() {
    this.setState({
      isLeftNavMini: !this.state.isLeftNavMini,
    }, () => {
      // console.log(this.state.isLeftNavMini)
      this.props.leftNavMode(this.state.isLeftNavMini)
    })
  }

  // 二级菜单的生成
  renderLeftNav(options) {
    const self = this
    return options.map((item, index) => {
      if (item.children.length == 0) {
        return (
          // <SubMenu key={index} title={item.name}>
            <Menu.Item key={item.menuUrl ? item.menuUrl : item.menuId} name={item.menuName}>
                {/*{this.props.config.WEBDATA[item.menuUrl] = []}*/}
                {/*{this.props.config.WEBDATA[item.menuUrl].isclose = false}*/}
                {/*{this.props.config.WEBDATA[item.menuUrl].value = ''}*/}
              <Icon type={item.menuIcon} title={item.menuName} />
              <span className="menu-name">{item.menuName}</span>
            </Menu.Item>
          // </SubMenu>
        )
      } else {
        return (
          <SubMenu key={index} title={
            <span>
              <Icon type="caret-down" title={item.menuName} />
              <span className="menu-name">{item.menuName}</span>
            </span>}
          >
            {
              item.menuUrl ?
                <Menu.Item key={item.menuUrl} name={item.menuName}>
                  <Icon type={item.menu_icon} title={item.menuName} />
                  <span className="menu-name">{item.menuName}</span>
                </Menu.Item> : null
            }

            {
              item.children && item.children.length > 0 ? self.renderLeftNav(item.children) : null
            }
          </SubMenu>
        )
      }
    })
  }

  render() {
    // const { loading } = this.props.navResult
    // const navs = this.props.config.NAVIGATION || []
    // console.log('this.props.location', this.props.location)
    const selectedKeys = [`${this.props.location.pathname.split('$')[0]}$`.replace('/', '')]
    return (
      <div className={this.state.isLeftNavMini ? 'LeftNavMini' : ''}>
        <nav id="mainnav-container" className="mainnav-container">
          <div className="LeftNav-control" onClick={this.navMini}>
            <i className="qqbicon qqbicon-navcontrol" />
          </div>
          <Spin spinning={false}>
            <Menu onClick={this._handleClick}
              theme="dark"
              openKeys={this.state.openKeys}
              onOpenChange={this._handleToggle}
              // selectedKeys={[`${this.props.location.pathname}`]}
              selectedKeys={selectedKeys}
              mode="inline"
              // mode="vertical"
            >
              { this.renderLeftNav(JSON.parse(sessionStorage.getItem('menus')) || []) }
            </Menu>
          </Spin>
        </nav>
      </div>
    )
  }
}
