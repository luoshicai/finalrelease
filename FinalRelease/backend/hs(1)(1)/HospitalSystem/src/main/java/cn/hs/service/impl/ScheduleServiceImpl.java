package cn.hs.service.impl;

import cn.hs.entity.Doctor;
import cn.hs.entity.Schedule;
import cn.hs.mapper.DoctorMapper;
import cn.hs.mapper.ScheduleMapper;
import cn.hs.service.IScheduleService;
import cn.hs.utils.AjaxResult;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;


import javax.annotation.Resource;
import java.util.List;


@Service
public class ScheduleServiceImpl extends ServiceImpl<ScheduleMapper, Schedule> implements IScheduleService {

    @Resource
    private ScheduleMapper scheduleMapper;

    @Resource
    private DoctorMapper doctorMapper;

    @Override
    @Transactional
    public AjaxResult add(Schedule schedule) {
        int insert = scheduleMapper.insert(schedule);
        if (insert==1){
            return AjaxResult.success();
        }
        return AjaxResult.error();
    }

    @Override
    @Transactional
    public AjaxResult updateByCustom(Schedule schedule) {
        int update = scheduleMapper.updateById(schedule);
        if (update==1){
            return AjaxResult.success();
        }
        return AjaxResult.error();
    }

    @Override
    @Transactional
    public AjaxResult del(Integer id) {
        int delete = scheduleMapper.deleteById(id);
        if (delete==1){
            return AjaxResult.success();
        }
        return AjaxResult.error();
    }

    @Override
    public AjaxResult queryByCustom(Integer pageNo, Integer pageSize,String date,Integer departmentId) {
        IPage<Schedule> page = new Page<>(pageNo,pageSize);
        QueryWrapper<Schedule> scheduleQueryWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(date)){
            scheduleQueryWrapper.eq("date",date);
        }
        if (departmentId!=null){
            scheduleQueryWrapper.eq("department_id",departmentId);
        }
        IPage<Schedule> page1 = scheduleMapper.selectPage(page, scheduleQueryWrapper);
        List<Schedule> records = page1.getRecords();
        for (Schedule record : records) {
            Integer doctorId = record.getDoctorId();
            Doctor doctor = doctorMapper.selectById(doctorId);
            if (doctor!=null){
                record.setDepartment(doctor.getDepartment());
                record.setImage(doctor.getImage());
                record.setInfo(doctor.getInfo());

            }

        }
        return AjaxResult.success(page1);
    }
}
