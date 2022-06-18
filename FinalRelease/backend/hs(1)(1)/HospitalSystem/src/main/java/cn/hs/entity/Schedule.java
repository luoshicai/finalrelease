package cn.hs.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@ToString
public class Schedule implements Serializable {

    private static final long serialVersionUID = 4L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 排班日期
     */
    private String date;

    /**
     * 医生id
     */
    private Integer doctorId;

    /**
     * 医生姓名
     */
    private String doctorName;

    /**
     * 排班时间段1
     */
    private Integer time1;

    /**
     * 排班时间段2
     */
    private Integer time2;

    /**
     * 排班时间段3
     */
    private Integer time3;

    /**
     * 排班时间段4
     */
    private Integer time4;

    private Integer doctorState;

    @TableField(exist = false)
    private String department;

    @TableField(exist = false)
    private String image;

    @TableField(exist = false)
    private String info;

    private Integer departmentId;

}
