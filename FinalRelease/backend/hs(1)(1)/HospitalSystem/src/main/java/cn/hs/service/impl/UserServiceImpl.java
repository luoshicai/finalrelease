package cn.hs.service.impl;

import cn.hs.entity.Doctor;
import cn.hs.entity.User;
import cn.hs.enums.RoleTypeEnum;
import cn.hs.mapper.DoctorMapper;
import cn.hs.mapper.UserMapper;
import cn.hs.service.IUserService;
import cn.hs.utils.AjaxResult;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;


import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;


@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    @Resource
    private UserMapper userMapper;

    @Resource
    private DoctorMapper doctorMapper;


    @Override
    @Transactional
    public AjaxResult register(User user) {
        String username = user.getUsername();
        // 先看用户表是否存在此用户
        HashMap<String, Object> map = new HashMap<String, Object>();
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
        user.setIdentity(1);
        user.setWeiyue(0);
        int insert = userMapper.insert(user);
        if (insert==1){
            return AjaxResult.success("注册成功！");
        }
        return AjaxResult.error("注册失败！");
    }


    @Override
    @Transactional
    public AjaxResult registerDoctor(Doctor doctor) {
        String username = doctor.getUsername();
        // 先看用户表是否存在此用户
        HashMap<String, Object> map = new HashMap<String, Object>();
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

        int insert = doctorMapper.insert(doctor);
        if (insert==1){
            return AjaxResult.success("注册成功！");
        }
        return AjaxResult.error("注册失败！");
    }

    @Override
    public AjaxResult getDetail(Integer id) {
        User user = userMapper.selectById(id);
        return AjaxResult.success(user);
    }


    @Override
    public AjaxResult login(User user) {
        Integer roleId = user.getRoleId();
        String username = user.getUsername();
        String tel = user.getTel();
        String password = user.getPassword();
        if (roleId==null || !StringUtils.hasText(username) || !StringUtils.hasText(password)){
            return AjaxResult.error("错误的登录信息！");
        }

        HashMap<String, Object> map1 = new HashMap<>();
        map1.put("password",password);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("roleId",roleId);

        // 登录角色：医生
        if (roleId == RoleTypeEnum.DOCTOR.getValue()){
            map1.put("username",username);
            List<Doctor> doctors = doctorMapper.selectByMap(map1);
            if (doctors==null || doctors.size()<=0){
                return AjaxResult.error("用户名或密码错误！");
            }else{
                Doctor doctor = doctors.get(0);
                jsonObject.put("username",doctor.getUsername());
                jsonObject.put("id",doctor.getId());
                jsonObject.put("departmentId",doctor.getDepartmentId());
            }
        }else{
            map1.put("tel",tel);
            map1.put("identity",roleId);
            List<User> users = userMapper.selectByMap(map1);
            if (users==null || users.size()<=0){
                return AjaxResult.error("用户名或密码或角色选择错误！");
            }
            User user1 = users.get(0);
            jsonObject.put("username",user1.getUsername());
            jsonObject.put("id",user1.getId());
            Integer weiyue = user1.getWeiyue();
            if (weiyue>3){
                return AjaxResult.error("违约已超三次，禁止登录！");
            }
        }

        return AjaxResult.success("登录成功！",jsonObject);

    }
}
