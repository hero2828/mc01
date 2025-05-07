
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'
import "./scss/app2.scss"
// 
function initMeScroll(mescrollId, options) {
  var myOption = {
    down: {
      offset: 60,
      htmlContent: '<p class="downwarp-progress"><p>',
    },
    up: {
      htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p>',
      toTop: {
        src: "/res/mescroll-totop.png"
      }
    }
  }
  //加入自定义的默认配置
  options = MeScroll.extend(options, myOption);
  //创建MeScroll对象
  return new MeScroll(mescrollId, options);
}
var mescroll = initMeScroll("mescroll", {
  down: {
    auto: false,
    callback: downCallback
  },
  up: {
    auto: true,
    isBoth: true,
    isBounce: false,
    callback: upCallback,
    toTop: {
      src: "/res/mescroll-totop.png"
    }
  }
});
function downCallback() {
  getListDataFromNet(0, 6, function (data) {
    sortList.left = null
    sortList.right = null
    leftDom.innerHTML = ""
    rightDom.innerHTML = ""
    mescroll.endSuccess();
    setListData(data, false);
    document.getElementById("downloadTip").style.top = "0px";
    setTimeout(function () {
      document.getElementById("downloadTip").style.top = "-24px";
    }, 2000);
  }, function () {
    mescroll.endErr();
  });
}
function upCallback(page) {
  getListDataFromNet(page.num, page.size, function (curPageData) {
    mescroll.endSuccess(curPageData.length);
    setListData(curPageData, true);
  }, function () {
    mescroll.endErr();
  });
}
let cardIndex = 0;
const sortList = {
  left: null,
  right: null
}
const leftDom = document.getElementById("newList-left");
const rightDom = document.getElementById("newList-right");
const newsList = document.getElementById("newsList")
newsList.addEventListener("click", (e) => {
  if (e.target.className === 'card-play') {
    const $video= e.target.parentNode.querySelector('.card-video')
    // 全屏，并自动播放
    $video.play()
    $video.requestFullscreen();
  } else if(['card-love-icon','card-love-num']){
    const $num=e.target.parentNode.querySelector('.card-love-num')
    $num.innerText=Number($num.innerText)+1
  }
})
const h = [150, 200, 300, 400]

const search = getUrlParams()

function setListData(curPageData) {
  for (var i = 0; i < curPageData.length; i++) {
    const index = Math.floor(Math.random() * 10)

    let play = '';
    let imgTpl = `<img class="card-img" src="https://dummyimage.com/300x${h[index % h.length]}">`
    let videoTpl=`<div class="card-play"></div><video class="card-video"><source src="https://www.w3school.com.cn/i/movie.mp4" type="video/mp4"></video>`;
    if (search.type === '1') {
      play = `${imgTpl}${videoTpl}`
    } else if (search.type === '0') {
      play = imgTpl
    } else {
      play = randomBl() ? `${imgTpl}${videoTpl}` : imgTpl
    }

    let str = `
        <div class="card-content">
          ${play}
        </div>
        <div class="card-title">
          ${randomChinese(Math.floor(Math.random() * 20) + 5)}
        </div>
        <div class="card-plot">
          ${randomChinese(randomNum(2, 5))}
        </div>
        <div class="card-user">
          <img class="card-user-avatar" src="https://dummyimage.com/64" alt="">
          <div class="card-user-name">${randomChinese(4)}</div>
          <div class="card-love">
            <div class="card-love-icon"></div>
            <div class="card-love-num">${randomNum(5, 40)}</div>
          </div>
        </div>
    `
    var liDom = document.createElement("div");
    liDom.className = "card";
    cardIndex++
    liDom.innerHTML = str;
    if (sortList.left && sortList.right) {
      if (sortList.left.offsetTop <= sortList.right.offsetTop) {
        // 左
        leftDom.appendChild(liDom);
        sortList.left = liDom;
      } else {
        // 右
        rightDom.appendChild(liDom);
        sortList.right = liDom;
      }
    } else if (sortList.left) {
      // 右
      rightDom.appendChild(liDom);
      sortList.right = liDom;
    } else {
      leftDom.appendChild(liDom);
      // 左
      sortList.left = liDom;
    }
  }
}
function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
  setTimeout(function () {
    try {
      var newArr = Array.from({ length: pageSize }).fill(0);
      successCallback && successCallback(newArr);
    } catch (e) {
      errorCallback && errorCallback();
    }
  }, 2000);
}


function randomChinese(len) {
  const commonChars = '的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动方期它头经长儿回位分爱老因很给名法间斯知世什两次使身者被高已亲其进此话常与活正感';
  let result = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * commonChars.length);
    result += commonChars[randomIndex];
  }
  return result;
}
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomBl() {
  return Math.random() > 0.5;
}
function getUrlParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
}
