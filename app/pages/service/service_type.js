/**
 * Created by kwx on 2017/10/18.
 */


import React, { Component } from 'react'
import { connect } from 'react-redux'
import {message,Popconfirm ,Modal, Form, Dropdown,Input,Menu, Tooltip,DatePicker, Icon, Cascader, Select, Row, Col, Checkbox, Button,Table ,Badge,Card} from 'antd'
import { bindActionCreators } from 'redux'
import { hashHistory } from 'react-router'
import { routerActions } from 'react-router-redux'
import {serviceTypeList,deleteTypes,addType} from '../../ajax/service'
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

export default class service_type extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            show: true,
            loading: false,
            data:[],
            visible: false,
            staticData: [],
            deleteIds:[]

        }

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onDelete  = this.onDelete .bind(this);

    }
    //组件渲染之前
    componentWillMount() {

        serviceTypeList('', (res) => {
            if (res.state == 200) {
                res.data.typeList.map((item,index) => {
                    item.key = item.value;
                })

                this.setState({data:res.data.typeList,staticData:res.data.typeList})
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
        deleteTypes(ids.toString(), (res) => {
            if (res.state == 200) {
                res.data.typeList.map((item,index) => {
                    item.key = item.value;
                })
                setTimeout(() => {
                    this.setState({
                        data:res.data.typeList,staticData:res.data.typeList,
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
        this.setState({
            visible: true,
        });
    }
    //弹出框点击ok
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if(!err) {
                // console.log("验证成功"+values.roleName+values.systemcode)
                 let type={};
                 type.typeName = values.typeName
                addType(type, (res) => {
                    if (res.state == 200) {
                        this.setState({ loading: true });
                        res.data.typeList.map((item,index) => {
                            item.key = item.value;
                        })
                        setTimeout(() => {
                            this.setState({
                                data:res.data.typeList,staticData:res.data.typeList,
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
    deleteType  = (index) => {
        let ids=[];
        ids.push(index)
        this.deleteIds(ids)
    }
    onDelete  = () => {
        if(this.state.selectedRowKeys == '') {
            message.error('请选择要删除的分类名称');
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
            ids.push(item.value)
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
                const match = record.label.match(reg);

                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    name: (
                        <span>
              {record.label.split(reg).map((text, i) => (
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
            title: '服务分类',
            dataIndex: 'label',
        },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    let title_action = "删除"+record.label
                    return (
                        this.state.data.length > 0 ?
                            (
                                ( <Popconfirm title={title_action} onConfirm={() => this.deleteType(record.value)}>
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
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div  className="pageStyle" >
                <Card title="服务分类" className="cardStyle">
                    <div className="custom-filter-dropdown">
                        <Input
                            placeholder="输入分类名称"
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
                                <FormItem label="分类名称">
                                    {getFieldDecorator('typeName', {
                                        rules: [{ required: true, message: '请输入分类名称!' }],
                                    })(
                                        <Input placeholder="请输入分类名称!"/>
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




