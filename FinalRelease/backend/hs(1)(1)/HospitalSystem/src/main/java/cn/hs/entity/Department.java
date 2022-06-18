package cn.hs.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;


@Data
@ToString
public class Department implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 科室ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 科室名称
     */
    private String name;

    /**
     * 科室联系电话
     */
    private String telephone;

    /**
     * 科室介绍
     */
    private String introduction;

    /**
     * 就诊流程1,由管理员设置
     */
    private String process1;

    /**
     * 就诊流程2
     */
    private String process2;

    private String process3;

    private String process4;

    private String process5;

    private String process6;


}
