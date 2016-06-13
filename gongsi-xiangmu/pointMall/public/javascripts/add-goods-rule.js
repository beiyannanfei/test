var createLayerwcj_cssStr=".layer_wBg_cj{position:fixed;background-color:rgba(0,0,0,0.6);left:0;top:-100%;width:100%;height:100%;z-index:10000;transition:all .2s linear;-webkit-transition:all .2s linear;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.layer_wBg_cj.hide{opacity:0;top:-100%}.layer_wBg_cj.show{opacity:1;top:0}.layer_w_cj{width:700px;background-color:#FFF;position:absolute;left:50%;top:50%;margin-left:-350px;margin-top:-205px}.layer_w_cj .header{background-color:#f4f5f9;height:50px;line-height:50px;position:relative;padding:0 20px;font-size:16px}.layer_w_cj .header .closeLayer{position:absolute;top:50%;margin-top:-15px;right:10px;width:30px;height:30px;cursor:pointer}.layer_w_cj .header .closeLayer svg{width:30px;height:30px}.layer_w_cj .header .closeLayer:hover{opacity:.5}.layer_w_cj .con{height:300px;padding:15px;overflow:auto}.layer_w_cj .frm_control_group{width:420px;margin:0 auto;padding-top:60px}.layer_w_cj .frm_control_group .frm_label{display:block;font-size:14px;line-height:2em;margin-bottom:10px}.layer_w_cj .frm_control_group .frm_input_box input{border:1px solid #CCC;font-size:14px;color:#333;padding:10px;width:300px}.layer_w_cj .frm_control_group .frm_error{color:#e97979;font-size:14px;line-height:2em}.layer_w_cj .btn_group{background-color:#f4f5f9;padding:16px 0 5px;text-align:center}.layer_w_cj .btn{margin:0 10px 10px 0;-webkit-transition:all .15s;transition:all .15s;font-size:100%}.layer_w_cj .btn_lg{display:inline-block;overflow:visible;vertical-align:middle;text-align:center;text-decoration:none;border-width:1px;border-style:solid;cursor:pointer;padding:0 22px;height:30px;line-height:30px;border-radius:3px;-webkit-border-radius:3px;font-size:14px}.layer_w_cj .btn button{display:block;height:100%;background-color:transparent;border:0;outline:0;overflow:visible;padding:0 22px;color:#fff;cursor:pointer}.layer_w_cj .btn_primary{background-color:#44b549;border-color:#44b549;color:#fff}.layer_w_cj .btn_primary:hover,.layer_w_cj .btn_primary.active{background-color:#379729;border-color:#379729;color:#fff}.layer_w_cj .btn_default{background-color:#fff;border-color:#e6e7ec;color:#222}.layer_w_cj .btn_default:hover,.layer_w_cj .btn_default.active{background-color:#e9e9e9;color:#222}.layer_w_cj .btn_default button{color:#222}.layer_w_cj .frm{position:relative;padding-left:90px;line-height:30px;margin-bottom:20px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.layer_w_cj .frm .inputText{border:1px solid #CCC;width:100%;padding:5px;height:30px;width:200px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.layer_w_cj .frm .tile{position:absolute;left:0;top:0}.layer_w_cj .frm .item{float:left;display:inline-block;height:32px;line-height:20px;position:relative;margin-right:12px;border:1px solid #CCC;border-radius:4px;padding:5px 10px;margin-bottom:10px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.layer_w_cj .frm .item .close{position:absolute;width:20px;height:20px;border-radius:50%;background-color:rgba(0,0,0,0.2);top:-8px;right:-8px;cursor:pointer}.layer_w_cj .frm .item .close:hover{background-color:rgba(255,0,0,0.4)}.layer_w_cj .frm .item .close svg{width:20px;height:20px}.layer_w_cj .frm .additem .btn_lg,.layer_w_cj .frm .additem button{padding:0 10px}.layer_w_cj .frm .additem .input{margin:0 10px 10px 0;display:none;vertical-align:middle}.layer_w_cj .frm .additem .input input{width:140px}";
(function(){
	createLayerwcj = function(options,action){
		this.svg='<svg width="100px" height="100px" viewBox="0 0 100 100"><g><path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M50,0C22.386,0,0,22.386,0,50c0,27.614,22.386,50,50,50   c27.614,0,50-22.386,50-50C100,22.386,77.614,0,50,0z M50,96.667C24.227,96.667,3.333,75.773,3.333,50   C3.333,24.227,24.227,3.333,50,3.333c25.773,0,46.667,20.894,46.667,46.667C96.667,75.773,75.773,96.667,50,96.667z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M33.846,30.311l34.176,34.176l-2.356,2.356L31.489,32.667   L33.846,30.311z"/>	<path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M33.846,30.311l34.176,34.176l-2.356,2.356L31.489,32.667   L33.846,30.311z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M68.022,64.487l-2.356,2.356"/>	<path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M68.022,64.487l-2.356,2.356"/>	<path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M68.022,33.846L33.846,68.022l-2.357-2.356l34.177-34.177   L68.022,33.846z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M68.022,33.846L33.846,68.022l-2.357-2.356l34.177-34.177   L68.022,33.846z"/>	<path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M33.846,68.022l-2.357-2.356"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#78797D" d="M33.846,68.022l-2.357-2.356"/></g></svg>';
		this.action = action;
		this.options = {
			title:'',
			values:[]
		}
		for( var i in options ){
			this.options[i] = options[i];
		}
		this._addcss();
		this._init();
	};
	createLayerwcj.prototype = {
		_addcss:function(){
			try{
				var style = document.createStyleSheet();
		    	style.cssText = createLayerwcj_cssStr;
		    }
		    catch(e){
				var style = document.createElement("style");
				style.type = "text/css";
				style.textContent = createLayerwcj_cssStr;
				document.getElementsByTagName("head").item(0).appendChild(style);
			}
		},
		_init:function(){
			//屏蔽多次new fun
			var layer=$('.layer_wBg_cj');
			if(layer){
				layer.remove();
			}
			//创建dom
			var html = this._createDOM();
			$('body').append(html);
			setTimeout(function(){
				$('.layer_wBg_cj').addClass('show');
			},200);
			this._event();
		},
		_save:function(){
			var title=$('.layer_wBg_cj .inputTile').val();
			var obj = $('.layer_wBg_cj .frmList .item');
			var data = {};
			var values = [];
			for(var i=0; i<obj.length; i++){
				var value = $(obj[i]).find('p').html();
				values.push(value);
			}
			data["title"]=title;
			data["values"]=values;
			this.action(data);
			$('.layer_wBg_cj').removeClass('show');
			setTimeout(function(){
				$('.layer_wBg_cj').remove();
			},200);
		},
		_cancel:function(){
			$('.layer_wBg_cj').removeClass('show');
			setTimeout(function(){
				$('.layer_wBg_cj').remove();
			},200);
			this.action(null);
		},
		_event:function(){
			var that=this;
			var btn_save=$('.layer_wBg_cj .btn_save');
			var btn_cancel=$('.layer_wBg_cj .btn_cancel');
			var closeLayer=$('.layer_wBg_cj .closeLayer');
			
			var additem=$('.layer_wBg_cj .additem .btn');
			var addinput=$('.layer_wBg_cj .additem input');

			var closeItem=$('.layer_wBg_cj .item .close');

			if(closeItem){
				closeItem.on("click", function(){
					$(this).parent().remove();
				});
			}
			var save_status=true;
			btn_save.on("click", function(){
				if(save_status){
					that._save();
				}
				save_status=false;
			});
			btn_cancel.on("click", function(){
				that._cancel();
			});
			closeLayer.on("click", function(){
				that._cancel();
			});
			additem.on("click", function(){
				var parent=$(this).parent();
				var status=parent.attr('data-status');
				if(status=="true"){
					parent.attr('data-status','false');
					parent.find('.btn').hide();
					parent.find('.input').show();
					addinput.val('');
					parent.find('input').focus();
				}
			});
			addinput.blur(function(){
				var value = addinput.val();
				var parent=$(this).parent().parent();
				var status=parent.attr('data-status');
				if(status=="false"){
					parent.attr('data-status','true');
					parent.find('.btn').show();
					parent.find('.input').hide();
				}
				if(value){
					that._addItem(value);
				}
			});
		},
		_addItem:function(value){
			var html = this._createItem(value);
            var view = $(html)
            $('.close', view).click(function(){
                $(this).parent().remove();
            })
			$('.layer_wBg_cj .frmList').append(view);
		},
		_createItem:function(value){
			var html = [
				'<div class="item">',
				'<p class="tet">'+value+'</p>',
				'<span class="close">'+this.svg+'</span>',
				'</div>'
			].join('');
			return html;
		},
		_createDOM:function(data){
			var values=this.options.values;
			var items='';
			var title='';
			if(values && values.length>0){
				for(i=0;i<values.length;i++){
					var html = this._createItem(values[i]);
					items=items+html;
				}
			}
			if(this.options.title){
				title=this.options.title;
			}
			var html = [
				'<div class="layer_wBg_cj" id="add_layer_wBg_cj">',
    			'<div class="layer_w_cj">',
      			'<div class="header">添加商品规则<span class="closeLayer">'+this.svg+'</span></div>',
				'<div class="con">',
				'<div class="frm">',
				'<span class="tile">填写规则标题：</span>',
				'<input type="text" class="inputText inputTile" placeholder="规则标题" value="'+title+'">',
				'</div>',
				'<div class="frm">',
                '<span class="tile">填写类别：</span>',
          		'<div class="frmList">',
            	items,
          		'</div>',
          		'<div class="additem" data-status="true"><span class="btn btn_lg btn_primary"><button type="button">添加规则</button></span><span class="input"><input type="text" class="inputText" placeholder="输入规则"></span></div>',
				'</div>',
				'</div>',
				'<div class="btn_group">',
				'<span class="btn btn_lg btn_primary btn_save"><button type="button">保存</button></span>',
				'<span class="btn btn_lg btn_default btn_cancel"><button type="button">取消</button></span>',
				'</div>',
				'</div>',
				'</div>'
			].join('');
			return html;
		}
	}
}());