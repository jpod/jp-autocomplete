/*
Author : Agung Nugroho
Copyright 2012
Requirement jquery tmpl ( google.com )
*/

/*
How to use ?
$('#id').yping({
	minchar: 3,
	url: 'url_specified',
	tpl: "<h2><b>${id}</b></h2><h3>${value}</h3>",
	dataPush: { 'per_page':10 },
	onSelect:function(data){
		$('#id').val(data.id);
		// you can spesific other elemen
	}
});
*/

(function( $ ){
		
	
		$.fn.yping = function(options,method) {
			
			
			
			var defaults = {
				minchar: 2, // default
				url: null,
				dataPush:[],
				tpl: "<h2><b>${nip}</b></h2><h3>${nama}</h3>",
				onSelect:function(data){ },
				onClose:function(id){ },
				onClick: function(id){ },
				close:function(id){ $(id).remove();	}
			};
			
			var options = jQuery.extend(defaults, options);
			
			return this.each(function() {
				  var o =options;
				  var obj = $(this);
				  var $obj_json = $.parseJSON("");
				  var $nLength = $(this).val().length;
				  var isTrigger = 0;
				  
				  $(this).parents().on({
						'keyup':function(e){
							if(e.which==27){
								o.close($('#jp-yping'));
							}	
						},
						'click':function(){
							//o.close($('#jp-yping'));
						}
				  });
				  
				  /*
				  $('#jp-yping-ft').on('click',function(e){
					e.stopPropagation();
				  });
				  */				  
				  
				  $(this).on({
					'keyup':function(ev){
						
						if(ev.which!=13){
							if($nLength!=$(this).val().length || isTrigger==1){
								isTrigger = 0;
								
								$nLength = $(this).val().length;
								if($(this).val().length>=o.minchar){
								
									var place = o.dataPush;
									var places = { 'keyword': obj.val() };
									var dataPush_ = $.extend(place,places);
									$.ajax({
										type:'post',
										beforeSend:function(){
											obj.addClass("obj-loading");
										},
										url: o.url,
										data: dataPush_,
										success: function(response){
											obj.removeClass("obj-loading");
											$('#jp-yping').remove();
											obj.after("<div id='jp-yping'>");
											var ui_yping = $('#jp-yping');
											ui_yping.css({
												display: 'block',
												zIndex: 9999,
												//left: 0, //obj.offset().left,
												top: obj.offsetTop
											});
											ui_yping.append("<div id='jp-yping-inner'>");
											ui_yping.append("<div id='jp-yping-ft'>");
											var ui_yping_inner = $('#jp-yping-inner');
											var ui_yping_ft = $('#jp-yping-ft');
											
											//var json = '{"result":5,"rows":[{"nip":"0686.11.2007.339","nama":"NGURAH PANDJI MERTHA AGUNG DURYA, SE, M.Si","staf_id":"133"},{"nip":"0686.12.1997.112","nama":"AGUNG WARDOYO, S.Kom","staf_id":"190"},{"nip":"0686.12.2001.257","nama":"AGUNG NUGROHO, S.Kom","staf_id":"250"},{"nip":"0686.20.2009.370","nama":"AGUNG SEDAYU, SE, MM","staf_id":"297"},{"nip":"0686.88.0000.011","nama":"AGUNG BUDI SULISTYO, S.Pd.","staf_id":"390"}]}';
											$obj_json = $.parseJSON(response);
											var tot = $obj_json.result;
											var per_page = o.dataPush.per_page;
											var cur_page = $obj_json.page;
											var tot_page = Math.ceil(tot/per_page);
											
											$("<div class='s-first'><div class='first'></div></div>").appendTo(ui_yping_ft);
											$("<div class='s-prev'><div class='prev'></div></div>").appendTo(ui_yping_ft);
											$("<div class='s-inp'>Page <input type='text' id='page' value='"+cur_page+"' size=3 /> of "+ tot_page +"</div>").appendTo(ui_yping_ft);
											$("<div class='s-next'><div class='next'></div></div>").appendTo(ui_yping_ft);
											$("<div class='s-last'><div class='last'></div></div>").appendTo(ui_yping_ft);
											
											$('.s-last').eq(0).click(function(){
												try{
												if($('#page').val()!=tot_page){
													var push_page = { 'page': tot_page };
													o.dataPush = $.extend(o.dataPush,push_page);
													isTrigger = 1;
													obj.trigger('keyup');
												}
												}catch(ex){ alert(ex.message); }
											});
											
											$('.s-first').eq(0).click(function(){
												try{
												if($('#page').val()>1){
													var push_page = { 'page': 1 };
													o.dataPush = $.extend(o.dataPush,push_page);
													isTrigger = 1;
													obj.trigger('keyup');
												}
												}catch(ex){ alert(ex.message); }
											});
											
											$('.s-next').eq(0).click(function(){
												try{
												if($('#page').val()!=tot_page){
													var push_page = { 'page': (parseInt($('#page').val())+1) };
													o.dataPush = $.extend(o.dataPush,push_page);
													isTrigger = 1;
													obj.trigger('keyup');
												}
												}catch(ex){ alert(ex.message); }
											});
											
											$('.s-prev').eq(0).click(function(){
												try{
												if($('#page').val()>1){
													var push_page = { 'page': (parseInt($('#page').val())-1) };
													o.dataPush = $.extend(o.dataPush,push_page);
													isTrigger = 1;
													obj.trigger('keyup');
												}
												}catch(ex){ alert(ex.message); }
											});
											
											$('#page').keyup(function(e){
												try{
												if($(this).val()>0 && $(this).val()<=tot_page){
													var push_page = { 'page': $(this).val() };
													o.dataPush = $.extend(o.dataPush,push_page);
													isTrigger = 1;
													obj.trigger('keyup');
												}
												}catch(ex){ alert(ex.message); }
											});
											
											try{
											$.tmpl('<div class="yping-item">'+o.tpl+'</div>',$obj_json.rows).appendTo(ui_yping_inner); 
											}catch(xx){ alert(xx.message); }
											
											$('.yping-item').each(function(index,item){
												$(item).on({
													'mouseover':function(e){
														$('.yping-item').removeClass("selected");
														$(item).addClass("selected");
													},
													'click':function(e){
														var key = jQuery.Event("keydown");
														key.which = 13;
														
														obj.trigger(key);
													}
												});
											});
											
											
											 
										}
									});
									
								}
							}
						}
						ev.preventDefault();
					},
					'keydown':function(ev){
						
							try{
							var $hlight = $('.yping-item.selected'),$div = $('.yping-item');
							switch(ev.which){
								case 38: //case 37: //up & left
									$hlight.removeClass('selected').prev().addClass('selected');
									if ($hlight.prev().length == 0) {
										$div.eq(-1).addClass('selected')
									}
									var h = $(".yping-item.selected").height();
									h = ((h>0)?h:0);
									$("#jp-yping-inner").scrollTop(($(".yping-item.selected").index())*h);
								break;
								case 40: //case 39: //down & right
									try{
									$hlight.removeClass('selected').next().addClass('selected');
									if ($hlight.next().length == 0) {
										$div.eq(0).addClass('selected')
									}
									var h = $(".yping-item.selected").height();
									h = ((h>0)?h:0);
									$("#jp-yping-inner").scrollTop(($(".yping-item.selected").index())*h);
									}catch(x){ alert(x.message); }
								break;
								case 9: //tab
									o.close($('#jp-yping'));								
								break;
								case 13:
									if($('#jp-yping').length>0){
										$nLength = $(this).val().length;
										var $hlight = $('.yping-item.selected');
										if($hlight.length==0) $hlight = $('.yping-item').eq(0);
										o.onSelect($obj_json.rows[$hlight.index()]);
										o.close($('#jp-yping'));
									}
								break;
							}
							}catch(x){ alert('error is :'+x.message); }
							//e.stopPropagation();
					}
				  });
				  
				 
				  
			});
			
			
		};
	})( jQuery );