/* by：弦云孤赫——David Yang
** github - https://github.com/yangyunhe369
*/
// 游戏主函数
let _main = {
  LV: 1,                               // 初始关卡
  MAXLV: 3,                            // 最终关卡
  game: null,                          // 游戏主要逻辑对象
  scene: null,                         // 场景对象
  blockList: null,                     // 所有砖块对象集合
  ball: null,                          // 小球对象
  paddle: null,                        // 挡板对象
  score: null,                         // 计分板对象
  ball_w: 18,                          // 小球宽度
  ball_h: 18,                          // 小球高度
  ball_x: 0,                           // 小球默认x轴坐标
  ball_y: 0,                           // 小球默认y轴坐标
  paddle_w: 102,                       // 挡板宽度
  paddle_h: 22,                        // 挡板高度
  paddle_x: 0,                         // 挡板默认x轴坐标
  paddle_y: 0,                         // 挡板默认y轴坐标
  score_x: 10,                         // 计分板默认x轴坐标
  score_y: 0,                          // 计分板默认y轴坐标
  fps: 60,                             // 游戏运行帧数
  start: function () {                 // 游戏启动函数
    let self = this
    let w = window.innerWidth
    let h = window.innerHeight
    self.paddle_x = (w - self.paddle_w) / 2.0;
    self.paddle_y = h - self.paddle_h - 100;
    self.ball_x = self.paddle_x + (self.paddle_w - self.ball_w) / 2.0;
    self.ball_y = self.paddle_y - self.ball_h;
    self.score_y = h * 0.2;

    //设置提示的边距
    let des = document.getElementById("des");
    des.style.marginTop = (h * 0.1) + "px";

    /**
     * 游戏主要逻辑
     */
    self.game = new Game(self.fps)
    //改变画布宽高
    self.game.canvas.width = w;
    self.game.canvas.height = h;
    /**
     * 生成场景（根据游戏难度级别不同，生成不同关卡）
     */
    self.scene = new Scene(self.LV)
    // 实例化所有砖块对象集合
    self.blockList = self.scene.initBlockList(self.game)
    /**
     * 小球
     */
    self.ball = new Ball(self)
    /**
     * 挡板
     */
    self.paddle = new Paddle(self)
    /**
     * 计分板
     */
    self.score = new Score(self)
    /**
     * 游戏初始化
     */
    self.game.init(self)
  },
  reStart: function () {
    let self = this
    self.ball.x = self.paddle.x + (self.paddle_w - self.ball_w) / 2.0;
    self.ball.y = self.paddle_y - self.ball_h - 1;
    self.game.state = self.game.state_RUNNING;
  }
}
_main.start()

let gavegame = new GaveGamePlatform();
gavegame.init();
