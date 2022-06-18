import {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import { Form, Row, Col, Card, Button, Select, Input    } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { ModalContent, FormItem, Content, validateRules, useDebounceValidator } from '@ra-lib/admin';
import config from 'src/utils/config-hoc';
import RoleSelectTable from 'src/view/role/RoleSelectTable';
const { TextArea } = Input;


export default config({
    modal: {
        title: (props) => {
            if (props?.record?.isDetail) return '查看病人信息';

            return props.isEdit ? '编辑病人信息' : '新增病人信息';
        },
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const { record, isEdit, onOk, onCancel, source, processList } = props;
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [form] = Form.useForm();
    const isDetail = record?.isDetail;
    const { Option } = Select;

    const params = useMemo(() => {
        return { id: record?.id };
    }, [record]);

    // 编辑时，查询详情数据
    if (isEdit) {
        form.setFieldsValue(record)
    }



    const { run: save } = props.ajax.usePost('/doctor/registerDoctor', null, { setLoading, successTip: '创建成功！' });
    const { run: update } = props.ajax.usePost('/orders/update', null, { setLoading, successTip: '修改成功！' });
    const { run: fetchUserByAccount } = props.ajax.useGet('/user/getOneUser');

    const handleSubmit = useCallback(
        async (values) => {
            const params = {
                ...values
            };
            params.date = record.date
            params.userId = record.userId
            params.doctorId = record.doctorId
            params.time = record.time
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




    const normFile = (e) => {
        console.log('Upload event:', e);

        // if (Array.isArray(e)) {
        //     return e;
        // }
        //
        // return e?.fileList;
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
                                <FormItem {...layout} label="病人姓名" name="username" required noSpace />
                                <FormItem
                                    {...layout}
                                    label="电话号"
                                    name="tel"
                                    required
                                    noSpace
                                />
                                <Form.Item
                                    {...layout}
                                    name="state"
                                    label="就诊状态"
                                    required
                                >
                                    <Select  >
                                        {
                                            source ? source.map((item) => {
                                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                                            }) : null
                                        }
                                    </Select>
                                </Form.Item>


                                <Form.Item
                                    {...layout}
                                    name="process"
                                    label="就诊状态"
                                    required
                                >
                                    <Select >
                                        {
                                            processList ? processList.map((item) => {
                                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                                            }) : null
                                        }
                                    </Select>
                                </Form.Item>


                                <FormItem
                                    {...layout}
                                    label="病例"
                                    name="info"

                                    required
                                    noSpace
                                >
                                    <TextArea rows={4} />

                                </FormItem>

                            </Content>
                        </Card>
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});
