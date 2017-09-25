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
    {serviceName:'IP地址',user:'用户a',servicePackage:'套餐一',serviceRemainingTiems:'1234',peakValue:'66秒/次'},
    {serviceName:'IP地址',user:'用户b',servicePackage:'套餐三',serviceRemainingTiems:'2222',peakValue:'990秒/次'},
    {serviceName:'IP地址',user:'用户c',servicePackage:'套餐五',serviceRemainingTiems:'22',peakValue:'0秒/次'},
    {serviceName:'IP地址',user:'用户d',servicePackage:'套餐二',serviceRemainingTiems:'10000',peakValue:'23410秒/次'},
    {serviceName:'IP地址',user:'用户e',servicePackage:'套餐一',serviceRemainingTiems:'6666',peakValue:'41秒/次'},
    {serviceName:'IP地址',user:'用户f',servicePackage:'套餐八',serviceRemainingTiems:'0',peakValue:'520秒/次'},
    {serviceName:'IP地址',user:'用户g',servicePackage:'套餐一',serviceRemainingTiems:'123',peakValue:'10秒/次'},


]

@connect(
    (state, props) => ({
        config: state.config,
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)


export default class service_permission extends Component {
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
            title: '用户',
            dataIndex: 'user',
        },{
            title: '服务套餐',
            dataIndex: 'servicePackage',
        },{
            title: '服务剩余次数',
            dataIndex: 'serviceRemainingTiems',
        },{
            title: '峰值',
            dataIndex: 'peakValue',
        }
        ];


        return (

            <div  className="pageStyle" >
                <Card title="服务权限"  className="cardStyle">
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
            </div>
        );
    }
}




