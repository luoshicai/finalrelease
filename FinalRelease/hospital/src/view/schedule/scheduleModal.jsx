import {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import { Form, Row, Col, Card, Button, Select, DatePicker, Space, Input, TimePicker} from 'antd';
import moment from 'moment';
import { ModalContent, FormItem, Content, validateRules, useDebounceValidator } from '@ra-lib/admin';
import config from 'src/utils/config-hoc';

export default config({
    modal: {
        title: (props) => {
            if (props?.record?.isDetail) return '查看排班信息';

            return props.isEdit ? '编辑排班' : '新建排班';
        },
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const { record, isEdit, onOk, onCancel, source } = props;
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState('');
    const [form] = Form.useForm();
    const isDetail = record?.isDetail;
    const { Option } = Select;
    const cbRef = useRef();
    const params = useMemo(() => {
        return { id: record?.id };
    }, [record]);
    let formBaseData

    // 编辑时，查询详情数据
    if (isEdit) {
        formBaseData = {
            date: record.date ? moment(record.date) : null
        }
        formBaseData = { ...record, ...formBaseData }
        form.setFieldsValue(formBaseData)
    }



    const { run: save } = props.ajax.usePost('/schedule/add', null, { setLoading, successTip: '创建成功！' });
    const { run: update } = props.ajax.usePost('/schedule/update', null, { setLoading, successTip: '修改成功！' });
    const { run: fetchUserByAccount } = props.ajax.useGet('/user/getOneUser');

    const handleSubmit = useCallback(
        async (values) => {
            const params = {
                ...values
            };
            params.date = cbRef.current
            params.doctorId = params.doctorId
            params.doctorName = params.username
            params.departmentId= record.departmentId
            await update(params);
            // if (isEdit) {
            //     await update(params);
            // } else {
            //
            // }

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

    useEffect(() => {
        cbRef.current = date
    }, [date])

    const normFile = (e) => {
        console.log('Upload event:', e);

        // if (Array.isArray(e)) {
        //     return e;
        // }
        //
        // return e?.fileList;
    };
    const onChange = (e, dateString) => {
        setDate(dateString)
    }

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
                                <FormItem {...layout} label="医生姓名" name="doctorName" required noSpace />
                                <FormItem {...layout} label="选择日期" name="date" required noSpace >
                                    <DatePicker value={formBaseData.date} format={'YYYY-MM-DD'} onChange={onChange} />
                                </FormItem>
                                <FormItem {...layout} label="出诊数" name="time1" required noSpace >
                                    <Row>
                                        <Col flex="300px">
                                            <TimePicker.RangePicker  defaultValue={[moment('08:00:00', 'HH:mm:ss'), moment('10:00:00', 'HH:mm:ss')]} disabled />
                                        </Col>

                                            <Col flex="auto">
                                                <Input defaultValue={formBaseData.time1} style={{"width":"200px"}} placeholder="请输入出诊数量" />
                                            </Col>

                                    </Row>
                                </FormItem>


                                <FormItem {...layout} label="出诊数" name="time2" required noSpace >
                                    <Row>
                                        <Col flex="300px">
                                            <Space direction="vertical">
                                                <TimePicker.RangePicker  defaultValue={[moment('10:00:00', 'HH:mm:ss'), moment('12:00:00', 'HH:mm:ss')]} disabled />
                                            </Space>
                                        </Col>

                                            <Col flex="auto">
                                                <Input defaultValue={formBaseData.time2}  style={{"width":"200px"}} placeholder="请输入出诊数量" />
                                            </Col>

                                    </Row>
                                </FormItem>
                                <FormItem {...layout} label="出诊数" name="time3" required noSpace >
                                    <Row>
                                        <Col flex="300px">
                                            <Space direction="vertical">
                                                <TimePicker.RangePicker  defaultValue={[moment('14:00:00', 'HH:mm:ss'), moment('16:00:00', 'HH:mm:ss')]} disabled />
                                            </Space>
                                        </Col>

                                            <Col flex="auto">
                                                <Input defaultValue={formBaseData.time3}  style={{"width":"200px"}} placeholder="请输入出诊数量" />
                                            </Col>

                                    </Row>
                                </FormItem>
                                <FormItem {...layout} label="出诊数" name="time4" required noSpace >
                                    <Row>
                                        <Col flex="300px">
                                            <Space direction="vertical">
                                                <TimePicker.RangePicker  defaultValue={[moment('16:00:00', 'HH:mm:ss'), moment('18:00:00', 'HH:mm:ss')]} disabled />
                                            </Space>
                                        </Col>

                                            <Col flex="auto">
                                                <Input defaultValue={formBaseData.time4}  style={{"width":"200px"}} placeholder="请输入出诊数量" />
                                            </Col>

                                    </Row>
                                </FormItem>
                            </Content>
                        </Card>
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});
