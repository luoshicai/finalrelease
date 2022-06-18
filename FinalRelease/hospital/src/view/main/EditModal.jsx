import { useCallback,  useState } from 'react';
import {Form, Row, Col, Card, Button, DatePicker, TimePicker, Input, Space, notification} from 'antd';
import { ModalContent, FormItem, Content, validateRules, getLoginUser} from '@ra-lib/admin';
import config from 'src/utils/config-hoc';
import moment from "moment";

export default config({
    modal: {
        title: (props) => {
            return props.isEdit ? '预约挂号' : null;
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
    let formBaseData
    // 编辑时，查询详情数据
    if (isEdit) {
        formBaseData = {
            date: record.date ? moment(record.date) : null
        }
        formBaseData = { ...record, ...formBaseData }
        form.setFieldsValue(formBaseData)
    }

    const { run: save } = props.ajax.usePost('/orders/applyNo', null);


    const handleSubmit =useCallback(

        (index) => {

            let data = getLoginUser()

            const params = {
                userId: data.id,
                date: record.date,
                doctorId:record.doctorId,
                time: index
            };

            save(params).then(res => {
                if (res.code === 500) {
                    notification['error']({
                        message: '预约失败',
                        description: res.msg,
                    });
                } else if (res.code === 200) {
                    notification['success']({
                        message: '预约成功',
                    });
                }
                onOk();
            })

        },
        [onOk]

    )

    const onChange = () =>{
    }


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
        <Form form={form} name="roleEdit" initialValues={{ enabled: true, departmentId: null }}>
            <ModalContent
                loading={loading}
                okText="确定"

                cancelText="取消"
                onCancel={() => form.resetFields()}
                footer={disabled ? <Button onClick={onCancel}>关闭</Button> : undefined}
            >
                {isEdit ? <FormItem hidden name="id" /> : null}
                <Row gutter={8}>
                    <Col {...colLayout}>
                        <Card title="基础信息">
                            <Content fitHeight otherHeight={160}>
                                <FormItem {...layout} label="医生姓名" disabled name="doctorName" required noSpace />
                                <FormItem {...layout} label="选择日期" name="date" required noSpace >
                                    <DatePicker disabled value={formBaseData.date} format={'YYYY/MM/DD'} onChange={onChange} />
                                </FormItem>
                                <FormItem {...layout} label="出诊数" name="time1" required noSpace >
                                    <Row>
                                        <Col flex="300px">
                                            <TimePicker.RangePicker  defaultValue={[moment('08:00:00', 'HH:mm:ss'), moment('10:00:00', 'HH:mm:ss')]} disabled />
                                        </Col>

                                        <Col flex="auto">
                                            <Input disabled defaultValue={formBaseData.time1} style={{"width":"200px"}} placeholder="请输入出诊数量" />
                                            <Button type="primary" onClick={() => handleSubmit(1)}>预约</Button>
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
                                            <Input disabled defaultValue={formBaseData.time2}  style={{"width":"200px"}} placeholder="请输入出诊数量" />
                                            <Button type="primary" onClick={() => handleSubmit(2)}>预约</Button>
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
                                            <Input disabled defaultValue={formBaseData.time3}  style={{"width":"200px"}} placeholder="请输入出诊数量" />
                                            <Button type="primary" onClick={() => handleSubmit(3)}>预约</Button>
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
                                            <Input disabled defaultValue={formBaseData.time4}  style={{"width":"200px"}} placeholder="请输入出诊数量" />
                                            <Button type="primary" onClick={() => handleSubmit(4)}>预约</Button>
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
