import ajax from "src/utils/ajax";

const params = {
    pageNo: 1,
    pageSize: 100
}
// 获取科室列表
export const getSectionList = ajax.get('/department/query', params)

// 获取部门按照日期查询医生
export function queryDoctorList(params) {
    return ajax.get('/schedule/queryByCustomPage', params)
}



