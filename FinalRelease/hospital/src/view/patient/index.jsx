import { useState, useMemo, useCallback } from 'react';
import {Button, Form, message, Space} from 'antd';
import {CustomForeach} from 'src/utils';
import {getDepartmentList} from 'src/service/patient'
import { PageContent, QueryBar, FormItem, Table, Pagination, Operator, ToolBar, getLoginUser } from '@ra-lib/admin';
import config from 'src/utils/config-hoc';
import EditModal from './EditModal';

export default config({
    path: '/patient',
})(function Patient(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [conditions, setConditions] = useState({});
    const [visible, setVisible] = useState(false);
    const [scheduleVisible, setscheduleVisible] = useState(false);
    const [record, setRecord] = useState(null);
    const [dataSource, setDataSource] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [processList, setProcessList] = useState([
        {
            name: '',
            id: "1"
        },
        {
            name: '',
            id: "2"
        },
        {
            name: '',
            id: "3"
        },
        {
            name: '',
            id: "4"
        },
        {
            name: '',
            id: "5"
        },
        {
            name: '',
            id: "6"
        },
    ]);
    const [total, setTotal] = useState(0);

    const [form] = Form.useForm();

    const stateList = [
        {
            name: '待就诊',
            id: "1"
        },
        {
            name: '已就诊',
            id: "2"
        },
        {
            name: '取消就诊',
            id: "3"
        },
        {
            name: '未到违约',
            id: "4"
        }
    ]



    const params = useMemo(() => {
        return {
            ...conditions,
            doctorId: getLoginUser().id,
            pageNo: pageNum,
            pageSize,
        };
    }, [conditions, pageNum, pageSize]);


    // 使用现有查询条件，重新发起请求
    const refreshSearch = useCallback(() => {
        setConditions(form.getFieldsValue());
    }, [form]);

    const getDetail = function (id) {
        return  new Promise((resolve) => {
            props.ajax
                .get('/user/getDetail', {id})
                .then(resSon => {
                    resolve(resSon.data)
                    // item.username = resSon.data.username
                    // item.tel = resSon.data.tel
                })
        })
    }

    // 获取列表
    props.ajax.useGet('/doctor/getPatientByDoctor', params, [params], {
        setLoading,
        formatResult: async (res) => {
            let departmentList = await getDepartmentList(getLoginUser().departmentId)
            processList[0].name = departmentList.process1
            processList[1].name = departmentList.process2
            processList[2].name = departmentList.process3
            processList[3].name = departmentList.process4
            processList[4].name = departmentList.process5
            processList[5].name = departmentList.process6
            setDepartmentList(departmentList)
            setProcessList(processList)
            await CustomForeach(res.data.records, async (e, i) => {
                let {username, tel} = await getDetail(e.userId)
                e.username = username
                e.state = e.state + ''
                e.process = e.process + ''
                e.tel = tel

            })
            setDataSource(res.data.records)
            setTotal(res.data.total)
        },
    });



    // 删除
    const { run: deleteRecord } = props.ajax.useGet('/orders/setUserFlag', null, { setLoading, successTip: '删除成功！' });

    const columns = [

        { title: '姓名', dataIndex: 'username' },
        { title: '手机号', dataIndex: 'tel' },
        {   title: '就诊状态',
            key: 'state',
            render: (value, record) => {
                let text = ''
                switch (value.state) {
                    case "1": {
                        text = '待就诊'
                        break
                    }
                    case "2": {
                        text = '已就诊'
                        break
                    }
                    case "3": {
                        text = '取消'
                        break
                    }
                    case "4": {
                        text = '未到违约'
                        break
                    }
                }
                return <div>{text}</div>
            }
        },
        {
            title: '时间',
            key: 'time',
            render:(value, record) => {
                let text = ''
                switch (value.time) {
                    case 1: {
                        text = '上午八点到十点'
                        break
                    }
                    case 2: {
                        text = '上午八点到十点'
                        break
                    }
                    case 3: {
                        text = '上午八点到十点'
                        break
                    }
                    case 4: {
                        text = '上午八点到十点'
                        break
                    }
                }
                return <div>{text}</div>
        }},
        {
            title: '就诊流程',
            key: 'process',
            render:(value, record) => {
                let text = ''
                switch (value.process) {
                    case "1": {
                        text = departmentList.process1
                        break
                    }
                    case "2": {
                        text = departmentList.process2
                        break
                    }
                    case "3": {
                        text = departmentList.process3
                        break
                    }
                    case "4": {
                        text = departmentList.process4
                        break
                    }
                    case "5": {
                        text = departmentList.process5
                        break
                    }
                    case "6": {
                        text = departmentList.process6
                        break
                    }
                }
                return <div>{text}</div>
            }
        },
        {
            title: '病例',
            dataIndex: 'info'
        },
        {
            title: '操作',
            key: 'operator',
            width: 250,
            render: (value, record) => {
                const { id, username, userId } = record;
                const items = [
                    {
                        label: '修改',
                        onClick: () => setRecord(record) || setVisible(true),
                    },
                    {
                        label: '违约',
                        color: 'red',
                        confirm: {
                            title: `您确定标记「${username}」吗？`,
                            onConfirm: () => handleDelete({orderId: id,userId}),
                        },
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];

    const handleDelete = useCallback(
        async (data) => {
            await deleteRecord(data);
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
                source={stateList}
                processList={processList}
                onOk={() => setVisible(false) || refreshSearch()}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
