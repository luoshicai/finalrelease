import { useCallback,  useState } from 'react';
import { Form, Row, Col, Card, Button } from 'antd';
import { ModalContent, FormItem, Content, validateRules} from '@ra-lib/admin';
import config from 'src/utils/config-hoc';

export default config({
    modal: {
        title: (props) => {
            if (props?.record?.isDetail) return '查看科室';

            return props.isEdit ? '编辑科室' : '创建科室';
        },
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const { record, isEdit, onOk, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const isDetail = record?.isDetail;

    // const params = useMemo(() => {
    //     return { id: record?.id };
    // }, [record]);

    // 编辑时，查询详情数据
    if (isEdit) {
        form.setFieldsValue(record)
    }
    // props.ajax.useGet('/user/getUserById', params, [params], {
    //     mountFire: isEdit,
    //     setLoading,
    //     formatResult: (res) => {
    //         if (!res) return;
    //         form.setFieldsValue(res);
    //     },
    // });
    const { run: save } = props.ajax.usePost('/department/add', null, { setLoading, successTip: '创建成功！' });
    const { run: update } = props.ajax.usePost('/department/update', null, { setLoading, successTip: '修改成功！' });
    // const { run: fetchUserByAccount } = props.ajax.useGet('/user/getOneUser');

    const handleSubmit = useCallback(
        async (values) => {
            const params = {
                ...values
            };

            if (isEdit) {
                await update(params);
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
    return (
        <Form form={form} name="roleEdit" onFinish={handleSubmit} initialValues={{ enabled: true }}>
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
                                <FormItem {...layout} label="科室名称" name="name" required noSpace />
                                <FormItem
                                    {...layout}
                                    label="手机号"
                                    name="telephone"
                                    rules={[validateRules.mobile()]}
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="科室介绍"
                                    name="introduction"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="流程一"
                                    name="process1"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="流程二"
                                    name="process2"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="流程三"
                                    name="process3"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="流程四"
                                    name="process4"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="流程五"
                                    name="process5"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="流程六"
                                    name="process6"
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
