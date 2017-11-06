/**
 * Created by kwx on 2017/10/20.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge,Card} from 'antd'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import {parameterList,addParameter,serviceList,deleteParameter} from '../../ajax/service'
import '../../style/base.less'
const FormItem = Form.Item
@connect(
    (state, props) => ({
        config: state.config,
        logout:state.logout
    }),
    (dispatch) => ({ actions: bindActionCreators(routerActions, dispatch), dispatch: dispatch })

)
@Form.create({
    onFieldsChange(props, items) {
    },
})

export default class service_parameter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data:[],
            visible: false,
            staticData: [],
            deleteIds:[],
            serviceList:[]

        }

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onDelete  = this.onDelete .bind(this);

    }
    //组件渲染之前
    componentWillMount() {

        parameterList('', (res) => {
            if (res.state == 200) {
                res.data.parameterList.map((item,index) => {
                    item.key = item.parmId;
                })

                this.setState({data:res.data.parameterList,staticData:res.data.parameterList})
                console.log(res);
            } else {
                message.warning(res.data.msg)
            }
        })
    }

    //组件销毁时
    componentWillUnmount() {


    }
    deleteIds=(ids)=>{
        this.setState({loading: true})
        deleteParameter(ids.toString(), (res) => {
            if (res.state == 200) {
                res.data.parameterList.map((item,index) => {
                    item.key = item.parmId;
                })
                setTimeout(() => {
                    this.setState({
                        data:res.data.parameterList,staticData:res.data.parameterList,
                        selectedRowKeys: [],
                        deleteIds:[],
                        loading: false,
                    });
                }, 1000);
            }else {
                message.warning(res.data.msg)
            }
        })
    }
    //展示弹出框
    showModal = () => {
        serviceList('',(res)=>{
            if(res.state == 200) {
                this.setState({
                    serviceList: res.data.serviceList,
                    visible: true,
                });
            }
        })
    }
    //弹出框点击ok
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if(!err) {
                // console.log("验证成功"+values.roleName+values.systemcode)

                addParameter(values, (res) => {
                    if (res.state == 200) {
                        this.setState({ loading: true });
                        res.data.parameterList.map((item,index) => {
                            item.key = item.aprmId;
                        })
                        setTimeout(() => {
                            this.setState({
                                data:res.data.parameterList,staticData:res.data.parameterList,
                                selectedRowKeys: [],
                                loading: false,
                                visible: false
                            });
                        }, 1000);
                    } else {
                        message.warning(res.data.msg)
                    }
                })

            }
        })


    }
    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false });
    }
    deleteParm  = (index) => {
        let ids=[];
        ids.push(index)
        this.deleteIds(ids)
    }
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要删除的服务参数');
        }else {
            this.deleteIds(this.state.deleteIds)
        }
    }
    //获得输入框的搜索的值
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }
    //选择的table每一行的key值
    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log("每行"+selectedRows)
        let ids = [];
        selectedRows.map((item)=>{
            ids.push(item.parmId)
        })

        this.setState({ selectedRowKeys})

        this.setState({ deleteIds:ids})
        // console.log("value==="+ this.state.deleteIds)
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            data: this.state.staticData.map((record) => {
                const match = record.serviceName.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.serviceName.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }
    render() {

        const columns = [
            {
                title: '服务名称',
                dataIndex: 'serviceName',
                width: '15%',
            },
            {
                title: '参数名',
                dataIndex: 'parmName',
            },
            {

                title: '请求参数类型',
                dataIndex: 'parmRequestType',
            },
            {
                title: '参数类型',
                dataIndex: 'parmType',
            },
            {
                title: '是否必须',
                dataIndex: 'parmIsrequired',
                render: (text, record, index) => {
                    return (text > 0? ("否"):("是"));
                }
            },
            {
                title: '参数位置',
                dataIndex: 'parmPosition',
            },
            {
                title: '参数描述',
                dataIndex: 'parmDescrible',
                width: '20%',
            },
            {
                title: '参数默认值',
                dataIndex: 'parmDefault',
                width: '15%',
            },

            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = "删除"+record.parmName
                    return (
                        this.state.data.length > 0 ?
                            (
                                ( <Popconfirm title={title_action} onConfirm={() => this.deleteParm(record.parmId)}>
                                        <a href="#">删除</a>
                                  </Popconfirm>
                                )
                            ) : null
                    );
                },
            }
        ];


        const {loading,selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const { getFieldDecorator } = this.props.form
        return (
            <div  className="pageStyle" >
                <Card title="错误码" className="cardStyle">
                    <div className="custom-filter-dropdown">
                        <Input
                            placeholder="输入服务名称"
                            value={this.state.searchText}
                            onChange={this.onInputChange}
                            onPressEnter={this.onSearch}
                            style={{width: '20%',
                                marginRight: '8px'}}
                        />
                        <Button type="primary" onClick={this.onSearch} >搜索</Button>
                        {/*---------------*/}
                        <Button type="primary" onClick={this.showModal} style={{marginLeft:"10px"}}>
                            添加
                        </Button>
                        <Button type="danger" onClick={this.onDelete}
                                loading={loading}
                                style={{marginLeft:"10px",backgroundColor:'#EE0000',color:'white'}}
                        >
                            删除</Button>
                        {/******************/}
                        <Modal
                            visible={this.state.visible}
                            title="参数添加"
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                                <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                                    添加
                                </Button>,
                            ]}
                        >
                            <Form layout="vertical">
                                <FormItem label="服务名称">
                                    {getFieldDecorator('serviceId', {
                                        rules: [{ required: true, message: '请选择服务名称!' }],
                                    })(
                                        <Select  showSearch  placeholder="请选择或输入服务名称">
                                            {
                                                this.state.serviceList.map((item, index) => {
                                                    return <Option value={item.serviceId}>{item.serviceName}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="参数名">
                                    {getFieldDecorator('parmName', {
                                        rules: [{ required: true, message: '请输入参数名!' }],
                                    })(
                                        <Input placeholder="请输入参数名!"/>
                                    )}
                                </FormItem>
                                <FormItem label="请求参数类型">
                                    {getFieldDecorator('parmRequestType', {
                                        rules: [{ required: true, message: '请输入请求参数类型!' }],
                                    })(
                                        <Input placeholder="请输入请求参数类型!"/>
                                    )}
                                </FormItem>
                                <FormItem label="参数类型">
                                    {getFieldDecorator('parmType', {
                                        rules: [{ required: true, message: '请输入参数类型!' }],
                                    })(
                                        <Input placeholder="请输入参数类型!"/>
                                    )}
                                </FormItem>
                                <FormItem label="是否必须">
                                    {getFieldDecorator('parmIsrequired', {
                                        initialValue:'0'
                                    })(
                                        <Select>
                                              <Option value='0'>是</Option>
                                              <Option value='1'>否</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="参数位置">
                                    {getFieldDecorator('parmPosition', {
                                        rules: [{ required: true, message: '请输入参数位置!' }],
                                    })(
                                        <Input placeholder="请输入参数位置!"/>
                                    )}
                                </FormItem>
                                <FormItem label="参数描述">
                                    {getFieldDecorator('parmDescrible', {
                                        rules: [{ required: true, message: '请输入参数描述!' }],
                                    })(
                                        <Input placeholder="请输入参数描述!"/>
                                    )}
                                </FormItem>
                                <FormItem label="参数默认值">
                                    {getFieldDecorator('parmDefault', {
                                        rules: [{ required: true, message: '请输入参数默认值!' }],
                                    })(
                                        <Input placeholder="请输入参数默认值!"/>
                                    )}
                                </FormItem>
                            </Form>
                        </Modal>
                        {/*---------------*/}
                    </div>

                    <div>
                        <Table  bordered rowSelection={rowSelection} columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />

                    </div> </Card></div>
        );
    }
}




