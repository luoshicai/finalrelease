package cn.hs.controller;

import cn.hs.entity.Department;
import cn.hs.entity.Doctor;
import cn.hs.service.IDepartmentService;
import cn.hs.utils.AjaxResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;


@RestController
@RequestMapping("/department")
public class DepartmentController {

    @Resource
    private IDepartmentService departmentService;

    /**
     * 删除科室
     */
    @GetMapping("/del")
    public AjaxResult del(@RequestParam Integer id){
        return departmentService.del(id);
    }

    /**
     * 查询科室
     */
    @GetMapping("/query")
    public AjaxResult query(@RequestParam Integer pageNo,@RequestParam Integer pageSize){
        return departmentService.queryCustom(pageNo,pageSize);
    }


    /**
     * 根据Id查询科室
     */
    @GetMapping("/getById")
    public AjaxResult getById(@RequestParam Integer id){
        return departmentService.getByCustomId(id);
    }

    /**
     * 更新科室
     */
    @PostMapping("/update")
    public AjaxResult updatge(@RequestBody Department department){
        return departmentService.updatge(department);
    }

    /**
     * 更新科室
     */
    @PostMapping("/add")
    public AjaxResult add(@RequestBody Department department){
        return departmentService.add(department);
    }

}
