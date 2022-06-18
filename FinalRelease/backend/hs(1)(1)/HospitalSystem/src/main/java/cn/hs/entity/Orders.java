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
public class Orders implements Serializable {

    private static final long serialVersionUID = 3L;

    /**
     * 订单号
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 预约挂号日期
     */
    private String date;

    /**
     * 挂号所属用户
     */
    private Integer userId;

    /**
     * 订单挂号医生
     */
    private Integer doctorId;

    /**
     * 预约状态：1、待就诊2、已就诊3、取消,4、未到违约
     */
    private Integer state;

    /**
     * 病历（医生每次结束某一流程都要覆盖写病历）
     */
    private String info;

    /**
     * 标记患者处在六个就诊步骤中的哪一个
     */
    private Integer process;

    /**
     * 预约具体时间段（1，2，3，4）
     */
    private Integer time;


    @TableField(exist = false)
    private Integer departmentId;


}
