package cn.hs.mapper;

import cn.hs.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;


public interface UserMapper extends BaseMapper<User> {

    void setUserWYByUserId(@Param("userId") Integer userId);
}
