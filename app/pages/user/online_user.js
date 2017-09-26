/**
 * Created by kwx on 2017/8/22.
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import { connect } from 'react-redux'
import {message,Card,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
import { getOnlineUserList,shotOffOnlineUser} from '../../ajax/user'
import '../../style/base.less'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
        logout:state.logout
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)


export default class online_user extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            loading: false,
            data:[],
            visible: false,
            auser:{}

        }

        this.showModal  = this.showModal.bind(this);

    }
    //渲染前
    componentWillMount() {
            const pagination={}
            pagination.pageNo =1;
            pagination.pageSize = 100000;
            getOnlineUserList(pagination, (res) => {
                console.log("++++++" + res);
                if (res.ospState == 200) {
                    //this.state.data = res.data.ucUser
                    this.setState({data:res.data.ucUser})
                    console.log(res);
                } else if (res.ospState == 401){
                    message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
                }else {
                    message.warning(res.data.msg)
                }
            })

    }
    componentWillUnmount() {

    }
    //展示弹出框
    showModal = (record) => {
        if(record.jwtToken.length>32) {
            record.jwtToken = record.jwtToken.substring(32,64)
        }
        console.log("显示时的长度"+record.jwtToken.length)
        this.setState({
            auser:record,
            visible: true,

        });
    }

    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false ,auser:{}});
    }


    deleteLogin  = (index) => {
        let data = {}
            data.ospToken = index;
        data.pageNo =1;
        data.pageSize = 100000;
        shotOffOnlineUser(data, (res) => {
            //1  有效 0 禁止
            console.log("++++++" + res);
            if (res.ospState == 200) {
                this.setState({data:res.data.ucUser})
                console.log(res);
            }else if (res.ospState == 401){
                message.warning("没有登录或登录时间过期，请重新登录", 2, ()=>{ hashHistory.push('/login')})
            } else {
                message.warning(res.msg)
            }
        })
    }



    render() {

        const columns = [{
            title: '会话ID',
            dataIndex: 'jwtToken',
            render: (text, record, index) => {
                const a = text;
                console.log("列表时的长度"+text.length)
                if(a.length<33) {
                    return a;
                }   else {
                    return a.substring(32,64);
                }

            }
        }, {
            title: '账号',
            dataIndex: 'userName',
        },{
            title: 'Email',
            dataIndex: 'userEmail',
        },{
            title: '创建时间',
            dataIndex: 'createJWTTime',
        },{
            title: '会话最后活动时间',
            dataIndex: 'lastActionTime',
        },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = ''
                     record.status > 0 ?(title_action = "踢出"+record.userName):(title_action = "激活"+record.nickName);
                    return (
                        this.state.data.length > 0 ?
                            (
                                <div> <Popconfirm title={title_action} onConfirm={() => this.deleteLogin(record.jwtToken)}>
                                    <a href="#">踢出</a>
                                </Popconfirm>
                                    <span className="ant-divider" />
                                    <a onClick={() => this.showModal(record)}
                                    >详情</a>
                                </div>

                            ) : null
                    );
                },
            }
        ];

        const auser = this.state.auser;
        return (

                <div  className="pageStyle">
                    <Modal
                        visible={this.state.visible}
                        title="Session详情"
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="small" onClick={this.handleCancel}>返回</Button>,

                        ]}
                    >
                        <Form layout="vertical">
                            <FormItem label="会话ID">
                                <Input value={auser.jwtToken}  />
                            </FormItem>
                            <FormItem label="创建时间">
                                <Input value={auser.createJWTTime}   />
                            </FormItem>
                            <FormItem label="会话最后活动时间">
                                <Input value={auser.lastActionTime}   />
                            </FormItem>
                            <FormItem label="账号">
                                <Input value={auser.userName}   />
                            </FormItem>
                            <FormItem label="Email">
                                <Input value={auser.userEmail}  />
                            </FormItem>

                        </Form>
                    </Modal>
                    <Card title="在线用户" className="cardStyle">
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                   </Card>
                </div>
        );
    }
}




