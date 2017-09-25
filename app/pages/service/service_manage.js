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
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商A',status:'0'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商B',status:'2'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商C',status:'2'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商D',status:'1'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商E',status:'2'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商F',status:'3'},
    {serviceName:'IP地址',interfaceAddress:'www.baidu.com',serviceProvider:'服务商G',status:'3'},


]
var STATUS=[
    {id:'0',value:'下架'},
    {id:'1',value:'上架'},
    {id:'2',value:'停止'},
    {id:'3',value:'启动'},


]
const FormItem = Form.Item
const Option = Select.Option;
@connect(
    (state, props) => ({
        config: state.config,
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)


export default class service_manage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            loading: false,
            data:SERVICES,
            status:STATUS

        }



    }
    //渲染前
    componentWillMount() {


    }
    componentWillUnmount() {

    }
    handleChange(record,value) {
        console.log(value+"改变的为"+record)
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
            title: '服务状态',
            dataIndex: 'status',
            render: (text, record, index) => {
                switch (text) {
                    case '0':return '下架';break;
                    case '1':return '上架';break;
                    case '2':return '停止';break;
                    case '3':return '启动';break;

                }
            }
        },

            {
                title: '服务操作',
                dataIndex: 'operation',
                width: '20%',
                render: (text, record, index) => {

                    return (
                        this.state.data.length > 0 ?
                            (
                                <div>
                                    <Select size="large" defaultValue={record.status}  style={{ width: '80%' }} onChange={this.handleChange.bind(null, record)}>
                                        {
                                            this.state.status.map((item)=>{
                                                return <Option value={item.id}>{item.value}</Option>
                                             })
                                        }
                                    </Select>
                                   </div>

                            ) : null
                    );
                },
            }
        ];


        return (

            <div  className="pageStyle" >
                <Card title="服务管理"  className="cardStyle">
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
            </div>
        );
    }
}




