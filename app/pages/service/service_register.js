/**
 * Created by kwx on 2017/9/22.
 */


import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import {Card,Checkbox,Select, Spin, message, Form, Icon, Input, Button, Row, Col } from 'antd'
import '../../style/base.less'
import {serviceRegister} from '../../ajax/service'
const FormItem = Form.Item
const Option = Select.Option;
let id_header = 0;
let id_url = 0;
let id_ecode = 0;
//连接 Redux 的组件 不可复用
@connect(
    (state, props) => ({
        config: state.config,
        loginResponse: state.loginResponse,
    })
)
//测试为 在每输入一个字符时调用
@Form.create({
    onFieldsChange(props, items) {
        // console.log(items)
        // props.cacheSearch(items);
    },
})

export default class service_register extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            confirmDirty: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)

    }
    handleReset = () => {
        this.props.form.resetFields();
    }

    handleSubmit(e) {

        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {
                console.log('Received values of form: ', values);
                let parms = [];
                let num = 0
                values.header_keys.map( (item,index) => {
                    parms[num] = {}
                    parms[num].parmName = values['header_name_'+item];
                    parms[num].parmType =values['header_type_'+item];
                    parms[num].parmPosition = values['header_position_'+item];
                    parms[num].parmDescrible = values['header_desc_'+item];
                    parms[num].parmDefault =  values['header_default_'+item];
                    parms[num].parmIsrequired =  values['header_isRequired_'+item];
                    parms[num++].parmRequestType =  'header';
                })

                values.url_keys.map( (item,index) => {
                    parms[num] = {}
                    parms[num].parmName = values['url_name_'+item];
                    parms[num].parmType =values['url_type_'+item];
                    parms[num].parmPosition = values['url_position_'+item];
                    parms[num].parmDescrible = values['url_desc_'+item];
                    parms[num].parmDefault =  values['url_default_'+item];
                    parms[num].parmIsrequired =  values['url_isRequired_'+item];
                    parms[num++].parmRequestType =  'url';
                })
                let ecodes= [];
                let ec_num = 0
                values.ecode_keys.map( (item,index) => {
                    ecodes[ec_num] = {}
                    ecodes[ec_num].ecCode = values['ecode_code_'+item];
                    ecodes[ec_num].ecType =values['ecode_type_'+item];
                    ecodes[ec_num].ecReturn = values['ecode_return_'+item];
                    ecodes[ec_num++].ecReturnExplain = values['ecode_return_desc_'+item];
                })
                let service = {};
                service.serviceName = values.service_name;
                service.serviceProvider = values.service_provider;
                service.serviceIntroduce = values.service_introduce;
                service.serviceRequestMethod = values.service_request_method;
                service.serviceInterfaceAddress = values.service_interface_address;
                let request_data = {};
                request_data.asService = service
                request_data.asParameter = parms
                request_data.asEcode = ecodes

                console.log('数据', request_data);

                serviceRegister(request_data, (res) => {
                    if (res.state == 200) {
                        message.success("注册成功", 2, ()=>{ this.props.form.resetFields();})

                    } else  {
                        message.error(res.data.msg)
                    }
                })
            }
        });
    }
//header 动态添加
    header_remove = (k) => {
        const { form } = this.props;
        const header_keys = form.getFieldValue('header_keys');
        if (header_keys.length === 0) {
            return;
        }

        form.setFieldsValue({
            header_keys: header_keys.filter(key => key !== k),
        });
    }

    header_add = () => {
        id_header++;
        const { form } = this.props;
        const header_keys = form.getFieldValue('header_keys');
        const nextKeys = header_keys.concat(id_header);
        form.setFieldsValue({
            header_keys: nextKeys,
        });
    }

