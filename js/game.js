/* by：弦云孤赫——David Yang
** github - https://github.com/yangyunhe369
*/
// 游戏主要运行逻辑
class Game {
  constructor (fps = 60) {
    let g = {
      state: 1,                                                     // 游戏状态值，初始默认为1
      state_START: 1,                                               // 开始游戏
      state_RUNNING: 2,                                             // 游戏开始运行
      state_STOP: 3,                                                // 暂停游戏
      state_GAMEOVER: 4,                                            // 游戏结束
      state_UPDATE: 5,                                              // 游戏通关
      leftBtn: document.getElementById("left"),                     // 左按键
      rightBtn: document.getElementById("right"),                   // 右按键
      PBtn: document.getElementById("P"),                           // P按钮
      NBtn: document.getElementById("N"),                           // N按钮
      // lifeBtn: document.getElementById("life"),                     // 复活按钮
      canvas: document.getElementById("canvas"),                    // canvas元素
      context: document.getElementById("canvas").getContext("2d"),  // canvas画布
      timer: null,                                                  // 轮询定时器
      fps: fps,                                                     // 动画帧数，默认60
    }
    Object.assign(this, g)
  }
  // 绘制页面所有素材
  draw (paddle, ball, blockList, score) {
    let g = this
    // 清除画布
    g.context.clearRect(0, 0, g.canvas.width, g.canvas.height)
    // 绘制挡板
    g.drawImage(paddle)
    // 绘制小球
    g.drawImage(ball)
    // 绘制砖块
    g.drawAllBlock(blockList)
    // 绘制分数
    g.drawText(score)
  }
  // 绘制图片
  drawImage (obj) {
    this.context.drawImage(obj.image, obj.x, obj.y)
  }
  // 绘制所有砖块
  drawAllBlock (list) {
    for (let item of list) {
      this.drawImage(item)
    }
  }
  // 绘制计数板
  drawText (obj) {
    this.context.font = '24px Microsoft YaHei'
    // 绘制分数
    this.context.fillText(obj.text + obj.allScore, obj.x, obj.y)
    // 绘制关卡
    this.context.fillText(obj.textLv + obj.lv, this.canvas.width - 100, obj.y)
  }
  // 游戏结束
  gameOver (_main) {
    // var res = confirm("确认复活？");
    // if (res == true) {
    //   let self = this
    //   let gavegame = new GaveGamePlatform();
    //   gavegame.setRequestData({'click': 'revival'});
    //   gavegame.getRequestData = function (data) {
    //     // 继续游戏
    //     _main.reStart();
    //     // 隐藏复活按钮
    //     self.lifeBtn.style.display = "none";
    //   }
    // } else {
      // 清除定时器
      clearInterval(this.timer)
      // 清除画布
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.font = '48px Microsoft YaHei'
      this.context.fillText('game over', (this.canvas.width - 48 * 4) / 2.0, this.canvas.height / 2.0)
      // 隐藏复活按钮
      // this.lifeBtn.style.display = "none";
    // }
  }
  // 游戏晋级
  goodGame () {
    // 清除定时器
    clearInterval(this.timer)
    // 清除画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.font = '48px Microsoft YaHei'
    this.context.fillText('Congratulations on reaching the next level', (this.canvas.width - 48 * 8) / 2.0, this.canvas.height / 2.0)
  }
  // 游戏通关
  finalGame () {
    // 清除定时器
    clearInterval(this.timer)
    // 清除画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.font = '48px Microsoft YaHei'
    this.context.fillText('Congratulations on clearing', (this.canvas.width - 48 * 8) / 2.0, this.canvas.height / 2.0)
  }
  // 设置逐帧动画
  setTimer (paddle, ball, blockList, score) {
    let g = this
    let p = paddle
    let b = ball
    g.timer = setInterval(function () {
      // 当砖块数量为0时，挑战成功
      if (blockList.length == 0) {
        // 升级通关
        g.state = g.state_UPDATE
        // 挑战成功，渲染下一关卡场景
        g.goodGame()
      }
      // 判断游戏是否结束
      if (g.state === g.state_GAMEOVER) {
        // 显示复活按钮
        // if (g.lifeBtn.style.display !== "block") {
        //   g.lifeBtn.style.display = "block";
        // }
        g.gameOver(_main)
      }
      // 判断游戏开始时执行事件
      if (g.state === g.state_RUNNING) {
        // 小球碰撞挡板检测
        if (p.collide(b)) {
          // 当小球运动方向趋向挡板中心时，Y轴速度取反，反之则不变
          if (Math.abs(b.y + b.h/2 - p.y + p.h/2) > Math.abs(b.y + b.h/2 + b.speedY - p.y + p.h/2)) {
            b.speedY *= -1
          } else {
            b.speedY *= 1
          }
          // 设置X轴速度
          b.speedX = p.collideRange(b)
        }
        // 小球碰撞砖块检测
        blockList.forEach(function (item, i, arr) {
          if (item.collide(b)) { // 小球、砖块已碰撞
            if (!item.alive) { // 砖块血量为0时，进行移除
              arr.splice(i, 1)
            }
            // 当小球运动方向趋向砖块中心时，速度取反，反之则不变
            if ((b.y < item.y && b.speedY < 0) || (b.y > item.y && b.speedY > 0)) {
              if (!item.collideBlockHorn(b)) {
                b.speedY *= -1
              } else { // 当小球撞击砖块四角时，Y轴速度不变
                b.speedY *= 1
              }
            } else {
              b.speedY *= 1
            }
            // 当小球撞击砖块四角时，X轴速度取反
            if (item.collideBlockHorn(b)) {
              b.speedX *= -1
            }
            // 计算分数
            score.computeScore()
          }
        })
        // 挡板移动时边界检测
        if (p.x <= 0) { // 到左边界时
          p.isLeftMove = false
        } else {
          p.isLeftMove = true
        }
        if (p.x >= g.canvas.width - p.w) { // 到右边界时
          p.isRightMove = false
        } else {
          p.isRightMove = true
        }
        // 移动小球
        b.move(g)
        // 绘制游戏所有素材
        g.draw(p, b, blockList, score)
      } else if (g.state === g.state_START){
        // 绘制游戏所有素材
        g.draw(p, b, blockList, score)
      }
    }, 1000/g.fps)
  }
  /**
   * 初始化函数
   * _main: 游戏入口函数对象
   */
  init (_main) {
    let g = this,
        paddle = _main.paddle,
        ball = _main.ball,
        blockList = _main.blockList,
        score = _main.score

    // 左方向
    g.leftBtn.onclick = function (event) {
      // 判断游戏是否处于运行阶段
      if (g.state === g.state_RUNNING && paddle.isLeftMove) {
        paddle.moveLeft()
      }
    }
    // 右方向
    g.rightBtn.onclick = function (event) {
      // 判断游戏是否处于运行阶段
      if (g.state === g.state_RUNNING && paddle.isRightMove) {
        paddle.moveRight(g)
      }
    }
    // 暂停
    g.PBtn.onclick = function (event) {
      if (g.state !== g.state_GAMEOVER) {
        g.state = g.state_STOP
      }
    }
    // 进入下一关
    g.NBtn.onclick = function (event) {
      // 游戏状态为通关，且不为最终关卡时
      if (g.state === g.state_UPDATE && _main.LV !== MAXLV) { // 进入下一关
        // 开始游戏
        g.state = g.state_START
        // 初始化下一关卡
        _main.start(++_main.LV)
      } else if (g.state === g.state_UPDATE && _main.LV === MAXLV) { // 到达最终关卡
        g.finalGame()
      }
    }
    
    // 按钮触发
    window.addEventListener('touchstart', function (event) {
      // 已经结束
      // if (g.state === g.state_GAMEOVER && g.lifeBtn.style.display === "block") {
      //   g.gameOver(_main)
      //   return;
      // }

      // 排除按钮
      if (event.target.id === "left" || event.target.id === "right" || event.target.id === "P" || event.target.id === "N") {
        return;
      }
      
      if (g.state === g.state_GAMEOVER) { // 游戏结束时
        // 开始游戏
        g.state = g.state_START
        // 初始化
        _main.start()
      } else { 
        // 开始游戏
        ball.fired = true
        g.state = g.state_RUNNING
      }
    })
    // 设置轮询定时器
    g.setTimer(paddle, ball, blockList, score)
  }
}