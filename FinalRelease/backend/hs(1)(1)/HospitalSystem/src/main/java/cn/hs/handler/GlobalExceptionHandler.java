package cn.hs.handler;


import cn.hs.utils.AjaxResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler
    public AjaxResult gloableExceptionProcess(Exception e){
        return AjaxResult.error(e.getMessage());
    }

}
