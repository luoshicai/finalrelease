import { useState, useMemo, useCallback } from 'react';
import { Button, Form,  } from 'antd';
import { PageContent,  Table, Pagination, Operator, ToolBar } from '@ra-lib/admin';
import config from 'src/utils/config-hoc';
import EditModal from './EditModal';

export default config({
    path: '/department',
})(function Department(props) {

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
    const { data: { dataSource, total } = {} } = props.ajax.useGet('/department/query', params, [params], {
        setLoading,
        formatResult: (res) => {
            return {
                dataSource: res?.data.records || [],
                total: res?.data.total || 0,
            };
        },
    });

    // 删除
    const { run: deleteRecord } = props.ajax.useGet('/department/del', null, { setLoading, successTip: '删除成功！' });

    const columns = [
        { title: '科室', dataIndex: 'name' },
        { title: '手机号', dataIndex: 'telephone' },
        { title: '科室介绍', dataIndex: 'introduction' },
        {
            title: '操作',
            key: 'operator',
            width: 250,
            render: (value, record) => {
                const { id, name } = record;
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
                            title: `您确定删除「${name}」吗？`,
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
                onOk={() => setVisible(false) || refreshSearch()}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
