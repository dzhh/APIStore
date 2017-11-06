/**
 * Created by kwx on 2017/8/12.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge,Card} from 'antd'
import moment from 'moment';
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { myPermission } from '../../ajax/user'
import '../../style/base.less'
@connect(
    (state, props) => ({
        config: state.config,
    }),
    //(dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)


export default class my_permissions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            confirmDirty: false,
            data:[]
        }

    }
    componentWillMount(){
            const user = {};
            user.userId = sessionStorage.getItem('userId')
            myPermission(user, (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {
                    this.setState({data: JSON.parse(res.data.myPermission)})
                } else if (res.ospState == 401) {
                    message.warning("没有登录或登录时间过期，请重新登录", 2, () => {
                        hashHistory.push('/login')
                    })
                } else {
                    message.warning('未知错误')
                }
            })

    }
    componentDidMount() {
        console.log(this.props)
    }
//页面销毁之前
    componentWillUnmount() {

    }

    render() {


        return (
                (
                    <div className="pageStyle">
                        <Card title="我的权限"  className="cardStyle">
                      {this.state.data.map((item, index) => {
                          let menuClass;
                          if(item.permissions.length>0){
                              menuClass = 'menuLengths'
                          }else{
                              menuClass = 'menuLength'
                          }
                              const menu = (
                                     <Menu className={menuClass}>
                                      {
                                          item.permissions.map((item_chileren, index_children) => {
                                          return <Menu.Item style={{marginLeft:"2%"}} key={item_chileren.actionId|item_chileren.menuId}> <Icon type="user" />{item_chileren.menuName||item_chileren.actionName}</Menu.Item>
                                      })
                                      }
                                  </Menu>

                              );




                          return <div style={{marginLeft:"45%",marginRight:"42%"}}>
                              <Dropdown overlay={menu} trigger={['click']}>
                              <h2 className="ant-dropdown-link" href="#" style={{textAlign: 'left'}}>
                                  <div style={{textAlign:'left'}}><Icon type="user"/>{item.roleName}
                                      <Icon type="down"/>
                                  <Badge count={item.permissions.length}
                                         style={{
                                             textAlign:'center'
                                             //backgroundColor: '#87d068',

                                         }}
                                  />
                                  </div>
                              </h2>
                          </Dropdown></div>
                      })
                      }
                        </Card>
                  </div>
              )

        )
    }

}