//url  动态添加
    url_remove = (k) => {
        const { form } = this.props;
        const url_keys = form.getFieldValue('url_keys');
        if (url_keys.length === 0) {
            return;
        }

        form.setFieldsValue({
            url_keys: url_keys.filter(key => key !== k),
        });
    }

    url_add = () => {
        id_url++;
        const { form } = this.props;
        const url_keys = form.getFieldValue('url_keys');
        const nextKeys = url_keys.concat(id_url);
        form.setFieldsValue({
            url_keys: nextKeys,
        });
    }
    //错误码  动态添加
    ecode_remove = (k) => {
        const { form } = this.props;
        const ecode_keys = form.getFieldValue('ecode_keys');
        if (ecode_keys.length === 0) {
            return;
        }

        form.setFieldsValue({
            ecode_keys: ecode_keys.filter(key => key !== k),
        });
    }

    ecode_add = () => {
        id_ecode++;
        const { form } = this.props;
        const ecode_keys = form.getFieldValue('ecode_keys');
        const nextKeys = ecode_keys.concat(id_ecode);
        form.setFieldsValue({
            ecode_keys: nextKeys,
        });
    }
    render() {

        const { getFieldDecorator } = this.props.form;
        const { getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        // header 参数 动态添加

        getFieldDecorator('header_keys', { initialValue: [] });
        const header_keys = getFieldValue('header_keys');
        const formItems_header = header_keys.map( (k, index) => {
            return (
                <div>
                    <FormItem
                        {...( formItemLayout)}
                        label='参数名'
                    >
                        {getFieldDecorator(`header_name_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "参数名不能为空",
                            }],
                        })(
                            <Input style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...( formItemLayout)}
                        label= '类型'

                    >
                        {getFieldDecorator(`header_type_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "类型不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}

                    </FormItem>
                    <FormItem
                        {...( formItemLayout)}
                        label= '是否必需'

                    >
                        {getFieldDecorator(`header_isRequired_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue:'0',
                            rules: [{
                                required: true,
                                whitespace: true,
                            }],
                        })(
                            <Select
                                style={{ width: '80%' }}
                            >
                                <Option value="0">是</Option>
                                <Option value="1">否</Option>
                            </Select>

                        )}

                    </FormItem>
                    <FormItem
                        {...(formItemLayout)}
                        label= '参数位置'

                    >
                        {getFieldDecorator(`header_position_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "参数位置不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...(formItemLayout)}
                        label= '参数默认值'

                    >
                        {getFieldDecorator(`header_default_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "参数默认值不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </FormItem>

                    <FormItem
                        {...(formItemLayout)}
                        label='描述'

                    >
                        {getFieldDecorator(`header_desc_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "描述不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"

                            onClick={() => this.header_remove(k)}
                        />
                    </FormItem>
                </div>
            );
        });

        // url 参数 动态添加

        getFieldDecorator('url_keys', { initialValue: [] });
        const url_keys = getFieldValue('url_keys');
        const formItems_url = url_keys.map( (k, index) => {
            return (
                <div>
                    <FormItem
                        {...( formItemLayout)}
                        label='参数名'
                    >
                        {getFieldDecorator(`url_name_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "参数名不能为空",
                            }],
                        })(
                            <Input style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...( formItemLayout)}
                        label= '类型'

                    >
                        {getFieldDecorator(`url_type_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "类型不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}

                    </FormItem>
                    <FormItem
                        {...( formItemLayout)}
                        label= '是否必需'

                    >
                        {getFieldDecorator(`url_isRequired_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue:'0',
                            rules: [{
                                required: true,
                                whitespace: true,
                            }],
                        })(
                            <Select
                                style={{ width: '80%' }}
                            >
                                <Option value="0">是</Option>
                                <Option value="1">否</Option>
                            </Select>

                        )}

                    </FormItem>
                    <FormItem
                        {...(formItemLayout)}
                        label= '参数位置'

                    >
                        {getFieldDecorator(`url_position_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "参数位置不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...(formItemLayout)}
                        label= '参数默认值'

                    >
                        {getFieldDecorator(`url_default_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "参数默认值不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </FormItem>

                    <FormItem
                        {...(formItemLayout)}
                        label='描述'

                    >
                        {getFieldDecorator(`url_desc_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "描述不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"

                            onClick={() => this.url_remove(k)}
                        />
                    </FormItem>
                </div>
            );
        });
        // 错误码 动态添加

        getFieldDecorator('ecode_keys', { initialValue: [] });
        const ecode_keys = getFieldValue('ecode_keys');
        const formItems_ecode = ecode_keys.map( (k, index) => {
            return (
                <div>
                    <FormItem
                        {...( formItemLayout)}
                        label='错误码'
                    >
                        {getFieldDecorator(`ecode_code_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "错误码不能为空",
                            }],
                        })(
                            <Input style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...( formItemLayout)}
                        label= '错误码类型'

                    >
                        {getFieldDecorator(`ecode_type_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "错误码类型不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}

                    </FormItem>

                    <FormItem
                        {...(formItemLayout)}
                        label= '错误码返回'

                    >
                        {getFieldDecorator(`ecode_return_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "错误码返回不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...(formItemLayout)}
                        label= '错误码返回说明'

                    >
                        {getFieldDecorator(`ecode_return_desc_${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "错误码返回说明不能为空",
                            }],
                        })(
                            <Input  style={{ width: '80%', marginRight: 8 }} />
                        )}
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"

                            onClick={() => this.ecode_remove(k)}
                        />
                    </FormItem>


                </div>
            );
        });
        return (
            <div  className="pageStyle" >
                <Card title="服务注册" bordered={false} className="cardStyle">
                    <Form onSubmit={this.handleSubmit} style={{marginLeft:'18%',width:'60%'}}>
                        <FormItem
                            {...formItemLayout}
                            label="服务名称"
                            hasFeedback
                        >
                            {getFieldDecorator('service_name', {
                                rules: [
                                    {
                                        required: true, message: '请输入服务名称!'
                                    },
                                    // { pattern: "[A-Za-z0-9]{5,8}", message: '接口地址只能为5-8位字符或数字' }
                                ],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="服务商"
                            hasFeedback
                        >
                            {getFieldDecorator('service_provider', {
                                rules: [
                                    {
                                        required: true, message: '请输入服务商!'
                                    },
                                    // { pattern: "[A-Za-z0-9]{5,8}", message: '接口地址只能为5-8位字符或数字' }
                                ],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="接口地址"
                            hasFeedback
                        >
                            {getFieldDecorator('service_interface_address', {
                                rules: [
                                    {
                                        required: true, message: '请输入接口地址!'
                                    },
                                    // { pattern: "[A-Za-z0-9]{5,8}", message: '接口地址只能为5-8位字符或数字' }
                                ],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="请求方法"
                            hasFeedback
                        >
                            {getFieldDecorator('service_request_method', {
                                rules: [{
                                    required: true, message: '请输入请求方法!',
                                },
                                ],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="服务介绍"
                            hasFeedback
                        >
                            {getFieldDecorator('service_introduce', {
                                rules: [{
                                    required: true, message: '请输入服务介绍!',
                                },
                                ],
                            })(
                                <Input  type="textarea"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="请求参数（header）:"
                        >
                            {/*<span className="ant-form-text">China</span>*/}
                        </FormItem>
                        {formItems_header}
                        <FormItem {...tailFormItemLayout}>
                            <Button type="dashed" onClick={this.header_add} style={{textAlign:'CENTER', width: '80%' }}>
                                <Icon type="plus" /> 添加
                            </Button>
                        </FormItem>



                        <FormItem
                            {...formItemLayout}
                            label="请求参数(urlParam)"

                        > </FormItem>
                            {formItems_url}
                            <FormItem {...tailFormItemLayout}>
                                <Button type="dashed" onClick={this.url_add} style={{textAlign:'CENTER', width: '80%' }}>
                                    <Icon type="plus" /> 添加
                                </Button>
                            </FormItem>

                            <FormItem
                            {...formItemLayout}
                            label="错误码参照"
                            >
                            </FormItem>
                        {formItems_ecode}
                        <FormItem {...tailFormItemLayout}>
                            <Button type="dashed" onClick={this.ecode_add} style={{textAlign:'CENTER', width: '80%' }}>
                                <Icon type="plus" /> 添加
                            </Button>
                        </FormItem>

                            <FormItem {...tailFormItemLayout}>
                                <Button style={{ marginRight: 8 }} onClick={this.handleReset}>
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit" size="large">注册</Button>

                            </FormItem>
                    </Form>
                </Card>
            </div>

      )

    }
    }
