package cn.hs.controller;

import cn.hs.entity.Doctor;
import cn.hs.entity.Schedule;
import cn.hs.service.IDoctorService;
import cn.hs.service.IScheduleService;
import cn.hs.utils.AjaxResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;


@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Resource
    private IScheduleService scheduleService;

    /**
     * 新增排班信息
     */
    @PostMapping("/add")
    public AjaxResult add(@RequestBody Schedule schedule){
        return scheduleService.add(schedule);
    }

    /**
     * 修改排班信息
     */
    @PostMapping("/update")
    public AjaxResult update(@RequestBody Schedule schedule){
        return scheduleService.updateByCustom(schedule);
    }

    /**
     * 删除排班信息
     */
    @GetMapping("/del")
    public AjaxResult del(@RequestParam Integer id){
        return scheduleService.del(id);
    }

    /**
     * 分页获取排班信息
     */
    @GetMapping("/queryByCustomPage")
    public AjaxResult queryByCustomPage(@RequestParam Integer pageNo,@RequestParam Integer pageSize,@RequestParam(required = false) String date,@RequestParam(required = false) Integer departmentId){
        return scheduleService.queryByCustom(pageNo,pageSize,date,departmentId);
    }


}
