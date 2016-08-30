$(function() {
	function getImageURL(imageFile) {
		return URL.createObjectURL(imageFile);
	}

	function getRecipeEditInfo(){
		$.ajax({
			url : 'recipe/recipeDetail.json',
			method : 'post',
			data : {
				recipeNo : recipeNo
			},
			dataType : 'json',
			success : function(result) {
				if (result.status != 'success') {
					swal('레시피 정보를 가져오는데 실패하였습니다.');
					return;
				}
				var recipeData = result.data;
				var recipeMaterials = result.materials;

				$('input[name="recipeNo"]').val(recipeData.recipeNo);
				$('#recipeName').val(recipeData.recipeName);
				$('#recipeName').val(recipeData.recipeName);
				$('#portion').val(recipeData.portion);
				$('#cookTime').val(recipeData.cookTime);
				$('#intro').val(recipeData.intro);
				console.log(recipeData.representImages);
				$('#representImgs').append(rpImageTempImpl(recipeData));
				$('#files').append(rcpProduceTempImpl(recipeData));

				$.each(
						recipeMaterials,
						function(index) {
							var appendContent = $('<div class="mtWrapper"><div class="mtName float_left">'
									+ recipeMaterials[index].materialName
									+ '</div>'
									+ '<div class="float_left">&nbsp;:&nbsp;</div>'
									+ '<div class="float_left mtAmount"><input name="materialAmount" type="text" placeholder="분량 (예:400g)" /></div>'
									+ '<input type="hidden" name="materialNo" value="'
									+ recipeMaterials[index].materialNo
									+ '">'
									+ '<a href="#"><span class="closeBtn mtClose thick"></span></a>'
									+ '</div>');

							if (recipeMaterials[index].materialStatement == '1') {
								$('#materialList').append(
										appendContent);
							} else {
								$('#seasoningList').append(
										appendContent);
							}

						});

				$('#addBtn').text('수정');
				$('#addBtn')
				.attr('id', 'updateBtn');
				$('#addRecipe').attr('action',
				'recipe/updateRecipe.json');
				$('#addRecipe').attr('id',
				'updateRecipe');

				$("#updateRecipe").submit(function(event) {
					var formData = new FormData(this);
					var formURL = $(this).attr("action");

					if (imageList.length > 0) {
						console.log("multi file submit");
						event.preventDefault();
						$('#fileupload').fileupload('send', {
							files : imageList
						});
					}
				});
			},
			error : function() {
				swal('서버 요청 오류');
			}
		});
	}

	var imageList = new Array();

	var recipeNo = location.href.split('?')[1];
	var rpImageTemp = $('#represent-image-template').html();
	var rpImageTempImpl = Handlebars.compile(rpImageTemp);
	var rcpProduceTemp = $('#recipe-produce-template').html();
	var rcpProduceTempImpl = Handlebars.compile(rcpProduceTemp);

	if (recipeNo != null) {
		$.ajax({
			url : 'recipe/checkMyRecipe.json',
			method : 'post',
			data : {
				recipeNo : recipeNo
			},
			dataType : 'json',
			success : function(result) {
				
				if (result.status == 'nologin') {
					swal({
						title : "로그인 후 사용하실 수 있습니다.",
						type : "warning",
						confirmButtonClass : "btn-danger",
						confirmButtonText : "확인",
						closeOnConfirm : false
					}, function(isConfirm) {
						location.href = "index.html"
					});
					return;
				}
				
				if (result.status != 'success') {
					swal({
						title : "레시피 권한이 없습니다.",
						type : "warning",
						confirmButtonClass : "btn-danger",
						confirmButtonText : "확인",
						closeOnConfirm : false
					}, function(isConfirm) {
						history.go(-1)();
					});
					return;
				} else {
					getRecipeEditInfo();
				}
			},
			error : function() {
				swal('서버 요청 오류');
			}
		});
	}

	$(document).on('click', '#updateBtn', function() {
		$("#updateRecipe").submit();
	});

	var options = {
			url : function(phrase) {
				console.log(phrase);
				return "recipe/materialSearch.json?searchValue=" + phrase;
			},

			getValue : function(element) {
				return element.name;
			},

			ajaxSettings : {
				dataType : "json",
				method : "GET"
			},
			requestDelay : 400,

			categories : [ { // Category fruits
				listLocation : "foodstuff",
				header : "-- 식재료 --"
			}, { // Category vegetables
				listLocation : "seasoning",
				header : "-- 조미료 --"
			} ],
			list : {
				showAnimation : {
					type : "slide", // normal|slide|fade
					time : 200
				},

				hideAnimation : {
					type : "slide", // normal|slide|fade
					time : 200
				},
				onChooseEvent : function() {
					var name = $('input[name="materialName"]')
					.getSelectedItemData().name;
					var no = $('input[name="materialName"]').getSelectedItemData().no;
					var category = $('input[name="materialName"]')
					.getSelectedItemData().category;
					var existMt = $('input[name="materialNo"]');

					var appendContent = $('<div class="mtWrapper"><div class="mtName float_left">'
							+ name
							+ '</div>'
							+ '<div class="float_left">&nbsp;:&nbsp;</div>'
							+ '<div class="float_left mtAmount"><input name="materialAmount" type="text" placeholder="분량 (예:400g)" /></div>'
							+ '<input type="hidden" name="materialNo" value="'
							+ no
							+ '">'
							+ '<a href="#"><span class="closeBtn mtClose thick"></span></a>'
							+ '</div>');

					for (i = 0; i < existMt.length; i++) {
						if ($(existMt[i]).val() == no) {
							alert('재료를 중복으로 등록하실 수 없습니다.');
							return;
						}
					}

					if (category == '1') {
						$('#materialList').append(appendContent);
					} else {
						$('#seasoningList').append(appendContent);
					}
				}
			}
	};

	$('input[name="materialName"]').easyAutocomplete(options);
	
	'use strict';

	$("#representImgs").sortable({
		revert : true,
		containment : 'parent',
		tolerance : 'representImgs',
		axis : 'x'
	});

	$("#files").sortable({
		revert : true
	});
	$("#files").disableSelection();

	// 대표사진등록관련 js
	$('#representImage')
	.fileupload(
			{
				dataType : 'json',
				autoUpload : false,
				acceptFileTypes : /(\.|\/)(gif|jpe?g|png)$/i,
				disableImageResize : /Android(?!.*Chrome)|Opera/
					.test(window.navigator.userAgent),
					previewMaxWidth : 150,
					previewMaxHeight : 150,
					previewCrop : true,
					dropZone : $('#representImgDropzone')
			})
			.on(
					'fileuploadadd',
					function(e, data) {
						data.context = $('<div class="scroll width_180px"/>')
						.appendTo('#representImgs');
						$
						.each(
								data.files,
								function(index, file) {
									if (imageDuplicationCheck(data.files[index])) {
										imageList
										.push(data.files[index]);
									}
									var close = $('<a href="#"><span class="closeBtn thick rpImg"></span></a>');
									var fileNameTag = $('<input type="hidden" name="representImgNames">');
									var img = $('<img class="preview"/>');
									img
									.attr(
											'src',
											getImageURL(data.files[index]));
									var imageWrapper = $('<span/>')
									.append(img);
									fileNameTag
									.attr(
											'value',
											data.files[index].name
											+ "/"
											+ data.files[index].size);
									imageWrapper.appendTo(data.context);
									close.appendTo(data.context);
									fileNameTag.appendTo(data.context);
								});
					});

	// 조리과정 js
	$('#fileupload')
	.fileupload(
			{
				dataType : 'json',
				autoUpload : false,
				acceptFileTypes : /(\.|\/)(gif|jpe?g|png)$/i,
				disableImageResize : /Android(?!.*Chrome)|Opera/
					.test(window.navigator.userAgent),
					previewMaxWidth : 150,
					previewMaxHeight : 150,
					previewCrop : true,
					dropZone : $('#dropzone')
			})
			.on(
					'fileuploadadd',
					function(e, data) {
						data.context = $('<div/>').appendTo('#files');
						$
						.each(
								data.files,
								function(index, file) {
									if (imageDuplicationCheck(data.files[index])) {
										imageList
										.push(data.files[index]);
										console.log(imageList);
									}
									var node = $('<div class="row padding_10px"/>');
									var close = $('<a href="#"><div class="float_left closeBtn thick pdImg"></div></a>');
									var img = $('<img class="preview"/>');
									img
									.attr(
											'src',
											getImageURL(data.files[index]));
									var imageWrapper = $(
									'<div class="float_left margin_right_10px"/>')
									.append(img);
									var textarea = $(
									'<div class="height_150px float_left"/>')
									.append(
											$('<textarea name="recipeProduce" class="height_150px" placeholder="조리과정을 설명해주세요."/>'));
									var fileNameTag = $('<input type="hidden" name="produceImgNames">');
									fileNameTag
									.attr(
											'value',
											data.files[index].name
											+ "/"
											+ data.files[index].size);
									imageWrapper.appendTo(node);
									textarea.appendTo(node);
									close.appendTo(node);
									node.appendTo(data.context);
									fileNameTag.appendTo(data.context);
								});
					}).on('fileuploaddone', function(e, data) {

						if (data.result.status == 'success') {
							history.go(-1)();
						} else {
							swal('레시피 등록 실패');
						}
						console.log(data.result.status)

					}).on('fileuploadfail', function(e, data) {

						console.log(data)

					}).prop('disabled', !$.support.fileInput).parent().addClass(
							$.support.fileInput ? undefined : 'disabled');

	$('.inputbox').on('change', function() {
		var input = $(this);
		if (input.val().length) {
			input.addClass('populated');
		} else {
			input.removeClass('populated');
		}
	});

	$("#addRecipe").submit(function(event) {
		var formData = new FormData(this);
		var formURL = $(this).attr("action");

		if (imageList.length > 0) {
			console.log("multi file submit");
			event.preventDefault();
			$('#fileupload').fileupload('send', {
				files : imageList
			});
		}
	});
	// if(eval(sessionStorage.getItem('data'))[0].userNo!=null){
	// $('userNo').val(eval(sessionStorage.getItem('data'))[0].userNo);
	// } else {
	// swal('로그인 하고 오세욤 ㅎㅎ');
	// location = "index.html";
	// }

	function imageDuplicationCheck(file) {
		if (imageList.length > 0) {
			for (i = 0; i < imageList.length; i++) {
				if (file.name == imageList[i].name
						&& file.size == imageList[i].size
						&& file.lastModified == imageList[i].lastModified) {
					// return false;
					return false;
				}
			}
			return true;
		} else {
			return true;
		}
	}

	$('input').each(function() {
		$(this).on('focus', function() {
			$(this).parent('.inputwrapper').addClass('active');
			$(this).parent().parent('.inputwrapper').addClass('active');
		});
		$(this).on('blur', function() {
			if ($(this).val().length == 0) {
				$(this).parent('.inputwrapper').removeClass('active');
				$(this).parent().parent('.inputwrapper').removeClass('active');
			}
		});
		if ($(this).val() != '') {
			$(this).parent('.inputwrapper').addClass('active');
			$(this).parent().parent('.inputwrapper').removeClass('active');
		}
	});

	$(document).on('click', '.rpImg', function(event) {
		event.preventDefault();
		$(this).parent().parent('.scroll').remove();
	});

	$(document).on('click', '.rpImgRemove', function(event) {
		event.preventDefault();

		$.ajax({
			url : 'recipe/imageDelete.json',
			method : 'post',
			data : {
				category : 'representImg',
				imageName : $(event.target).next().val()
			},
			dataType : 'json',
			success : function(result) {
				if (result.status != 'success') {
					swal('레시피 정보를 가져오는데 실패하였습니다.');
					return;
				}
				var recipeData = result.data;
				console.log(recipeData);

				$('#recipeName').val(recipeData.recipeName);
				$('#portion').val(recipeData.portion);
				$('#cookTime').val(recipeData.cookTime);
				$('#intro').val(recipeData.intro);
				console.log(recipeData.representImages);
				$('#representImgs').append(rpImageTempImpl(recipeData));

			},
			error : function() {
				swal('서버 요청 오류');
			}
		});

		$(this).parent().parent('.scroll').remove();
	});

	$(document).on('click', '.pdImg', function(event) {
		event.preventDefault();
		$(this).parent().parent().parent().remove();
	});

	$(document).on('click', '.mtClose', function(event) {
		event.preventDefault();
		$(this).parent().parent().remove();
	});

	$('#addBtn').on('click', function() {
		if ($('input[name="recipeName"]').val().length < 1) {
			swal('레시피 제목을 입력해주세요.');
			return;
		} else if ($('#portion').val().length < 1) {
			swal('몇 인분인지 입력해주세요.');
			return;
		} else if ($('#cookTime').val().length < 1) {
			swal('조리시간을 입력해주세요.');
			return;
		} else if ($('input[name="intro"]').val().length < 1) {
			swal('요리설명을 입력해주세요.');
			return;
		} else if ($('input[name="representImgNames"]').length < 1) {
			swal('대표사진을 등록해주세요.');
			return;
		} else if ($('input[name="materialNo"]').length < 1) {
			swal('재료를 등록해주세요.');
			return;
		} else if ($('input[name="produceImgNames"]').length < 1) {
			swal('조리과정을 등록해주세요.');
			return;
		} else {
			var materialAmount = $('input[name="materialAmount"]');
			var recipeProduce = $('textarea[name="recipeProduce"]');

			for (i = 0; i < materialAmount.length; i++) {
				if ($(materialAmount[i]).val().length < 1) {
					swal('재료의 분량을 입력해주세요.');
					return;
				}
			}

			for (i = 0; i < recipeProduce.length; i++) {
				if ($(recipeProduce[i]).val().length < 1) {
					swal((i + 1) + '번 조리과정을 입력해주세요.');
					return;
				}
			}
		}

		$('#addRecipe').submit();
	});

	$('#imAddBtn').on('click', function() {
		$('input[name="regiStatus"]').val("1");
		$('#addRecipe').submit();
	});

	var cookTimeSlider = $("#cookTime-slider").slider({
		range : "max",
		min : 1,
		max : 300,
		slide : function(event, ui) {
			$("#cookTime").val(ui.value);
		}
	});
	$("#cookTime").on("keyup", function() {
		cookTimeSlider.slider("value", this.value);
	});

	$("#cookTime").val($("#cookTime-slider").slider("value"));

	$(".accordion").accordion({
		collapsible : true
	});

	var spinner = $("#portion").spinner({
		min : 1
	});
});
