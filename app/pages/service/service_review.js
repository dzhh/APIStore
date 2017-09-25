/**
 * Created by kwx on 2017/9/22.
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import { connect } from 'react-redux'
import {message,Card,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
import '../../style/base.less'
var SERVICES = [
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商A',r1:'审核',r2:'退回',r3:'同意'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商B',r1:'审核',r2:'退回',r3:'同意'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商C',r1:'审核',r2:'退回',r3:'同意'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商D',r1:'审核',r2:'退回',r3:'同意'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商E',r1:'审核',r2:'退回',r3:'同意'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商F',r1:'审核',r2:'退回',r3:'同意'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商G',r1:'审核',r2:'退回',r3:'同意'},


]

@connect(
    (state, props) => ({
        config: state.config,
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)


export default class service_review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            loading: false,
            data:SERVICES,

        }



    }
    //渲染前
    componentWillMount() {


    }
    componentWillUnmount() {

    }



    render() {

        const columns = [{
            title: '服务名称',
            dataIndex: 'serviceName',

        }, {
            title: '接口地址',
            dataIndex: 'interfaceAddress',
        },{
            title: '服务商',
            dataIndex: 'serviceProvider',
        },{
            title: '审核',
            dataIndex: 'r1',
        },{
            title: '退回',
            dataIndex: 'r2',
        },{
            title: '同意',
            dataIndex: 'r3',
        }
        ];


        return (

            <div  className="pageStyle" >
                <Card title="服务审核"  className="cardStyle">
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
            </div>
        );
    }
}




