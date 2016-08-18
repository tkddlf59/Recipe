package com.recipe.dao;

import java.util.List;
import java.util.Map;

import com.recipe.domain.Recipe;

public interface RecipeDao {
  int insert(Map map); // Create
  void insertMaterials(Map map); // Create
  int insertImageAndProduce(Map map);
  
  List<Recipe> recipeList(Map<String,Object> params); // Read or Retrieve
  List<Recipe> recipeList2(Map<String,Object> params); // Read or Retrieve
  List<Recipe> recipeSearch(Map<String,Object> params); //Search 성현
  int recipeCount(Map<String,Object> params); //Recipe Count 성현
  List<Recipe> selectSubscribeUno(int userNo); //subscribe 고재
  List<Recipe> selectSbuscribe(String userNo); //subscribe 고재
  Recipe selectOne(int recipeNo); // Read or Retrieve
  int update(Recipe recipe); // Update
  int updateHits(Recipe recipe);
  int delete(int no); // Delete
  List<String> selectMaterialName(String materialName);
  int likeUp(Recipe recipe);
  void likeDown(Recipe recipe);
  int addScrap(Map<String, Object> Numbers);
}
