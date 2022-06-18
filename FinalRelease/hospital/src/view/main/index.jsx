import config from 'src/utils/config-hoc';
import s from 'src/css/main.less'
import {
    Row,
    Col,
    Card,
    Divider,
    Button,
    Modal,
    message,
    Timeline,
    Menu,
    DatePicker,
    Space,
    Pagination,
    form,
    Form
} from 'antd'
import moment from "moment";
import {useCallback, useMemo, useState} from "react";
import {Operator, PageContent, Table, getLoginUser} from "@ra-lib/admin";
import {getSectionList, queryDoctorList} from 'src/service/main'
import EditModal from "./EditModal";
import {toLogin} from 'src/utils';
const { Meta } = Card;





export default config({
    path: '/main',
    auth: false,
    layout: false,
})(function Main(props) {
    let pageNo = 1
    let pageSize = 5
    // const [pageNo, setPageNum] = useState(1);
    // const [pageSize, setPageSize] = useState(5);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [list, setList] = useState({});
    const [select, setSelect] = useState([]);
    const [visible, setVisible] = useState(false);
    const [conditions, setConditions] = useState({});
    const [data, setData] = useState(moment().startOf('day').format("YYYY-MM-DD"));
    const [show, setShow] = useState(true);
    const [dataSource, setDataSource] = useState([])

    const [total, setTotal] = useState(0)

    const [record, setRecord] = useState(null);
    const [form] = Form.useForm();
    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };

    const params = useMemo(() => {
        return {
            ...conditions,
            userId: getLoginUser() ? getLoginUser().id : '',
            date: moment().startOf('day').format("YYYY-MM-DD"),
            pageNo,
            pageSize,
        };
    }, [conditions,pageNo, pageSize]);


    const refreshSearch = useCallback(() => {
        setConditions(form.getFieldsValue());
    }, [form]);

    getSectionList.then(res => {
        setSelect(res.data.records)
    })



    // 获取我的预约列表
    const { data: { subscribeList } = {} } = props.ajax.useGet('/orders/queryAll', params, [params], {
        formatResult: (res) => {
            return {
                subscribeList: res?.data || [],
            };
        },
    });


    const handleDelete = () => {

    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }


    const showModal = (value) => {
        props.ajax
            .get('/department/getById', {id: value.departmentId})
            .then(res => {
                res.data.process = value.process
                setList(res.data)
                setIsModalVisible(true)
            }).catch((err) => {
                message.error(err.response?.data?.message || '失败');
        })
    }
    const onClick = () => {
        toLogin()
    }

    const concealShow = (id) => {
        params.departmentId = id
        queryDoctorList(params).then(res => {
            setDataSource(res.data.records)
            setTotal(res.data.total)
            setShow(false)
        })
    }
    const onChange = (current, pageSize) => {
        params.pageNo = current
        params.pageSize = pageSize
        queryDoctorList(params).then(res => {
            setDataSource(res.data.records)
            setTotal(res.data.total)
        })
    }

    const onChangePicker = (e, dateString) => {
        params.date = dateString
        queryDoctorList(params).then(res => {
            setDataSource(res.data.records)
            setTotal(res.data.total)
        })
    }
    const onMake = (record) => {
        if (getLoginUser()) {
            setRecord(record) || setVisible(true)
        } else {
            message.error('请先登录。。。');
        }

    }

    const go = () => {
        setShow(true)
    }


    const columns = [
        { title: '医生', dataIndex: 'doctorName', align: 'center' },
        { title: '医生介绍', dataIndex: 'info', align: 'center' },
        {
            title: '操作',
            key: 'operator',
            align: 'center',
            width: 250,
            render: (value, record) => {
                const items = [
                    {
                        label: '预约',
                        onClick: () => onMake(record),
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];
    const columns1 = [
        { title: '日期', dataIndex: 'date' },
        { title: '时间', key: 'time',
            render:(value, record) => {
                let text = ''
                switch (value.time) {
                    case 1: {
                        text = '上午八点到十点'
                        break
                    }
                    case 2: {
                        text = '上午十点到十二点'
                        break
                    }
                    case 3: {
                        text = '下午两点到四点'
                        break
                    }
                    case 4: {
                        text = '下午四点到六点'
                        break
                    }
                }
                return <div>{text}</div>
             }},
        {
            title: '操作',
            key: 'operator',
            width: 250,
            render: (value, record) => {
                const items = [
                    {
                        label: '查看',
                        onClick: () => showModal(value),
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];


    return(
        <div className={s.root}>

            <div className={s.siteCardWrapper}>
                <Menu mode="horizontal" defaultSelectedKeys={['main']} >
                    <Menu.Item key="main" >
                        预约
                    </Menu.Item>
                    <Menu.Item key="login" onClick={onClick}>
                        登录/切换
                    </Menu.Item>
                </Menu>


                <Divider>选择科室</Divider>
                {
                    show ? <Row gutter={16}>
                        <Col span={24}>
                            <Card bordered={false} className={s.card}>
                                {
                                    select.map(item => {
                                        return <Card.Grid key={item.id} style={gridStyle} onClick={() => concealShow(item.id)}>{item.name}</Card.Grid>
                                    })
                                }

                            </Card>
                        </Col>
                    </Row> :  <Row gutter={16}>
                        <Col span={24}>
                            <Card title={data} bordered={false} className={s.card} extra={<div onClick={go}>返回</div>}>
                                <Space>
                                    <DatePicker onChange={onChangePicker} defaultValue={moment()} format={'YYYY-MM-DD'} />
                                </Space>

                                <Table
                                    serialNumber
                                    pageNum={pageNo}
                                    pageSize={pageSize}
                                    dataSource={dataSource}
                                    columns={columns}
                                    rowKey="id"
                                />

                                <Pagination
                                    className={s.Pagination}
                                    showSizeChanger
                                    total={total}
                                    onChange={onChange}
                                    pageNum={pageNo}
                                    pageSize={pageSize}
                                />
                            </Card>
                        </Col>
                        {/*<Col span={8}>*/}
                        {/*    <Card title={dayList[1].date} bordered={false} className={s.card}>*/}
                        {/*        <Table*/}
                        {/*            serialNumber*/}
                        {/*            pageNum={pageNo}*/}
                        {/*            pageSize={pageSize}*/}
                        {/*            dataSource={dataSource1}*/}
                        {/*            columns={columns}*/}
                        {/*            rowKey="id"*/}
                        {/*        />*/}
                        {/*    </Card>*/}
                        {/*</Col>*/}
                        {/*<Col span={8}>*/}
                        {/*    <Card title={dayList[2].date} bordered={false} className={s.card}>*/}
                        {/*        <Table*/}
                        {/*            serialNumber*/}
                        {/*            pageNum={pageNo}*/}
                        {/*            pageSize={pageSize}*/}
                        {/*            dataSource={dataSource2}*/}
                        {/*            columns={columns}*/}
                        {/*            rowKey="id"*/}
                        {/*        />*/}
                        {/*    </Card>*/}
                        {/*</Col>*/}
                    </Row>
                }





                {
                    getLoginUser() ? (
                        <div>
                            <Divider>个人信息</Divider>
                            <Row gutter={16}>
                                {/*<Col span={4}>*/}
                                {/*    <Card*/}
                                {/*        hoverable*/}
                                {/*        style={{*/}
                                {/*            width: 240,*/}
                                {/*        }}*/}
                                {/*    >*/}
                                {/*        <Meta title={'姓名：'+ getLoginUser().name} />*/}
                                {/*    </Card>*/}
                                {/*</Col>*/}
                                <Col span={24}>
                                    <Card
                                        hoverable
                                        style={{
                                            width: 240,
                                            marginBottom: 10
                                        }}
                                    >
                                        <Meta title={'姓名：'+ getLoginUser().name} />
                                    </Card>
                                    <Card title="预约列表" bordered={false}>
                                        <Table
                                            serialNumber
                                            pageNum={pageNo}
                                            pageSize={pageSize}
                                            dataSource={subscribeList}
                                            columns={columns1}
                                            rowKey="id"
                                        />

                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    ) :  null
                }




            </div>
            <EditModal
                visible={visible}
                record={record}
                isEdit={!!record}
                onOk={() => setVisible(false) || refreshSearch()}
                onCancel={() => setVisible(false)}
            />

            <Modal title="治疗流程" visible={isModalVisible} onCancel={handleCancel} footer={null}>

                <Timeline mode={"right"}>
                    <Timeline.Item color={list.process === 1 ? "blue" : list.process < 1 ? 'gray' : 'green'} label={list.process === 1 ? "进行中" : list.process < 1 ? '未进行' : '已完成'}>{list.process1}</Timeline.Item>
                    <Timeline.Item color={list.process === 2 ? "blue" : list.process < 2 ? 'gray' : 'green'} label={list.process === 2 ? "进行中" : list.process < 2 ? '未进行' : '已完成'}>{list.process2}</Timeline.Item>
                    <Timeline.Item color={list.process === 3 ? "blue" : list.process < 3 ? 'gray' : 'green'} label={list.process === 3 ? "进行中" : list.process < 3 ? '未进行' : '已完成'}>{list.process3}</Timeline.Item>
                    <Timeline.Item color={list.process === 4 ? "blue" : list.process < 4 ? 'gray' : 'green'} label={list.process === 4 ? "进行中" : list.process < 4 ? '未进行' : '已完成'}>{list.process4}</Timeline.Item>
                    <Timeline.Item color={list.process === 5 ? "blue" : list.process < 5 ? 'gray' : 'green'} label={list.process === 5 ? "进行中" : list.process < 5 ? '未进行' : '已完成'}>{list.process5}</Timeline.Item>
                    <Timeline.Item color={list.process === 6 ? "blue" : list.process < 6 ? 'gray' : 'green'} label={list.process === 6 ? "进行中" : list.process < 6 ? '未进行' : '已完成'}>{list.process6}</Timeline.Item>
                </Timeline>
            </Modal>


        </div>
    )
});
