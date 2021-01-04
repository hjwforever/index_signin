const sign_in = document.getElementById('sign-in');//登录按钮
const sign_up = document.getElementById('sign-up');//注册按钮
const checkbox = document.getElementById('checkbox');//Checkbox ,是否记住账户密码
const sign_in_btn = document.querySelector("#sign-in-btn");//’前往注册‘按钮
const sign_up_btn = document.querySelector("#sign-up-btn");//‘开始登录’按钮
const container = document.querySelector(".container");

window.onload = function(){
    // setCookie('username','hjw',{'HttpOnly' : true})
    // document.cookie = "user=John";
    // console.log(document.cookie);
    // console.log(getCookie('username'));

    // console.log(document.cookie);


    //按钮绑定添加注册界面(转到注册界面)的事件
    sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
    });

    //按钮绑定移除注册界面(转到登录界面)的事件
    sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
        init();
    });

    //checkbox点击事件,是否记住账户密码
    checkbox.addEventListener("click",checkboxevent)

    //登录按钮点击事件,设置cookie
    sign_in.addEventListener('click',signin)

    //注册按钮点击事件,设置cookie
    sign_up.addEventListener('click',signup)

    /**初始化*/
    init();
}

/**初始化设置*/
function init() {
    if (getCookie('remember_user')==='true'){
        //checkbox勾选状态,选中
        checkbox.checked = true;
        // alert(document.cookie);
        //登陆按钮可点击
        sign_in.disabled=false;
        //填充登录信息
        document.getElementById('username').value = getCookie('username');
        document.getElementById('login-password').value = getCookie('password');
    }
    else {
        //checkbox勾选状态,未选中
        checkbox.checked = false;
        //登陆按钮不可点击
        sign_in.disabled=true;
        document.getElementById('username').value = '';
        document.getElementById('login-password').value = '';

        //如果选择不记住用户,应该清除cookie
        deleteCookie('username');
        deleteCookie('password');
        deleteCookie('email');
    }

    //注册按钮不可点击
    sign_up.disabled=true;
}

/**点击注册按钮事件, XMLHttpRequest  POST
 * 根据输入的用户名username,邮箱email及密码password进行注册
 * 使用XMLHttpRequest请求api服务器, 返回JSON格式信息
 * 注册成功返回       {"msg": "用户{username}注册成功","success": true}
 * 注册失败返回       {"msg": "用户名已存在; User name already exists","success": false}
 */
function signup() {
    //首先再次检查即将输入的表单格式是否正确,若不正确则返回false
    if(!(isvaildusername('name')&&isvaildemail()&&isvaildpassword()&&repassword_check())){
        return false;
    }

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    //设置请求体
    let data = new FormData();
    data.append("name", name);
    data.append("password", password);
    data.append("email", email);

    //建立请求
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4 && this.status === 200) {
            let result = JSON.parse(this.responseText);
            console.log(result);
            if(result.success ===true){//注册成功,success为true
                //设置cookie
                setCookie('username',name);//设置cookie,登录用户名
                setCookie('email',email);//设置cookie,登录用户邮箱
                setCookie('password',password);//设置cookie,登录密码

                swal({
                    title: "Register Success!",
                    icon: "success",
                    // buttons: false,
                    button: "OK",
                    timer: 1200,
                }).then(() => {
                        /**跳转到登录界面*/
                        sign_in_btn.click();
                        init();
                    }
                )
            }
            else {
                    swal ( "Oops" ,  result.msg ,  "error" );
                    console.log(result);
            }
        }
    });

    /**XMLHttpRequest方式发送用户注册请求*/
    // xhr.open("POST", "http://127.0.0.1:8000/api/signup");            //本地后台
    xhr.open("POST", "http://webmall.gq:8000/api/signup");  //云服务器后台
    // xhr.setRequestHeader("Access-Control-Allow-Methods", "*");
    xhr.send(data);
}


