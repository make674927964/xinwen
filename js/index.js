$(function(){
    myScroll = new IScroll('#wrapper', {
        scrollX: true,
        scrollY: false
    });
    //封装ajax函数
    function render(type,repaint=true,start=0){
        $.ajax({
            url:'http://api.jisuapi.com/news/get?channel='+type+'&start='+start+'&num=10&appkey=2b36cf368ec87b81',     /*注：此处的type和start不能用双引号*/
            dataType:'JSONP',     /*跨域访问*/
            success:function (res) {
                console.log(res);
                let arr=res.result.list;  /*获取回来的数据都在list里面放的了*/
                let str='';
                arr.forEach(val=>{
                    if(val.pic==''){    /*如果没图片的时候，布局*/
                        str+=`
                                <li class="list nopic">
                                    <a href="${val.url}">
                                        <div>${val.title}</div>
                                        <span>${val.time}</span>
                                    </a>
                                </li>
                            `;
                    }else{       /*有图片的时候*/
                        str+=`
                        <li class="list">
                            <a href="${val.url}">
                                <div class="left">
                                    <img src="${val.pic}" alt="">
                                </div>
                                <div class="right">${val.title}
                                    <span>${val.time}</span>
                                </div>
                            </a>
                        </li>  
                            `;
                    }
                });
                if(repaint){      /*加载更多的条件判断*/
                    $('.content').html(str);
                }else{
                    $('.content').html($('.content').html()+str);
                }

            }
        })
    }
    //获取新闻模块（分类）
    $.ajax({
        url: 'http://api.jisuapi.com/news/channel?appkey=2b36cf368ec87b81',
        dataType:'JSONP',
        success:function (res) {
            // console.log(res);
            let arr=res.result;
            let str='';
            arr.forEach((val,index)=>{
                if(index==0){          /*如果是第一个li的时候，给他添加颜色*/
                    str+= `<li class="active">${val}</li>`;
                }else{
                    str+= `<li>${val}</li>`;
                }
            });
            $('#scroller ul').html(str);    /*把新闻分类内容放到页面中*/
            render($('.active').text());       /*调用render函数*/
        }
    });
//    事件委派，添加点击事件，点击那个标题，换哪个内容，通过父元素委派到li身上
    $('#scroller').on('click','li',function () {
        if($(this).hasClass('.active')){        /*如果点击的是，有active的那个li，打断函数运行*/
            return;
        }
        $(this).siblings().removeClass().end().addClass('active');     /*this当前点击的元素，siblings查找同辈li，将其他的类名移除，返回上一次操作之前，也就是他自己，再添加类名*/
        let text=$(this).html();      /*获取点击元素的内容*/
        render(text);      /*调用render函数，把内容传进去*/
    });
//    点击加载更多事件
    $('#add').click(function () {
        render($('#scroller ul li.active').html(),false,$('.content').children('li').length);
    })
});