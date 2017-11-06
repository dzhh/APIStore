/**
 * Created by kwx on 2017/10/19.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge,Card} from 'antd'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import {errorCodeList,serviceList,addErrorCode,deleteErrorCode} from '../../ajax/service'
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

export default class service_ecode extends Component {
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

        errorCodeList('', (res) => {
            if (res.state == 200) {
                res.data.ecodeList.map((item,index) => {
                    item.key = item.ecId;
                })

                this.setState({data:res.data.ecodeList,staticData:res.data.ecodeList})
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
        deleteErrorCode(ids.toString(), (res) => {
            if (res.state == 200) {
                res.data.ecodeList.map((item,index) => {
                    item.key = item.ecId;
                })
                setTimeout(() => {
                    this.setState({
                        data:res.data.ecodeList,staticData:res.data.ecodeList,
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
                let ecode={};
                ecode.ecCode = values.eCode
                ecode.ecType = values.ecType
                ecode.ecReturn = values.ecReturn
                ecode.ecReturnExplain = values.ecReturnExplain
                ecode.serviceId = values.serviceId
                addErrorCode(ecode, (res) => {
                    if (res.state == 200) {
                        this.setState({ loading: true });
                        res.data.ecodeList.map((item,index) => {
                            item.key = item.ecId;
                        })
                        setTimeout(() => {
                            this.setState({
                                data:res.data.ecodeList,staticData:res.data.ecodeList,
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
    deleteEcode  = (index) => {
        let ids=[];
        ids.push(index)
        this.deleteIds(ids)
    }
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要删除的错误码');
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
            ids.push(item.ecId)
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
            },
            {

            title: '错误码',
            dataIndex: 'ecCode',
            },
            {
                title: '错误码类型',
                dataIndex: 'ecType',
            },
            {
                title: '错误码返回',
                dataIndex: 'ecReturn',
            },
            {
                title: '错误码返回说明',
                dataIndex: 'ecReturnExplain',
            },

            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = "删除"+record.ecCode
                    return (
                        this.state.data.length > 0 ?
                            (
                                ( <Popconfirm title={title_action} onConfirm={() => this.deleteEcode(record.ecId)}>
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
                            title="分类添加"
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

                                <FormItem label="错误码">
                                    {getFieldDecorator('eCode', {
                                        rules: [{ required: true, message: '请输入错误码!' }],
                                    })(
                                        <Input placeholder="请输入错误码!"/>
                                    )}
                                </FormItem>
                                <FormItem label="错误码类型">
                                    {getFieldDecorator('ecType', {
                                        rules: [{ required: true, message: '请输入错误码类型!' }],
                                    })(
                                        <Input placeholder="请输入错误码类型!"/>
                                    )}
                                </FormItem>
                                <FormItem label="错误码返回">
                                    {getFieldDecorator('ecReturn', {
                                        rules: [{ required: true, message: '请输入错误码返回!' }],
                                    })(
                                        <Input placeholder="请输入错误码返回!"/>
                                    )}
                                </FormItem>
                                <FormItem label="错误码返回说明">
                                    {getFieldDecorator('ecReturnExplain', {
                                        rules: [{ required: true, message: '请输入错误码返回说明!' }],
                                    })(
                                        <Input placeholder="请输入错误码返回说明!"/>
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




