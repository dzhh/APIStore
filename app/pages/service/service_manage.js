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
import {serviceList,updateServiceStatus,serviceTypeByServiceId,saveServiceType} from '../../ajax/service'
const CheckboxGroup = Checkbox.Group;
var STATUS=[
    {id:0,value:'下架'},
    {id:1,value:'上架'},
    {id:2,value:'停止'},
    {id:3,value:'启动'},


]
// const options = [
//     { label: 'Apple', value: 1 },
//     { label: 'Pear', value: 2 },
//     { label: 'Orange', value: 3 },
//     { label: 'bug', value: 4 },
//     { label: 'banana', value: 5 },
// ];
// const plainOptions = [
//    1,2,3,4,5
// ];

const FormItem = Form.Item
const Option = Select.Option;
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
export default class service_manage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true,
            loading: false,
            data:[],
            staticData: [],
            status:STATUS,
            visible: false,
            checkedList: [],
            indeterminate: true,
            checkAll: false,
            options:[],
            plainOptions:[],
            selectId:''


        }



    }
    //渲染前
    componentWillMount() {
        serviceList('', (res) => {

            if (res.state == 200) {
                this.setState({data: res.data.serviceList,staticData: res.data.serviceList})
            }else {
                message.warning(res.data.msg)
            }
        })

    }
    componentWillUnmount() {

    }
    handleChange(record,value) {

        let service = {};
        service.serviceStatus = value;
        service.serviceId = record.serviceId;
        updateServiceStatus(service, (res) => {

            if (res.state == 200) {
                this.setState({data: res.data.serviceList,staticData: res.data.serviceList})
            }else {
                message.warning(res.msg)
            }
        })

    }
    //展示弹出框
    showModal = (record) => {
        let service={}
        service.serviceId = record.serviceId
        serviceTypeByServiceId(service, (res) => {

            if (res.state == 200) {
                let tempType = []
                options:res.data.allTypes.map((item,index)=>{
                    tempType.push(item.value);
                })
                this.setState({checkedList:res.data.checkValue,options:res.data.allTypes
                ,plainOptions:tempType,selectId:record.serviceId,visible:true

                })

            } else {
                message.warning(res.data.msg)
            }
        })

    }
    onSelectChange = (selectedRowKeys,selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        console.log("每行"+selectedRows)
        let ids = [];
        selectedRows.map((item)=>{
            ids.push(item.userId)
        })
        this.setState({ selectedRowKeys})

        this.setState({ deleteIds:ids})

    }
    checkOnChange = (checkedList) => {
        console.log('每次改变的值 ', checkedList);
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
            checkAll: checkedList.length === this.state.plainOptions.length,
        });
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.state.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }
    //弹出框点击ok
    handleOk = () => {
        console.log(this.state.selectId+"选中的角色id为"+this.state.checkedList);
         let serviceType={}
        serviceType.serviceId = this.state.selectId;
        serviceType.typeIds = this.state.checkedList
        saveServiceType(serviceType, (res) => {
            if (res.state == 200) {
                this.setState({ visible: false,  checkedList: []});
            } else {
                message.warning(res.data.msg)
            }

        })
    }
    //弹出框点击离开
    handleCancel = () => {
        this.setState({ visible: false,  checkedList: [],
            });
    }
    //获得输入框的搜索的值
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
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

        const columns = [{
            title: '服务名称',
            dataIndex: 'serviceName',

        }, {
            title: '接口地址',
            dataIndex: 'serviceInterfaceAddress',
        },{
            title: '服务商',
            dataIndex: 'serviceProvider',
        },{
            title: '分类',
            dataIndex: 'addtype',
            render: (text, record, index) => {
                return (
                    this.state.data.length > 0 ?
                        (
                            <a onClick={() => this.showModal(record)}>添加</a>
                        )
                        : null
                );
            },
        }
        ,{
            title: '服务状态',
            dataIndex: 'serviceStatus',
            render: (text, record, index) => {
                switch (text) {
                    case 0:return '下架';break;
                    case 1:return '上架';break;
                    case 2:return '停止';break;
                    case 3:return '启动';break;

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
                                    <Select size="large" defaultValue={record.serviceStatus}  style={{ width: '80%' }} onChange={this.handleChange.bind(this, record)}>
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
                {/******************/}
                <Modal style={{width:'60%'}}
                       visible={this.state.visible}
                       title="添加分类"
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                       footer={[
                           <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                           <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                               添加
                           </Button>,
                       ]}
                >
                    <Form layout="vertical" >
                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >
                                全选
                            </Checkbox>
                        </div>
                        <br/>
                        <div style={{width:'25%'}}>
                            <CheckboxGroup    options={this.state.options} value={this.state.checkedList} onChange={this.checkOnChange} />
                        </div>
                    </Form>
                </Modal>
                {/*---------------*/}
                <Card title="服务管理"  className="cardStyle">
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
                    </div>
                    <Table  bordered columns={columns} dataSource={this.state.data} pagination={{ pageSize: 8 }} />
                </Card>
            </div>
        );
    }
}




