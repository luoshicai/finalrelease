import { useState, useMemo, useCallback } from 'react';
import { Button, Form, Space } from 'antd';
import { PageContent, QueryBar, FormItem, Table, Pagination, Operator, ToolBar } from '@ra-lib/admin';
import config from 'src/utils/config-hoc';
import EditModal from './scheduleModal';

export default config({
    path: '/schedule',
})(function Schedule(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [conditions, setConditions] = useState({});
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState(null);
    const [form] = Form.useForm();

    const params = useMemo(() => {
        return {
            ...conditions,
            pageNo: pageNum,
            pageSize,
        };
    }, [conditions, pageNum, pageSize]);


    // 使用现有查询条件，重新发起请求
    const refreshSearch = useCallback(() => {
        setConditions(form.getFieldsValue());
    }, [form]);

    // 获取列表
    const { data: { dataSource, total } = {} } = props.ajax.useGet('/schedule/queryByCustomPage', params, [params], {
        setLoading,
        formatResult: (res) => {
            return {
                dataSource: res?.data.records || [],
                total: res?.data.total || 0
            };
        },
    });



    // 删除
    const { run: deleteRecord } = props.ajax.useGet('/schedule/del', null, { setLoading, successTip: '删除成功！' });

    const columns = [

        { title: '姓名', dataIndex: 'doctorName' },
        { title: '日期', dataIndex: 'date' },
        { title: '上午八点到十点', dataIndex: 'time1' },
        { title: '上午十点到十二点', dataIndex: 'time2' },
        { title: '下午二点到四点', dataIndex: 'time3' },
        { title: '下午四点到六点', dataIndex: 'time4' },
        {
            title: '操作',
            key: 'operator',
            width: 250,
            render: (value, record) => {
                const { id, doctorName } = record;
                const items = [
                    {
                        label: '查看',
                        onClick: () => setRecord({ ...record, isDetail: true }) || setVisible(true),
                    },
                    {
                        label: '修改',
                        onClick: () => setRecord(record) || setVisible(true),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除「${doctorName}」吗？`,
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
                source={dataSource}
                onOk={() => setVisible(false) || refreshSearch()}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
