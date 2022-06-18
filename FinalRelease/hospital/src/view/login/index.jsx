import React, {useState, useEffect, useCallback} from 'react';
import {Helmet} from 'react-helmet';
import {Button, Form, Radio, message} from 'antd';
import {LockOutlined, UserOutlined, WhatsAppOutlined, MailOutlined} from '@ant-design/icons';
import {FormItem, setLoginUser} from '@ra-lib/admin';
import config from 'src/utils/config-hoc';
import {toHome, toRole} from 'src/utils';
import {IS_DEV, IS_TEST, IS_PREVIEW} from 'src/utils/config';
import s from 'src/css/login.less';

// 开发模式 默认填充的用户名密码
const formValues = {
    username: '',
    password: '',
    roleId: '1'
};


export default config({
    path: '/login',
    auth: false,
    layout: false,
})(function Login(props) {
    const [isMount, setIsMount] = useState(false);
    let [show, setData] = useState(true);
    const [form] = Form.useForm();

    const login = props.ajax.usePost('/user/login');

    const handleSubmit = useCallback(
        (values) => {
            if (login.loading) return;

            const params = {
                ...values,
            };
            params.tel = values.username

            login
                .run(params, {errorTip: false})
                .then((res) => {
                    const {username, roleId, id, departmentId} = res.data;
                    message.success( '登录成功');
                    setLoginUser({
                        id: id, // 必须字段
                        name: username, // 必须字段
                        roleId,
                        departmentId
                    });
                    toRole();
                })
                .catch((err) => {
                    console.error(err);
                    message.error(err.response?.data?.message || '用户名或密码错误');
                });
        },
        [login],
    );

    const showRegForm = () => {
        setData(
             !show
        )
    }
    const sendRegForm = async (values) => {
        values.weiyue = "0"
        values.roleId = '1'
        props.ajax
            .post('/user/register', values)
            .then(res => {
                message.success( '注册成功');
                setData(
                    !show
                )
                formValues.username = values.username
                formValues.password = values.password
            }).catch((err) => {
                message.error(err.response?.data?.message || '失败');
        })
    }

    useEffect(() => {
        // 开发时默认填入数据
        if (IS_DEV || IS_TEST || IS_PREVIEW) {
            form.setFieldsValue(formValues);
        }

        setTimeout(() => setIsMount(true), 300);
    }, [form]);


    const formItemClass = [s.formItem, {[s.active]: isMount}];

    return (
        <div>
            {
                show ? (<div className={s.root}>
                    <Helmet title="欢迎登录" />
                    <div className={s.logo}>
                        {/*<Logo />*/}
                    </div>
                    {/*<Proxy className={s.proxy} />*/}
                    <div className={s.box}>
                        <Form form={form} name="login" onFinish={handleSubmit}>
                            <div className={formItemClass}>
                                <h1 className={s.header}>欢迎登录</h1>
                            </div>
                            <div className={formItemClass}>
                                <FormItem
                                    name="username"
                                    allowClear
                                    autoFocus
                                    prefix={<UserOutlined />}
                                    placeholder="请输入账号"
                                    rules={[{required: true, message: '请输入账号！'}]}
                                />
                            </div>
                            <div className={formItemClass}>
                                <FormItem
                                    type="password"
                                    name="password"
                                    prefix={<LockOutlined />}
                                    placeholder="请输入密码"
                                    rules={[{required: true, message: '请输入密码！'}]}
                                />
                            </div>
                            <div className={formItemClass}>

                                <FormItem name="roleId" label="角色" >
                                    <Radio.Group >
                                        <Radio value="1">患者</Radio>
                                        <Radio value="3">医生</Radio>
                                        <Radio value="2">管理员</Radio>
                                    </Radio.Group>
                                </FormItem>
                            </div>
                            <div className={formItemClass}>
                                <FormItem noStyle shouldUpdate style={{marginBottom: 0}}>
                                    {() => (
                                        <div>
                                            <Button
                                                className={s.submitBtn}
                                                loading={login.loading}
                                                type="primary"
                                                htmlType="submit"
                                                disabled={
                                                    // 用户没有操作过，或者没有setFieldsValue
                                                    !form.isFieldsTouched(true) ||
                                                    // 表单中存在错误
                                                    form.getFieldsError().filter(({errors}) => errors.length).length
                                                }
                                            >
                                                登录
                                            </Button>
                                            <Button
                                                className={s.submitBtn}
                                                onClick={showRegForm}
                                            >注册</Button>
                                        </div>

                                    )}
                                </FormItem>
                            </div>
                        </Form>
                    </div>
                </div>) : <div className={s.root}>
                    <Helmet title="欢迎登录" />
                    <div className={s.logo}>
                        {/*<Logo />*/}
                    </div>
                    {/*<Proxy className={s.proxy} />*/}
                    <div className={s.box}>
                        <Form form={form} name="login" onFinish={sendRegForm}>
                            <div className={formItemClass}>
                                <h1 className={s.header}>请注册账号</h1>
                            </div>
                            <div className={formItemClass}>
                                <FormItem
                                    name="username"
                                    allowClear
                                    autoFocus
                                    prefix={<UserOutlined />}
                                    maxLength={6}
                                    placeholder="请输入姓名"
                                    rules={[{required: true, message: '请输入姓名！'}]}
                                />
                            </div>
                            <div className={formItemClass}>
                                <FormItem
                                    type="password"
                                    name="password"
                                    prefix={<LockOutlined />}
                                    maxLength={6}
                                    placeholder="请输入密码"
                                    rules={[{required: true, message: '请输入密码！'}]}
                                />
                            </div>
                            <div className={formItemClass}>
                                <FormItem
                                    name="tel"
                                    allowClear
                                    autoFocus
                                    maxLength={11}
                                    prefix={<WhatsAppOutlined />}
                                    placeholder="请输入手机号"
                                    rules={[
                                        {required: true, message: '请输入手机号！'},
                                        {
                                            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号'
                                        }
                                    ]}
                                />
                            </div>
                            <div className={formItemClass}>
                                <FormItem
                                    name="mail"
                                    allowClear
                                    autoFocus
                                    prefix={<MailOutlined />}
                                    placeholder="请输入邮箱"
                                    rules={[{required: true, message: '请输入邮箱！'}]}
                                />
                            </div>
                            {/*<div className={formItemClass}>*/}

                            {/*    <FormItem name="identity" label="角色">*/}
                            {/*        <Radio.Group >*/}
                            {/*            <Radio value="1">患者</Radio>*/}
                            {/*            <Radio value="2">管理员</Radio>*/}
                            {/*        </Radio.Group>*/}
                            {/*    </FormItem>*/}
                            {/*</div>*/}
                            <div className={formItemClass}>
                                <FormItem name="gender" label="性别">
                                    <Radio.Group >
                                        <Radio value="1">男</Radio>
                                        <Radio value="2">女</Radio>
                                    </Radio.Group>
                                </FormItem>
                            </div>

                            <div className={formItemClass}>
                                <FormItem noStyle shouldUpdate style={{marginBottom: 0}}>
                                    {() => (
                                        <div>
                                            <Button
                                                className={s.submitBtn}
                                                htmlType="submit"
                                            >注册</Button>
                                        </div>

                                    )}
                                </FormItem>
                            </div>
                        </Form>
                    </div>
                </div>
            }


        </div>

    );
});
