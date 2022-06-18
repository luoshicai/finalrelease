import ajax from "src/utils/ajax";



export function getDepartmentList(id) {
    return new Promise((resolve => {
        ajax.get('/department/getById', {id})
            .then(res => {
                resolve(res.data)
            })
    }))
}
