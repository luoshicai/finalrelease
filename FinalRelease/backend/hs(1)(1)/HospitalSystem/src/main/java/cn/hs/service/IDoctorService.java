package cn.hs.service;

import cn.hs.entity.Doctor;
import cn.hs.utils.AjaxResult;
import com.baomidou.mybatisplus.extension.service.IService;


public interface IDoctorService extends IService<Doctor> {

    AjaxResult updateDoctor(Doctor doctor);

    AjaxResult delDoctor(Integer id);

    AjaxResult queryDoctor(Integer pageNo, Integer pageSize);

    AjaxResult getPatient(String doctorId, Integer time);

    AjaxResult getPatientByDoctor(String doctorId,Integer pageNo, Integer pageSize);
}
