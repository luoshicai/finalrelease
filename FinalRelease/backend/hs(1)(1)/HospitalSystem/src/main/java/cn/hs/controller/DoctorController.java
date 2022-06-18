package cn.hs.controller;

import cn.hs.entity.Doctor;
import cn.hs.service.IDoctorService;
import cn.hs.service.IUserService;
import cn.hs.utils.AjaxResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;


@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Resource
    private IUserService userService;

    @Resource
    private IDoctorService doctorService;

    /**
     * 更新医生
     */
    @PostMapping("/updateDoctor")
    public AjaxResult updateDoctor(@RequestBody Doctor doctor){
        return doctorService.updateDoctor(doctor);
    }


    /**
     * 删除医生
     */
    @GetMapping("/delDoctor")
    public AjaxResult delDoctor(@RequestParam Integer id){
        return doctorService.delDoctor(id);
    }


    /**
     * 分页查询医生列表
     */
    @GetMapping("/queryDoctor")
    public AjaxResult queryDoctor(@RequestParam Integer pageNo,@RequestParam Integer pageSize){
        return doctorService.queryDoctor(pageNo,pageSize);
    }
    /**
     * 管理员注册医生
     */
    @PostMapping("/registerDoctor")
    public AjaxResult registerDoctor(@RequestBody Doctor doctor){
        return userService.registerDoctor(doctor);
    }


    @GetMapping("/getPatient")
    public AjaxResult getPatient(@RequestParam String doctorId,@RequestParam Integer time){
        return doctorService.getPatient(doctorId,time);

    }


    @GetMapping("/getPatientByDoctor")
    public AjaxResult getPatientByDoctor(@RequestParam String doctorId,@RequestParam Integer pageNo, @RequestParam Integer pageSize){
        return doctorService.getPatientByDoctor(doctorId,pageNo,pageSize);

    }

}
