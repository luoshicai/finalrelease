package cn.hs.controller;

import cn.hs.entity.Doctor;
import cn.hs.entity.User;
import cn.hs.service.IUserService;
import cn.hs.utils.AjaxResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;


@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private IUserService userService;

    /**
     * 普通用户注册接口
     */
    @PostMapping("/register")
    public AjaxResult register(@RequestBody User user){
        return userService.register(user);
    }

    /**
     * 用户登录接口
     */
    @PostMapping("/login")
    public AjaxResult login(@RequestBody User user){
        return userService.login(user);
    }

    /**
     * 获取用户详细信息
     */
    @GetMapping("/getDetail")
    public AjaxResult getDetail(@RequestParam Integer id){
        return userService.getDetail(id);
    }


}
