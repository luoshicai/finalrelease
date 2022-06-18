package cn.hs.service.impl;

import cn.hs.entity.Doctor;
import cn.hs.entity.Orders;
import cn.hs.entity.User;
import cn.hs.mapper.DoctorMapper;
import cn.hs.mapper.OrdersMapper;
import cn.hs.mapper.UserMapper;
import cn.hs.service.IDoctorService;
import cn.hs.utils.AjaxResult;
import cn.hutool.db.sql.Order;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;


@Service
public class DoctorServiceImpl extends ServiceImpl<DoctorMapper, Doctor> implements IDoctorService {

    private static ThreadLocal<DateFormat> simpleDateFormat = new ThreadLocal<DateFormat>() {
        @Override
        protected DateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd");
        }
    };

    @Resource
    private DoctorMapper doctorMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private OrdersMapper ordersMapper;


    @Transactional
    @Override
    public AjaxResult updateDoctor(Doctor doctor) {
        if (StringUtils.hasText(doctor.getUsername())){
            String username = doctor.getUsername();
            // 先看用户表是否存在此用户
            HashMap<String, Object> map = new HashMap<>();
            map.put("username",username);
            List<User> users = userMapper.selectByMap(map);
            if (users!=null && users.size()>0){
                return AjaxResult.error("用户名已存在！");
            }
            // 再看医生表是否存在此用户
            List<Doctor> doctors = doctorMapper.selectByMap(map);
            if (doctors!=null && doctors.size()>0){
                return AjaxResult.error("用户名已存在！");
            }
        }
        int i = doctorMapper.updateById(doctor);
        if (i==1){
            return AjaxResult.success("更新成功！");
        }
        return AjaxResult.error("更新失败！");
    }

    @Transactional
    @Override
    public AjaxResult delDoctor(Integer id) {
        int i = doctorMapper.deleteById(id);
        if (i==1){
            return AjaxResult.success("删除成功！");
        }
        return AjaxResult.error("删除失败！！");
    }

    @Override
    public AjaxResult queryDoctor(Integer pageNo, Integer pageSize) {
        IPage<Doctor> page = new Page<>(pageNo,pageSize);
        IPage<Doctor> doctorIPage = doctorMapper.selectPage(page, null);
        return AjaxResult.success(doctorIPage);
    }

    @Override
    public AjaxResult getPatient(String doctorId, Integer time) {
        HashMap<String, Object> stringObjectHashMap = new HashMap<>();
        String format = simpleDateFormat.get().format(new Date());
        HashMap<String, Object> map = new HashMap<>();
        map.put("date",format);
        map.put("time",time);
        map.put("doctor_id",doctorId);
        List<Orders> orders = ordersMapper.selectByMap(stringObjectHashMap);
        return AjaxResult.success(orders);
    }

    @Override
    public AjaxResult getPatientByDoctor(String doctorId,Integer pageNo, Integer pageSize) {
        Page<Orders> page = new Page<>(pageNo,pageSize);

        QueryWrapper<Orders> ordersQueryWrapper = new QueryWrapper<>();
        ordersQueryWrapper.eq("doctor_id",doctorId);
        Page<Orders> page1 = ordersMapper.selectPage(page, ordersQueryWrapper);
        return AjaxResult.success(page1);
    }
}
