package cn.hs.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;


@Data
@ToString
public class Doctor implements Serializable {

    private static final long serialVersionUID = 2L;

    /**
     * 医生id
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 医生姓名
     */
    private String username;

    /**
     * 医生密码
     */
    private String password;

    /**
     * 所属科室Id
     */
    private Integer departmentId;

    /**
     * 所属科室
     */
    private String department;

    /**
     * 职称
     */
    private String title;

    /**
     * 医生简介
     */
    private String info;

    /**
     * 医生图片
     */
    private String image;


}
