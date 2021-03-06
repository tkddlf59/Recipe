
package com.recipe.service;

import com.recipe.domain.User;

public interface UserService {
  void addUser(User user) throws Exception;
  boolean checkDuplication(String email); // email 중복체크
  boolean checkDuplicationUserName(String userName); // 닉네임 중복체크
  String updateUser(User user) throws Exception; //유저정보수정(용이-완료)
  int deleteUser(int no);
  User loginUser(User user) throws Exception; //login
  User getFromEmail(String email);  
  int addUserInNaver(User user);
  void authUpdate(String authKEY, int auth, String inputEmail);//인증update
  void addHits(int userNo); //방문자수 증가
}