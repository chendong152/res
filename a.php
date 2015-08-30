<?php
/**
 * Created by Dong.
 * User: Dong(mailto:techdong@hotmail.com)
 * Date: 2015-08-30
 * Time: 16:31
 */
header('Content-Type:application/json;charset=utf-8');
if (isset($_GET['b']))
    b();
else
    a();

function a() {
    echo '{
    "items": [
        {
            "author": "霈雯",
            "contentSourceURL": "",
            "id": 1,
            "title": "知食｜你也许吃过、却不知道的中国母亲花",
            "uRL": "http://mp.weixin.qq.com/s?__biz=MzA5NTE3MjEyNQ==&mid=205053509&idx=1&sn=4c8ca08041c33de2684f5f0580ed092b#rd"
        },
        {
            "author": "每日优鲜",
            "contentSourceURL": "http://as-vip.missfresh.cn/v1/voucher/30tsyhq0510/get?from=missfresh&state=mryx",
            "id": 2,
            "title": "知食.有礼｜我不能弥补母亲的青春，但可以延缓她的衰老",
            "uRL": "http://mp.weixin.qq.com/s?__biz=MzA5NTE3MjEyNQ==&mid=205053509&idx=2&sn=6175a96cdca88f2ae2b261d774214bf9#rd"
        },
        {
            "author": "有一味",
            "contentSourceURL": "",
            "id": 3,
            "title": "重磅调查｜妈妈最爱的口味，一半人居然不知道！",
            "uRL": "http://mp.weixin.qq.com/s?__biz=MzA5NTE3MjEyNQ==&mid=205053509&idx=3&sn=63ce6104a88f825699cf092069a11bbe#rd"
        },
        {
            "author": "海雨",
            "contentSourceURL": "http://www.foodreport.cn/nutrition.php?action=view&id=340",
            "id": 4,
            "title": "食月令丨立夏",
            "uRL": "http://mp.weixin.qq.com/s?__biz=MzA5NTE3MjEyNQ==&mid=204921208&idx=1&sn=59de352f6b5b394cc23ce42173b7fd65#rd"
        },
        {
            "author": "海雨",
            "contentSourceURL": "http://www.foodreport.cn/nutrition.php?action=view&id=340",
            "id": 5,
            "title": "食俗丨立夏传统美食",
            "uRL": "http://mp.weixin.qq.com/s?__biz=MzA5NTE3MjEyNQ==&mid=204921208&idx=2&sn=75acc15533f53c19392d3ad1e347b5f7#rd"
        }
    ],
    "total": 50
}';
}

function b() {
    echo '[
    {
        "address": "三里屯北街81号那里花园6层",
        "distance": 0,
        "intro": "米家思通过西班牙菜的许多不同形式还有最具代表性的风味小吃等等，让食客对西班牙菜留下深刻的印象同时，有一种不同的体验。",
        "service": 4.5,
        "surroundings": 4.5,
        "tagList": [
            "三里屯",
            "西班牙菜",
            "露台",
            "酒吧",
            "朋友聚会",
            "分子料理"
        ],
        "taste": 4.5,
        "tel": "010-52086061",
        "title": "米家思Migas Restaurant",
        "titlePic": "img/thumb.png"
    },
    {
        "address": "北京市朝阳区三里屯北街81号那里花园6楼",
        "distance": 0,
        "intro": "裙角飞扬的夏天正是放松享乐的好时机。如果不能在烈日下肆意玩耍，倒不如入夜之后逃出封闭的空调房，来到顶楼露台乘着夏夜的晚风，一边享受味觉的美，一边体会视觉的醉。",
        "service": 4.5,
        "surroundings": 4.5,
        "tagList": [
            "三里屯",
            "酒吧",
            "露台",
            "休闲",
            "情侣",
            "鸡尾酒"
        ],
        "taste": 4.5,
        "tel": "010-52086138",
        "title": "Fez Bar",
        "titlePic": "img/thumb.png"
    }
]';
}