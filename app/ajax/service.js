/**
 * Created by kwx on 2017/10/16.
 */

import {
    createAjaxAction,
} from '../utils'

import * as ajaxFun from '../utils/ajax'
const apiStore = 'http://localhost:9091'
//服务注册
export const serviceRegister = createAjaxAction(ajaxFun.fetchJSONByPost('/service/register',apiStore));
//服务列表
export const serviceList = createAjaxAction(ajaxFun.fetchJSONByPost('/service/serviceList',apiStore));
//服务状态更新
export const updateServiceStatus = createAjaxAction(ajaxFun.fetchJSONByPost('/service/updateServiceStatus',apiStore));
//服务具有的分类
export const serviceTypeByServiceId = createAjaxAction(ajaxFun.fetchJSONByPost('/service/serviceTypeByServiceId',apiStore));

//服务列表更新服务的分类
export const saveServiceType = createAjaxAction(ajaxFun.fetchJSONByPost('/service/saveServiceType',apiStore));

//所有服务分类列表
export const serviceTypeList = createAjaxAction(ajaxFun.fetchJSONByPost('/service/serviceTypeList',apiStore));

//根据ids删除服务分类
export const deleteTypes = createAjaxAction(ajaxFun.fetchJSONByPost('/service/deleteTypes',apiStore));
//添加服务分类
export const addType = createAjaxAction(ajaxFun.fetchJSONByPost('/service/addType',apiStore));
//服务套餐列表
export const servicePackageList = createAjaxAction(ajaxFun.fetchJSONByPost('/service/servicePackageList',apiStore));
//添加服务套餐
export const savePackage = createAjaxAction(ajaxFun.fetchJSONByPost('/service/savePackage',apiStore));
//根据Ids删除服务套餐
export const deletePackage = createAjaxAction(ajaxFun.fetchJSONByPost('/service/deletePackage',apiStore));

//错误码列表
export const errorCodeList = createAjaxAction(ajaxFun.fetchJSONByPost('/service/errorCodeList',apiStore));

//添加错误码
export const addErrorCode = createAjaxAction(ajaxFun.fetchJSONByPost('/service/addErrorCode',apiStore));
//删除错误码

export const deleteErrorCode = createAjaxAction(ajaxFun.fetchJSONByPost('/service/deleteErrorCode',apiStore));


//参数列表
export const parameterList = createAjaxAction(ajaxFun.fetchJSONByPost('/service/parameterList',apiStore));

//添加参数
export const addParameter = createAjaxAction(ajaxFun.fetchJSONByPost('/service/addParameter',apiStore));
//删除参数
export const deleteParameter = createAjaxAction(ajaxFun.fetchJSONByPost('/service/deleteParameter',apiStore));
