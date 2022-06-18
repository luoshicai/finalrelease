package cn.hs.mapper;

import cn.hs.entity.Orders;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


public interface OrdersMapper extends BaseMapper<Orders> {

    List<Orders> queryHistory(@Param("userId") Integer userId);
}
