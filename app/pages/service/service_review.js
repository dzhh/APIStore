/**
 * Created by kwx on 2017/9/22.
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import { connect } from 'react-redux'
import {todoList,dealTodoTask} from '../../ajax/service'
import {message,Card,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge} from 'antd'
import '../../style/base.less'
var SERVICES = [
    {serviceName:'IP地址',submitUserName:'qwe',submitTime:'2017-12-17 11:00:31'},
    {serviceName:'IP地址',submitUserName:'kong',submitTime:'2017-10-17 11:23:00'},
    {serviceName:'IP地址',submitUserName:'wei',submitTime:'2017-10-17 00:00:00'},
    {serviceName:'IP地址',submitUserName:'xuan',submitTime:'2017-10-17 00:23:31'},
    {serviceName:'IP地址',submitUserName:'孔维轩',submitTime:'2017-10-17 11:00:31'},
    {serviceName:'IP地址',submitUserName:'admin',submitTime:'2017-10-17 00:00:31'},
    {serviceName:'IP地址',submitUserName:'admin',submitTime:'2017-10-17 00:23:31'},


]

@connect(
    (state, props) => ({
        config: state.config,
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })
)

@Form.create({
    onFieldsChange(props, items) {
    },
})
export default class service_review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            loading: false,
            data:[]
        }

    }
    agreeRe = (record) => {
        var todoTask={};
        todoTask.id = record.id;
        todoTask.processId = record.processId
        todoTask.userId = sessionStorage.getItem('userId')
        dealTodoTask(todoTask,(res)=>{
            if (res.state == 200) {
                this.setState({data:res.data.todoList})
                console.log(res);
            } else {
                message.warning('未知错误')
            }
        })
        console.log(record);
    }
    //渲染前
    componentWillMount() {
        todoList(sessionStorage.getItem('userId'),(res)=>{
            if (res.state == 200) {
                this.setState({data:res.data.todoList})
                console.log(res);
            } else {
                message.warning('未知错误')
            }
        })

    }
    componentWillUnmount() {

    }


    render() {

        const columns = [{
            title: '服务名称',
            dataIndex: 'serviceName',

        }, {
            title: '提交人',
            dataIndex: 'userName',
        },{
            title: '提交时间',
            dataIndex: 'submitTime',
            render(text,record, index){
              //  var s = new Date(text.time);

               // alert((new Date(text.year,text.month,text.date,text.hours,text.minutes,text.seconds,text.seconds)).format("yyyy-mm-dd hh:mm:ss"))
              return (text.year+1900)+'-'+(text.month+1)+'-'+text.date+':'+text.hours+':'
                  +text.minutes+' '+text.seconds
                  ;
            }
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text,record, index)=>{
                return (
                    this.state.data.length > 0 ?
                        ( <a onClick={()=>this.agreeRe(record)}>同意</a>
                    ): null
                )

            }

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




