// JavaScript Document
$(function(){
    /*选项卡*/
    var $div_li =$(".mass_content_top ul li");
    $(".mass_content_con> div").hide();
    $(".new_mass").show();
    $div_li.click(function(){
        $(this).addClass("active")
            .siblings().removeClass("active");
    });
    /*对象、性别、地区选择*/
    $(".target_show").click(function(){
        $(".target_content").find("ul").hide();
        $(this).siblings().show();
        $(this).siblings().children().click(function(){
            var liVal=$(this).text();
            $(this).parent().hide();
            $(this).parent().prev().find("label").text(liVal);
            var labelVal=$(this).parent().prev().find("label").text();
            if(labelVal=="按分组选择"){
                $(".target_group").show();
            }
            else if(labelVal=="全部用户"){
                $(".target_group").hide();
            }
            if(labelVal=="中国"){
                $("#all_uni div:first-child").show();
                $("#all_uni div:first-child").siblings().hide();
            }
            else if(labelVal=="中国台湾"){
                $("#all_uni div:nth-child(2)").show();
                $("#all_uni div:nth-child(2)").siblings().hide();
            }
            if(labelVal=="中国澳门"){
                $("#all_uni div:nth-child(3)").show();
                $("#all_uni div:nth-child(3)").siblings().hide();
            }
            if(labelVal=="中国香港"){
                $("#all_uni div:last-child").show();
                $("#all_uni div:last-child").siblings().hide();
            }
        });
    });


    $(document).click(function(e){
        var target=$(e.target);
        if(!target.is("#review .area_con_b a")){
            $(window.frames["review"].document).find(".face").hide();
        }
    })

    $(document).click(function(e){
        var target=$(e.target);

        if(!target.is(".target_show")){
            $(".target_uni ul").hide();
        }
    })

    var state=1;
    $(".mass_button_l").click(function(){
        if(state==1){
            var topVar=top.xdDialog.contentData;
            var mid2=review.document.getElementById("edit").innerHTML;
            if(topVar.type=="text"){topVar.mid=mid2;}
            else if(topVar.type=="tuwen"){topVar.mid=top.xdDialog.contentData.mid;}
            var mid=topVar.mid;
            var type=topVar.type;
            $.ajax({
                url:"/index.php?g=User&m=Masssend&a=massSend",
                type:"post",
                data:{"content":mid,"type":type},
                error: function(){alert("群发失败");},
                success: function(){
                    alert("成功");

                }
            })
            state=0;
        }

    });
})


