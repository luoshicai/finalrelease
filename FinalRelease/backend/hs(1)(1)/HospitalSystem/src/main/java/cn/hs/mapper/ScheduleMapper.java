package cn.hs.mapper;

import cn.hs.entity.Schedule;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;


public interface ScheduleMapper extends BaseMapper<Schedule> {

    Integer updateFirstTime(@Param("date") String date, @Param("doctorId") Integer doctorId);

    Integer updateSencodTime(@Param("date") String date, @Param("doctorId") Integer doctorId);

    Integer updateThreeTime(@Param("date") String date, @Param("doctorId") Integer doctorId);

    Integer updateFourTime(@Param("date") String date, @Param("doctorId") Integer doctorId);
}
