let last_clicked_btn;

window.onload = function(){
    /**读取cookie，欢迎用户或者提示未登录*/
    let name = getCookie('username');
    if(name) {
        //可隐藏登录/注册按钮
        // document.getElementById('signin-signup').hidden = true;
        document.getElementById('signin-signup').textContent = name;
        const msg=`欢迎您,${name}`;
        console.log(msg);
        // alert(`欢迎您,${name}`);
        swal({
            text: msg,
            buttons: false,
            timer: 1000,
        });
    }
    else {
        console.log('未登录');
        swal({
            text: "未登录",
            buttons: false,
            timer: 1000,
        });
    }

    /**标题变化*/
    let time;
    let normal_title=document.title;
    document.addEventListener('onvisibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            clearTimeout(time);
            document.title = '┭┮﹏┭┮客官去哪了┭┮﹏┭┮';  //离开时
        } else {
            document.title = '欢迎再次回来哟(。・∀・)ノ';
            time=setTimeout(function(){ document.title = normal_title; }, 1500);  //再次回来时

        }
    });

    /**打开/关闭菜单栏*/
//function expression to select a element
    const selectElement= (s) =>document.querySelector(s);
//open the menu on click
    selectElement('.open').addEventListener('click',() => {
        selectElement('.nav-list').classList.add('active');
        console.log("open menu");
    });
//close the menu on click
    selectElement('.close').addEventListener('click',() => {
        selectElement('.nav-list').classList.remove('active');
        console.log("close menu");
    });

    /**点击登录&注册按钮*/
    document.getElementById('signin-signup').addEventListener('click',() => {
        window.location.href = "sign/signin&signup.html";
    })

    //顶部进度条
    topProgress();

    //回到顶部
    set_toTop_hidden();
    document.addEventListener('scroll',set_toTop_hidden);

    //窗口改变，页面位置重新定位
    for(let l of document.getElementsByClassName('nav-link')){
        l.addEventListener('click',() => {
            console.log(`click`);
            last_clicked_btn = this;
        })
    }
}

/**顶部进度条*/
function topProgress() {
    var progressBar = document.getElementById('progress');
    if ('max' in progressBar) {
        // Set the Max attr for the first time
        progressBar.setAttribute('max',getMax());


        document.addEventListener('scroll', function() {
            // On scroll only Value attr needs to be calculated
            progressBar.setAttribute('value',getValue());
        });

        window.addEventListener('resize',function() {
            // On resize, both Max/Value attr needs to be calculated
            progressBar.setAttribute('max',getMax());
            progressBar.setAttribute('value',getValue());
        });

    } else {
        document.on('scroll', setWidth);
        window.on('resize', function() {
            // Need to reset the Max attr
            max = getMax();
            setWidth();
            last_clicked_btn.click;
            console.log('reclick')
        });
    }

    function getWidth() {
        // Calculate width in percentage
        return getprogress * 100 + '%';
    }

    function setWidth() {
        progressBar.style.width = getWidth();
    }
}

function getMax() {
    return document.documentElement.scrollHeight-window.innerHeight;
}

function getValue() {
    return window.pageYOffset;
}

function getprogress() {
    return getValue()/getMax();
}

/**设置回到顶部按钮是否隐藏*/
function set_toTop_hidden(){
    document.getElementsByClassName('upToNav')[0].hidden = getprogress() < 0.1;
}

/**Cookie函数*/
// 返回具有给定 name 的 cookie，
// 如果没找到，则返回 undefined
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