/**点击登录按钮事件,    Fetch  POST
 * 根据输入的用户名username及密码password进行登录
 * 使用fetch请求api服务器, 返回JSON格式信息
 * 登录成功返回                   {"success": true,"msg": "用户{username}登录成功; User {username} logged in successfully"}
 * 登录失败可能(密码错误)返回       {"success": false,"msg": "密码错误; Incorrect password"}
 *          或(用户名未注册)返回   {"msg": "该用户名未注册","success": false}*/
function signin() {
    let name = document.getElementById('username').value;
    let password = document.getElementById('login-password').value;
    //设置请求头
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    //设置查询参数
    var urlencoded = new URLSearchParams();
    urlencoded.append("name", name);
    urlencoded.append("password", password);

    //设置查询参数
    var requestOptions = {method: 'POST', headers: myHeaders, body: urlencoded, redirect: 'follow'};

    //发起查询请求
    // fetch("http://127.0.0.1:8000/api/signin", requestOptions)        //本地后台
    fetch("http://webmall.gq:8000/api/signin", requestOptions)    //云服务器后台
        .then(res => {
            //检查网络请求状态
            if (res.status !== 200) {
                console.log('HTTP ERROR！ Status Code: ' + res.status);
                return;
            }
            // 处理响应中的文本信息
            res.json().then(result => {
                //登录成功则会返回{name:{用户名},"msg": "success", "error_num": 0}
                //登陆失败则会返回{"msg": "用户名不存在; User name does not exist", "error_num": 1}或者{"msg": "密码错误; Incorrect password", "error_num": 1}
                if(result.success===true){
                    //设置cookie
                    setCookie('username', name);//设置cookie,登录用户名
                    setCookie('password', password);//设置cookie,登录密码

                    console.log(result.msg);
                    // alert(`用户${name}登录成功`);
                    // alert(`用户${getCookie('username')}登录成功\n邮箱:${getCookie('email')}\n密码:${getCookie('password')}`);
                    swal({
                        title: "Signin Success!",
                        icon: "success",
                        // buttons: false,
                        button: "OK",
                        timer: 1200,
                    }).then(() => {
                            /**跳转到主页*/
                            window.location.href = "../index.html";
                        }
                    )


                }
                else{
                    swal ( "Oops" ,  result.msg ,  "error" )
                    console.log(result)
                }
            });
        })
        .catch(function(err) {
            //报错
            swal ( "Oops" ,  'Something other occurs' ,  "error" )
            console.log(`Fetch Error : ${err}`);
        })

    //Get版登录请求  设置查询url
    // let url = new URL('http://127.0.0.1:8000/api/login');
    // let url = new URL('http://47.94.235.82:8000/api/login');
    // url.searchParams.set('name', name);
    // url.searchParams.set('password', password);
    // console.log(url);
}

/**checkbox事件*/
function checkboxevent() {
    /**存储到cookie*/
    if(checkbox.checked) {
        // setCookie('remember_user','true');
        document.cookie = "remember_user = true";
        setCookie('username',document.getElementById('username').value);//设置cookie,登录用户名
        setCookie('password',document.getElementById('login-password').value);//设置cookie,登录密码
    }
    else {
        // setCookie('remember_user','false');
        document.cookie = "remember_user = false";
    }

    // init();

    /**存储到localStorage*/
    // if(checkbox.checked) {
    //     localStorage.setItem('remember_user','true');
    // }
    // else {
    //     localStorage.setItem('remember_user','false');
    // }
}

/**以正则表达式来检查注册信息的函数*/
//用户名为由数字，英文，下划线或短划线组成的8至16位用户名
function isvaildusername(s) {
    'use strict';
    let username = document.getElementById(s);
    let username_value = username.value ;
    let user_err=document.getElementById(s+'_err');
    const userNameReg = /^[A-Za-z0-9-_]{4,10}$/;

    if(!userNameReg.exec(username_value))
    {
        sign_in.disabled=true;
        user_err.innerHTML = '请输入由数字、字母、下划线、短折线组成的4至10位用户名';
        // username.focus();
        return false;
    }
    else
    {
        sign_in.disabled=false;
        user_err.innerHTML =''
        return true;
    }
}

