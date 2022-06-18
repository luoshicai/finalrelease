package cn.hs.service.impl;

import cn.hs.common.CustomException;
import cn.hs.entity.Doctor;
import cn.hs.entity.Orders;
import cn.hs.entity.bo.ApplyNoBO;
import cn.hs.mapper.*;
import cn.hs.service.IOrdersService;
import cn.hs.utils.AjaxResult;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;


@Service
public class OrdersServiceImpl extends ServiceImpl<OrdersMapper, Orders> implements IOrdersService {

    @Resource
    private OrdersMapper ordersMapper;

    @Resource
    private ScheduleMapper scheduleMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private DepartmentMapper departmentMapper;

    @Resource
    private DoctorMapper doctorMapper;



    private Lock lock = new ReentrantLock();


    @Override
    @Transactional
    public AjaxResult applyNo(ApplyNoBO applyNoBO) {
        Integer userId = applyNoBO.getUserId();
        Integer time = applyNoBO.getTime();
        String date = applyNoBO.getDate();
        Integer doctorId = applyNoBO.getDoctorId();
        HashMap<String, Object> map = new HashMap<>();
        map.put("date",date);
        map.put("user_id",userId);
        map.put("time",time);
        map.put("state",1);
        // 根据map中的条件去查询数据库中是否有同一天的同一时间段且状态为待就诊的记录，若有则提示错误！
        List<Orders> orders1 = ordersMapper.selectByMap(map);
        if (orders1!=null && orders1.size()>0){
            return AjaxResult.error("你在此时间段已经预约挂号了！请不要重复预约挂号");
        }
        // 加锁
        lock.lock();
        Integer isSucc = 0;
        // 更新schedule中的剩余数量
        if (time==1){
            isSucc = scheduleMapper.updateFirstTime(date,doctorId);
        }
        if (time==2){
            isSucc = scheduleMapper.updateSencodTime(date,doctorId);
        }
        if (time==3){
            isSucc = scheduleMapper.updateThreeTime(date,doctorId);
        }
        if (time==4){
            isSucc = scheduleMapper.updateFourTime(date,doctorId);
        }
        if (isSucc==1){
            Orders orders = new Orders();
            orders.setDate(date);
            orders.setDoctorId(doctorId);
            orders.setProcess(1);
            orders.setState(1);
            orders.setTime(time);
            orders.setUserId(userId);
            // 插入新纪录
            int insert = 0;
            try {
                insert = ordersMapper.insert(orders);
            }catch (Exception e){
                throw new CustomException("插入数据失败！");
            }finally {
                lock.unlock();
            }

            if (insert==1){
                return AjaxResult.success();
            }else{
                // 若插入失败 则回滚
                throw new CustomException("预约挂号失败！");
            }
        }else{
            lock.unlock();
            return AjaxResult.error("预约挂号失败！余量不足！");
        }

    }

    @Override
    @Transactional
    public AjaxResult cancel(Integer id) {
        Orders orders = new Orders();
        orders.setId(id);
        orders.setState(3);
        int update = ordersMapper.updateById(orders);
        if (update==1){
            return AjaxResult.success("取消挂号成功！");
        }
        return AjaxResult.error("取消挂号失败！");
    }

    @Override
    public AjaxResult queryDetail(Integer id) {
        Orders orders = ordersMapper.selectById(id);
        return AjaxResult.success(orders);
    }

    @Override
    public AjaxResult queryHistory(Integer userId) {
        List<Orders> orders = ordersMapper.queryHistory(userId);
        for (Orders order : orders) {
            Integer doctorId = order.getDoctorId();
            Doctor doctor = doctorMapper.selectById(doctorId);
            order.setDepartmentId(doctor.getDepartmentId());
        }
        return AjaxResult.success(orders);
    }

    @Override
    public AjaxResult queryFuture(Integer userId) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("user_id",userId);
        map.put("state",1);
        List<Orders> orders = ordersMapper.selectByMap(map);
        for (Orders order : orders) {
            Integer doctorId = order.getDoctorId();
            Doctor doctor = doctorMapper.selectById(doctorId);
            order.setDepartmentId(doctor.getDepartmentId());
        }
        return AjaxResult.success(orders);
    }

    @Override
    @Transactional
    public AjaxResult updateByCustom(Orders orders) {
        int update = ordersMapper.updateById(orders);
        if (update==1){
            return AjaxResult.success();
        }
        return AjaxResult.error();
    }

    @Override
    @Transactional
    public AjaxResult setUserFlag(Integer userId, Integer orderId) {
        Orders orders = new Orders();
        orders.setId(orderId);
        orders.setState(4);
        ordersMapper.updateById(orders);
        userMapper.setUserWYByUserId(userId);
        return AjaxResult.success();
    }

    @Override
    public AjaxResult queryAll(Integer userId) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("user_id",userId);
        List<Orders> orders = ordersMapper.selectByMap(map);
        for (Orders order : orders) {
            Integer doctorId = order.getDoctorId();
            Doctor doctor = doctorMapper.selectById(doctorId);
            if (doctor!=null) {
                order.setDepartmentId(doctor.getDepartmentId());
            }
        }
        return AjaxResult.success(orders);
    }
}
