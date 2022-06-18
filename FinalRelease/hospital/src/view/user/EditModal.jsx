import {useCallback, useMemo, useState, useRef} from 'react';
import { Form, Row, Col, Card, Button, Select, Upload   } from 'antd';
import { ModalContent, FormItem, Content, validateRules, useDebounceValidator } from '@ra-lib/admin';
import config from 'src/utils/config-hoc';

export default config({
    modal: {
        title: (props) => {
            if (props?.record?.isDetail) return '查看医生信息';

            return props.isEdit ? '编辑医生信息' : '新建医生';
        },
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const { record, isEdit, onOk, onCancel, source } = props;
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [form] = Form.useForm();
    const isDetail = record?.isDetail;
    const { Option } = Select;
    const params = useMemo(() => {
        return { id: record?.id };
    }, [record]);

    let name = record.username

    // 编辑时，查询详情数据
    if (isEdit) {

        form.setFieldsValue(record)
    }



    const { run: save } = props.ajax.usePost('/doctor/registerDoctor', null, { setLoading, successTip: '创建成功！' });
    const { run: update } = props.ajax.usePost('/doctor/updateDoctor', null, { setLoading, successTip: '修改成功！' });
    const { run: fetchUserByAccount } = props.ajax.useGet('/user/getOneUser');

    const handleSubmit = useCallback(
        async (values) => {
            values.departmentId = record.departmentId
            const params = {
                ...values
            };
            if (isEdit) {
                if (name !== params.username) {
                    await update(params);
                } else {
                    params.username = null
                    await update(params);
                }

            } else {
                await save(params);
            }

            onOk();
        },
        [isEdit, update, save, onOk],
    );


    const disabled = isDetail;
    const layout = {
        labelCol: { flex: '100px' },
        disabled,
    };
    const colLayout = {
        xs: { span: 24 },
        sm: { span: 24 },
    };


    const handleChange = (value, option) => {
        record.departmentId = option.key
    };


    return (
        <Form form={form} name="roleEdit" onFinish={handleSubmit} initialValues={{ enabled: true, departmentId: null }}>
            <ModalContent
                loading={loading}
                okText="保存"
                okHtmlType="submit"
                cancelText="重置"
                onCancel={() => form.resetFields()}
                footer={disabled ? <Button onClick={onCancel}>关闭</Button> : undefined}
            >
                {isEdit ? <FormItem hidden name="id" /> : null}
                <Row gutter={8}>
                    <Col {...colLayout}>
                        <Card title="基础信息">
                            <Content fitHeight otherHeight={160}>
                                <FormItem {...layout} label="医生姓名" name="username" required noSpace />
                                <FormItem
                                    {...layout}
                                    label="账号密码"
                                    name="password"
                                    type="password"
                                    required
                                    noSpace
                                />
                                <Form.Item
                                    name="department"
                                    label="选择科室"
                                    required
                                >
                                    <Select onChange={handleChange} >
                                        {
                                            source ? source.map((item) => {
                                                return <Option value={item.name} key={item.id}>{item.name}</Option>
                                            }) : null
                                        }
                                    </Select>

                                </Form.Item>
                                <FormItem
                                    {...layout}
                                    label="职称"
                                    name="title"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="医生介绍"
                                    name="info"
                                    required
                                    noSpace
                                />
                            </Content>
                        </Card>
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});
