package cn.hs.service;

import cn.hs.entity.Doctor;
import cn.hs.entity.User;
import cn.hs.utils.AjaxResult;
import com.baomidou.mybatisplus.extension.service.IService;


public interface IUserService extends IService<User> {

    AjaxResult register(User user);

    AjaxResult login(User user);

    AjaxResult registerDoctor(Doctor doctor);

    AjaxResult getDetail(Integer id);
}
