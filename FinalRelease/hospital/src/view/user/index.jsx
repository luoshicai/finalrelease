import { useState, useMemo, useCallback } from 'react';
import { Button, Form, Space } from 'antd';
import { PageContent, QueryBar, FormItem, Table, Pagination, Operator, ToolBar } from '@ra-lib/admin';
import config from 'src/utils/config-hoc';
import EditModal from './EditModal';
import ScheduleModal from './scheduleModal'

export default config({
    path: '/users',
})(function User(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [conditions, setConditions] = useState({});
    const [visible, setVisible] = useState(false);
    const [scheduleVisible, setscheduleVisible] = useState(false);
    const [record, setRecord] = useState(null);
    const [form] = Form.useForm();

    const params = useMemo(() => {
        return {
            ...conditions,
            pageNo: pageNum,
            pageSize,
        };
    }, [conditions, pageNum, pageSize]);


    const params1 = useMemo(() => {
        return {
            pageNo: pageNum,
            pageSize: 100,
        };
    }, [pageNum, pageSize]);
    // 使用现有查询条件，重新发起请求
    const refreshSearch = useCallback(() => {
        setConditions(form.getFieldsValue());
    }, [form]);

    // 获取列表
    const { data: { dataSource, total } = {} } = props.ajax.useGet('/doctor/queryDoctor', params, [params], {
        setLoading,
        formatResult: (res) => {
            return {
                dataSource: res?.data.records || [],
                total: res?.data.total || 0
            };
        },
    });
    const { data: { Source } = {} } = props.ajax.useGet('/department/query', params1, [params1], {
        setLoading,
        formatResult: (res) => {
            return {
                Source: res?.data.records || []

            };
        },
    });



    // 删除
    const { run: deleteRecord } = props.ajax.useGet('/doctor/delDoctor', null, { setLoading, successTip: '删除成功！' });

    const columns = [

        { title: '姓名', dataIndex: 'username' },
        { title: '密码', dataIndex: 'password' },
        { title: '所属科室', dataIndex: 'department' },
        { title: '职称', dataIndex: 'title' },
        { title: '医生介绍', dataIndex: 'info' },
        {
            title: '操作',
            key: 'operator',
            width: 250,
            render: (value, record) => {
                const { id, username } = record;
                const items = [
                    {
                        label: '查看',
                        onClick: () => setRecord({ ...record, isDetail: true }) || setVisible(true),
                    },
                    {
                        label: '排班',
                        onClick: () => setRecord(record) || setscheduleVisible(true),
                    },
                    {
                        label: '修改',
                        onClick: () => setRecord(record) || setVisible(true),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除「${username}」吗？`,
                            onConfirm: () => handleDelete(id),
                        },
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];

    const handleDelete = useCallback(
        async (id) => {
            await deleteRecord({id});
            // 触发列表更新
            refreshSearch();
        },
        [deleteRecord, refreshSearch],
    );

    const queryItem = {
        style: { width: 200 },
    };

    return (
        <PageContent loading={loading}>
            <QueryBar>
                {/*<Form*/}
                {/*    name="user"*/}
                {/*    layout="inline"*/}
                {/*    form={form}*/}
                {/*    initialValues={{ position: '01' }}*/}
                {/*    onFinish={(values) => setPageNum(1) || setConditions(values)}*/}
                {/*>*/}
                {/*    <FormItem {...queryItem} label="账号" name="account" />*/}
                {/*    <FormItem {...queryItem} label="姓名" name="name" />*/}
                {/*    <FormItem {...queryItem} label="手机号" name="mobile" />*/}
                {/*    <FormItem*/}
                {/*        {...queryItem}*/}
                {/*        label="职位"*/}
                {/*        name="position"*/}
                {/*        allowClear*/}
                {/*        options={[*/}
                {/*            { value: '01', label: '前端开发' },*/}
                {/*            { value: '02', label: '后端开发' },*/}
                {/*        ]}*/}
                {/*    />*/}
                {/*    <FormItem>*/}
                {/*        <Space>*/}
                {/*            <Button type="primary" htmlType="submit">*/}
                {/*                查询*/}
                {/*            </Button>*/}
                {/*            <Button onClick={() => form.resetFields()}>重置</Button>*/}
                {/*        </Space>*/}
                {/*    </FormItem>*/}
                {/*</Form>*/}
            </QueryBar>
            <ToolBar>
                <Button type="primary" onClick={() => setRecord(null) || setVisible(true)}>
                    添加
                </Button>
            </ToolBar>
            <Table
                serialNumber
                pageNum={pageNum}
                pageSize={pageSize}
                fitHeight
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={setPageNum}
                onPageSizeChange={(pageSize) => setPageNum(1) || setPageSize(pageSize)}
            />
            <EditModal
                visible={visible}
                record={record}
                isEdit={!!record}
                source={Source}
                onOk={() => setVisible(false) || refreshSearch()}
                onCancel={() => setVisible(false)}
            />
            <ScheduleModal
                visible={scheduleVisible}
                record={record}
                isEdit={!!record}
                source={Source}
                onOk={() => setscheduleVisible(false) || refreshSearch()}
                onCancel={() => setscheduleVisible(false)}
            />
        </PageContent>
    );
});