//匹配邮箱的正确格式
function isvaildemail() {

    let email = document.getElementById('email');
    let email_err=document.getElementById('email_err');
    // console.log(email.value);
    const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if(!emailReg.exec(email.value))
    {
        sign_up.disabled=true;
        email_err.innerHTML = '请输入正确邮箱格式';
        // email.focus();
        return false;
    }
    else
    {
        email_err.innerHTML =''
        return true;
    }
}

//密码为8-16个字母、数字、下划线
function isvaildpassword() {
    let psd = document.getElementById('password');
    let psd_err=document.getElementById('psd_err');
    // console.log(psd.value);
    const passWordReg=/^[A-Za-z0-9_]{8,16}$/;
    if(!passWordReg.exec(psd.value))
    {
        sign_up.disabled=true;
        psd_err.innerHTML = '请输入由字母、数字、下划线组成的8至16位密码';
        // psd.focus();
        return false;
    }
    else
    {
        psd_err.innerHTML =''
        return true;
    }
}

//检测两次输入密码是否相同
function repassword_check() {
    let psd = document.getElementById('password');
    let re_psd = document.getElementById('re-password');
    let re_psd_err = document.getElementById('re_psd_err');

    // console.log(psd.value===re_psd.value);
    // console.log(psd.value);
    // console.log(re_psd.value);
    if (psd.value===''){
        sign_up.disabled=true;
        re_psd_err.innerHTML = "密码不能为空";
        // re_psd.focus();
        return false;
    }
    else if(psd.value!==re_psd.value)
    {
        sign_up.disabled=true;
        re_psd_err.innerHTML = "两次密码不一致";
        // re_psd.focus();
        return false;
    }
    else
    {
        sign_up.disabled=false;
        re_psd_err.innerHTML =' '
        return true;
    }
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

//设置Cookie
//默认过期事件为1天
function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        expires: (new Date(Date.now() + 86400e3)).toUTCString(),
        // 如果需要，可以在这里添加其他默认值
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

//删除cookie
function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}


/**以下为测试函数*/
/**fetch网络请求函数*/
async function fetchtest() {
    fetch('http://127.0.0.1:8000/api/show_books')
        .then(res => {
            //检查网络请求状态
            if (res.status !== 200) {
                console.log('HTTP ERROR！ Status Code: ' + res.status);
                return;
            }
            // 处理响应中的文本信息
            res.text().then(data => {
                console.log(data);
                alert(JSON.stringify(data,null,4));
            });
        })
        .catch(function(err) {
            //报错
            console.log(`Fetch Error : ${err}`);
        })

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        let obj;
        let datas;
        if (this.readyState === 4 && this.status === 200) {
            obj = JSON.parse(this.responseText);
            datas = obj.list;
            console.log(datas);
            for (let data of datas){
                document.getElementById("demo").innerHTML += `book_name:${data.fields.book_name}\nadd_time:${data.fields.add_time}\n`;
            }

        }
    };
    xmlhttp.open("GET", "http://127.0.0.1:8000/api/show_books", true);
    xmlhttp.send();
}

async function frompost() {
    fetch('/test/content.json', { // url: fetch事实标准中可以通过Request相关api进行设置
        method: 'POST',
        mode: 'same-origin', // same-origin|no-cors（默认）|cors
        credentials: 'include', // omit（默认，不带cookie）|same-origin(同源带cookie)|include(总是带cookie)
        headers: { // headers: fetch事实标准中可以通过Header相关api进行设置
            'Content-Type': 'application/x-www-form-urlencoded' // default: 'application/json'
        },
        body: 'a=1&b=2' // body: fetch事实标准中可以通过Body相关api进行设置
    }).then(function(res){ //res: fetch事实标准中可以通过Response相关api进行设置
        return res.json();
    }).then(function(data){
        console.log(data);
    }).catch(function(error){
        console.log(error);
    });
}
