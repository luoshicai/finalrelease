package cn.hs.service;

import cn.hs.entity.Orders;
import cn.hs.entity.bo.ApplyNoBO;
import cn.hs.utils.AjaxResult;
import com.baomidou.mybatisplus.extension.service.IService;


public interface IOrdersService extends IService<Orders> {

    AjaxResult applyNo(ApplyNoBO applyNoBO);

    AjaxResult cancel(Integer id);

    AjaxResult queryDetail(Integer id);

    AjaxResult queryHistory(Integer userId);

    AjaxResult queryFuture(Integer userId);

    AjaxResult updateByCustom(Orders orders);

    AjaxResult setUserFlag(Integer userId, Integer orderId);

    AjaxResult queryAll(Integer userId);
}
