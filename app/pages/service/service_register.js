/**
 * Created by kwx on 2017/9/22.
 */


import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import {Card,Checkbox,Select, Spin, message, Form, Icon, Input, Button, Row, Col } from 'antd'
import '../../style/base.less'
const FormItem = Form.Item

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
                // const user = {};
                // user.userName = values.userName
                // user.userEmail = values.userEmail
                // user.userPwd = values.password
                // fetchRegister(user, (res) => {
                //     if (res.ospState == 200) {
                //         message.success("注册成功", 2, ()=>{ hashHistory.push('/login')})
                //     } else  {
                //         message.error(res.data.msg)
                //         this.setState({
                //             loading: false
                //         })
                //     }
                // })
            }
        });
    }



    render() {

        const { getFieldDecorator } = this.props.form;
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


        return (

            <div  className="pageStyle" >
                <Card title="服务注册" bordered={false} className="cardStyle">
                    <Form onSubmit={this.handleSubmit} style={{marginLeft:'18%',width:'60%'}}>
                        <FormItem
                            {...formItemLayout}
                            label="接口地址"
                            hasFeedback
                        >
                            {getFieldDecorator('interfaceAddress', {
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
                            {getFieldDecorator('requestMethod', {
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
                            label="请求参数（header）:"
                        >
                            {/*<span className="ant-form-text">China</span>*/}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="参数名"
                        >
                            {getFieldDecorator('header_paramName', {
                                rules: [{ required: true, message: '请输入你的参数名!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="类型"
                        >
                            {getFieldDecorator('header_type', {
                                rules: [{ required: true, message: '请输入类型!' }],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="参数位置"
                        >
                            {getFieldDecorator('header_paramAddress', {
                                rules: [{ required: true, message: '请输入参数位置!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                        {...formItemLayout}
                        label="描述"
                    >
                        {getFieldDecorator('header_describe', {
                            rules: [{ required: true, message: '请输入描述!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>


                        <FormItem
                            {...formItemLayout}
                            label="请求参数(urlParam)"

                        >
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="参数名"
                        >
                            {getFieldDecorator('urlParam_paramName', {
                                rules: [{ required: true, message: '请输入你的参数名!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="类型"
                        >
                            {getFieldDecorator('urlParam_type', {
                                rules: [{ required: true, message: '请输入类型!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="参数位置"
                        >
                            {getFieldDecorator('urlParam_paramAddress', {
                                rules: [{ required: true, message: '请输入参数位置!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="描述"
                        >
                            {getFieldDecorator('urlParam_describe', {
                                rules: [{ required: true, message: '请输入描述!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>


                        <FormItem
                            {...formItemLayout}
                            label="错误码参照"
                        >
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="错误码"
                        >
                            {getFieldDecorator('errorCode', {
                                rules: [{ required: true, message: '请输入错误码!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="错误码返回"
                        >
                            {getFieldDecorator('errorCodeReturn', {
                                rules: [{ required: true, message: '请输入错误码返回!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="错误码返回说明"
                        >
                            {getFieldDecorator('errorCodeReturnIns', {
                                rules: [{ required: true, message: '请输入错误码返回说明!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="描述"
                        >
                            {getFieldDecorator('error_describe', {
                                rules: [{ required: true, message: '请输入描述!' }],
                            })(
                                <Input />
                            )}
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

        );

    }
}
