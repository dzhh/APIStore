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
    {serviceName:'IP地址',useTimes:'1234',successRate:'100%',meanResponseTime:'66ms'},
    {serviceName:'快递查询',useTimes:'3432423',successRate:'0%',meanResponseTime:'990ms'},
    {serviceName:'违章查询',useTimes:'423423',successRate:'120%',meanResponseTime:'0ms'},
    {serviceName:'IP地址',useTimes:'6546',successRate:'34%',meanResponseTime:'23410ms'},
    {serviceName:'IP地址',useTimes:'23',successRate:'77%',meanResponseTime:'41ms'},
    {serviceName:'IP地址',useTimes:'0',successRate:'1%',meanResponseTime:'520ms'},
    {serviceName:'IP地址',useTimes:'2345',successRate:'9%',meanResponseTime:'10ms'},


]

@connect(
    (state, props) => ({
        config: state.config,
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)


export default class service_quality extends Component {
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
            title: '调用次数',
            dataIndex: 'useTimes',
        },{
            title: '成功率',
            dataIndex: 'successRate',
        },{
            title: '平均响应时间',
            dataIndex: 'meanResponseTime',
        }
        ];


        return (

            <div className="pageStyle" >
                <Card  title="服务质量"  className="cardStyle">
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
            </div>
        );
    }
}




