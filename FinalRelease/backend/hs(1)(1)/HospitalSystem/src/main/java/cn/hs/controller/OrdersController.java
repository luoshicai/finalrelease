package cn.hs.controller;

import cn.hs.entity.Doctor;
import cn.hs.entity.Orders;
import cn.hs.entity.bo.ApplyNoBO;
import cn.hs.service.IOrdersService;
import cn.hs.utils.AjaxResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;


@RestController
@RequestMapping("/orders")
public class OrdersController {

    @Resource
    private IOrdersService ordersService;

    /**
     * 挂号
     */
    @PostMapping("/applyNo")
    public AjaxResult applyNo(@RequestBody ApplyNoBO applyNoBO){
        return ordersService.applyNo(applyNoBO);
    }


    /**
     * 更新用户挂号信息
     */
    @PostMapping("/update")
    public AjaxResult update(@RequestBody Orders orders){
        return ordersService.updateByCustom(orders);
    }

    /**
     * 取消挂号
     */
    @GetMapping("/cancel")
    public AjaxResult cancel(@RequestParam Integer id){
        return ordersService.cancel(id);
    }

    /**
     * 查询挂号详情
     */
    @GetMapping("/queryDetail")
    public AjaxResult queryDetail(@RequestParam Integer id){
        return ordersService.queryDetail(id);
    }

    /**
     * 查询历史订单
     */
    @GetMapping("/queryHistory")
    public AjaxResult queryHistory(@RequestParam Integer userId){
        return ordersService.queryHistory(userId);
    }

    /**
     * 查询待就诊
     */
    @GetMapping("/queryFuture")
    public AjaxResult queryFuture(@RequestParam Integer userId){
        return ordersService.queryFuture(userId);
    }


    /**
     * 查询全部订单
     */
    @GetMapping("/queryAll")
    public AjaxResult queryAll(@RequestParam Integer userId){
        return ordersService.queryAll(userId);
    }
    /**
     * 用户预约时间未到 医生标记违约
     */
    @GetMapping("/setUserFlag")
    public AjaxResult setUserFlag(@RequestParam Integer userId,@RequestParam Integer orderId){
        return ordersService.setUserFlag(userId,orderId);
    }

}
