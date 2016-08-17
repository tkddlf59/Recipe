package com.recipe.controller.json;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.recipe.domain.Visitor;
import com.recipe.service.VisitorService;

@Controller
@RequestMapping("/visitor/")
public class VisitorController {
  @Autowired VisitorService visitorService;

  @RequestMapping(path="list", produces="application/json;charset=UTF-8")
  @ResponseBody
  public String list(@RequestParam(defaultValue="1")int pageNo, 
      @RequestParam(defaultValue="10")int pageSize){

    HashMap<String,Object> result = new HashMap<>();
    try{
      List<Visitor> list = visitorService.getVisitorList(pageNo, pageSize);
      result.put("status", "success");
      result.put("data", list);
    }catch(Exception e){
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }

  @RequestMapping(path="add", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
  @ResponseBody
  public String add(Visitor visitor){    
    HashMap<String,Object> result = new HashMap<>();
    try{
      visitorService.addVisitor(visitor);
      result.put("status", "success");      
    }catch(Exception e){
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }
  
  @RequestMapping(path="detail", 
      produces="application/json;charset=UTF-8")
  @ResponseBody
  public String detail(int no){        
    HashMap<String,Object> result = new HashMap<>();
    try{      
      result.put("status", "success");
      result.put("data", visitorService.getVisitor(no));
    }catch(Exception e){
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }

  @RequestMapping(path="update", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
  @ResponseBody
  public String update(Visitor visitor){    
    HashMap<String,Object> result = new HashMap<>();
    try{
      visitorService.updateVisitor(visitor);
      result.put("status", "success");      
    }catch(Exception e){
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }
  
  @RequestMapping(path="delete", produces="application/json;charset=UTF-8")
  @ResponseBody
  public String delete(int no){    
    System.out.println("vno="+no);
    HashMap<String,Object> result = new HashMap<>();
    try{
      visitorService.deleteVisitor(no);
      result.put("status", "success");      
    }catch(Exception e){
      e.printStackTrace();
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }
  
}