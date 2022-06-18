package cn.hs.service;

import cn.hs.entity.Schedule;
import cn.hs.utils.AjaxResult;
import com.baomidou.mybatisplus.extension.service.IService;


public interface IScheduleService extends IService<Schedule> {

    AjaxResult add(Schedule schedule);

    AjaxResult updateByCustom(Schedule schedule);

    AjaxResult del(Integer id);

    AjaxResult queryByCustom(Integer pageNo, Integer pageSize,String date,Integer departmentId);
}
