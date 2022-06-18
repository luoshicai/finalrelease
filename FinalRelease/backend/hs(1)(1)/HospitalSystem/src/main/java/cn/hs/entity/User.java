package cn.hs.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
public class User implements Serializable {

    private static final long serialVersionUID = 5L;

    /**
     * 登录账号id
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 账户名（最高6位）
     */
    private String username;

    /**
     * 登录密码(不超过10位)
     */
    private String password;

    /**
     * 用户身份 1、患者 2管理员
     */
    private Integer identity;

    /**
     * 性别：1 男 2 女
     */
    private Integer gender;

    /**
     * 电话号码
     */
    private String tel;

    /**
     * 邮箱
     */
    private String mail;

    /**
     * 违约次数
     */
    private Integer weiyue;

    /**
     * 0 系统管理员
     * 1 医生
     * 2 用户
     */
    @TableField(exist = false)
    private Integer roleId;
}
