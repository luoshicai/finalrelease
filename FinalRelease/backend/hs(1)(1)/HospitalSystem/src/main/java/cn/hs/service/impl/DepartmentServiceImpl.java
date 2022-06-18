package cn.hs.service.impl;

import cn.hs.entity.Department;
import cn.hs.entity.Doctor;
import cn.hs.mapper.DepartmentMapper;
import cn.hs.service.IDepartmentService;
import cn.hs.utils.AjaxResult;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;


@Service
public class DepartmentServiceImpl extends ServiceImpl<DepartmentMapper, Department> implements IDepartmentService {

    @Resource
    private DepartmentMapper departmentMapper;

    @Override
    @Transactional
    public AjaxResult add(Department department) {
        int insert = departmentMapper.insert(department);
        if (insert==1){
            return AjaxResult.success("新增成功！");
        }
        return AjaxResult.error("新增失败！");
    }

    @Override
    @Transactional
    public AjaxResult updatge(Department department) {
        int update = departmentMapper.updateById(department);
        if (update==1){
            return AjaxResult.success("更新成功！");
        }
        return AjaxResult.error("更新失败！");
    }

    @Override
    public AjaxResult queryCustom(Integer pageNo, Integer pageSize) {
        Page<Department> page = new Page<Department>(pageNo,pageSize);
        IPage<Department> dataList = departmentMapper.selectPage(page,null);
        return AjaxResult.success(dataList);
    }

    @Override
    @Transactional
    public AjaxResult del(Integer id) {
        int delete = departmentMapper.deleteById(id);
        if (delete==1){
            return AjaxResult.success("删除成功！");
        }
        return AjaxResult.error("删除失败！");
    }

    @Override
    public AjaxResult getByCustomId(Integer id) {
        Department department = departmentMapper.selectById(id);
        return AjaxResult.success(department);
    }
}
