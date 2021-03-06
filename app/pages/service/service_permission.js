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
import {servicePackageList,savePackage,serviceList,deletePackage} from '../../ajax/service'
const FormItem = Form.Item
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


export default class service_permission extends Component {
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

    }
    //渲染前
    componentWillMount() {
        servicePackageList('',(res)=>{
            if (res.state == 200) {
                res.data.packageList.map((item,index) => {
                    item.key = item.packageId;
                })
                this.setState({data:res.data.packageList,staticData:res.data.packageList})
                console.log(res);
            } else {
                message.warning(res.data.msg)
            }
        })

    }
    componentWillUnmount() {

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

                let packages={}
                packages.packageName = values.packageName
                packages.packagePermission = values.packagePermission
                packages.packagePrice = values.packagePrice
                packages.packagePeakvalue = values.packagePeakValue
                packages.serviceId = values.service_id
                savePackage(packages, (res) => {
                    if (res.state == 200) {
                        this.setState({ loading: true });
                        res.data.packageList.map((item,index) => {
                            item.key = item.packageId;
                        })
                        setTimeout(() => {
                            this.setState({
                                data:res.data.packageList,staticData:res.data.packageList,
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
    deletePackage  = (index) => {
        let ids=[];
        ids.push(index)
        this.deleteIds(ids)
    }
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要删除的套餐名称');
        }else {
            this.deleteIds(this.state.deleteIds)
        }
    }
    //删除
    deleteIds=(ids)=>{
        console.log('删除id'+ids);
        this.setState({loading: true})
        deletePackage(ids.toString(), (res) => {
            if (res.state == 200) {
                res.data.packageList.map((item,index) => {
                    item.key = item.packageId;
                })
                setTimeout(() => {
                    this.setState({
                        data:res.data.packageList,staticData:res.data.packageList,
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
            ids.push(item.packageId)
        })

        this.setState({ selectedRowKeys})

        this.setState({ deleteIds:ids})
        console.log("value==="+ this.state.deleteIds)
    }
    //查询
    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            data: this.state.staticData.map((record) => {
                const match = record.packageName.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.packageName.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }

    render() {

        const columns = [{
            title: '服务名称',
            dataIndex: 'serviceName',

        }, {
            title: '套餐名称',
            dataIndex: 'packageName',
        },{
            title: '套餐权限	',
            dataIndex: 'packagePermission',
        },{
            title: '套餐价格',
            dataIndex: 'packagePrice',
        },{
            title: '套餐峰值',
            dataIndex: 'packagePeakvalue',
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                let title_action = "删除"+record.packageName
                return (
                    this.state.data.length > 0 ?
                        (
                            ( <Popconfirm title={title_action} onConfirm={() => this.deletePackage(record.packageId)}>
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
                <Card title="服务套餐"  className="cardStyle">
                    <div className="custom-filter-dropdown">
                        <Input
                            placeholder="输入套餐名称"
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
                                <FormItem label="套餐名称">
                                    {getFieldDecorator('packageName', {
                                        rules: [{ required: true, message: '请输入套餐名称!' }],
                                    })(
                                        <Input placeholder="请输入套餐名称!"/>
                                    )}
                                </FormItem>
                                <FormItem label="套餐权限">
                                    {getFieldDecorator('packagePermission', {
                                        rules: [{ required: true, message: '请输入套餐权限!' }],
                                    })(
                                        <Input placeholder="请输入分类权限!"/>
                                    )}
                                </FormItem>
                                <FormItem label="套餐价格">
                                    {getFieldDecorator('packagePrice', {
                                        rules: [{ required: true, message: '请输入套餐价格!' }],
                                    })(
                                        <Input placeholder="请输入分类价格!"/>
                                    )}
                                </FormItem>
                                <FormItem label="套餐峰值">
                                    {getFieldDecorator('packagePeakValue', {
                                        rules: [{ required: true, message: '请输入套餐峰值!' }],
                                    })(
                                        <Input placeholder="请输入分类峰值!"/>
                                    )}
                                </FormItem>
                                <FormItem label="服务名称">
                                    {getFieldDecorator('service_id', {
                                        rules: [{ required: true, message: '请选择服务!' }],
                                    })(
                                        <Select  placeholder="请选择服务">
                                            {
                                                this.state.serviceList.map((item, index) => {
                                                    return <Option value={item.serviceId}>{item.serviceName}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>

                            </Form>
                        </Modal>
                        {/*---------------*/}
                    </div>
                    <Table  bordered rowSelection={rowSelection}  columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
            </div>
        );
    }
}




