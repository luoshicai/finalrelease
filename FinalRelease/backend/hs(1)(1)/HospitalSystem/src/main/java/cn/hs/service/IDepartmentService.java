package cn.hs.service;

import cn.hs.entity.Department;
import cn.hs.utils.AjaxResult;
import com.baomidou.mybatisplus.extension.service.IService;


public interface IDepartmentService extends IService<Department> {

    AjaxResult add(Department department);

    AjaxResult updatge(Department department);

    AjaxResult queryCustom(Integer pageNo, Integer pageSize);

    AjaxResult del(Integer id);

    AjaxResult getByCustomId(Integer id);
}
