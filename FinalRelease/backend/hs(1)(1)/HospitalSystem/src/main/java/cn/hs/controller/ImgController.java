package cn.hs.controller;

import cn.hs.utils.AjaxResult;
import cn.hutool.core.lang.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@RestController
public class ImgController {

    @Value("${spring.resources.static-locations}")
    private String path;


    @PostMapping(value = "/pic/upload")
    public AjaxResult upload(@RequestParam("uploadFile") MultipartFile uploadFile) throws IOException {
        if (null == uploadFile) {
            return AjaxResult.error("上传失败，无法找到文件！");
        }
        // BMP、JPG、JPEG、PNG、GIF
        String fileName = uploadFile.getOriginalFilename().toLowerCase();
        if (!fileName.endsWith(".bmp") && !fileName.endsWith(".jpg")
                && !fileName.endsWith(".jpeg") && !fileName.endsWith(".png")
                && !fileName.endsWith(".gif") && !fileName.endsWith(".svg")){
            return AjaxResult.error("上传失败，请选择BMP、JPG、JPEG、PNG、GIF文件！");
        }
        InputStream inputStream = uploadFile.getInputStream();
        if (null == inputStream){
            return AjaxResult.error("上传文件失败，请检查上传的文件是否完整！");
        }
        //判断文件夹是否存在,不存在则创建
        if (StringUtils.isEmpty(path)){
            return AjaxResult.error("请检查服务端配置是否正确！");
        }
        String imgPath = path.substring(5);
        File file=new File(imgPath);
        if(!file.exists()){
            file.mkdirs();
        }
        String newFileName = UUID.randomUUID().toString(true)+fileName;
        String newFilePath=imgPath+newFileName; //新文件的路径
        try {
            uploadFile.transferTo(new File(newFilePath));//将传来的文件写入新建的文件
            return AjaxResult.success("图片上传成功！",newFileName);
        }catch (IllegalStateException e ) {
            //处理异常
            throw e;
        }catch(IOException e1){
            //处理异常
            throw e1;
        }
    }

}
