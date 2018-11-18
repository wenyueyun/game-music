import AppFacade from "../../AppFacade";
import MainConst from "../../module/main/MainConst";
import LoadingConst from "../../module/loading/LoadingConst";
import LoginConst from "../../module/login/LoginConst";
import GameConst from "../const/GameConst";

export default class WXManager {
    private static instance: WXManager = null;
    public static getInstance(): WXManager {
        if (WXManager.instance == null) {
            WXManager.instance = new WXManager();
        }
        return WXManager.instance;
    }

    //登录========================================================================
    private openId: string = ""; // 用户唯一id
    private tempCode: string = ""; //临时登录code
    private appid: string = "wx27bac2b8e23912ff"; // 小程序 appId
    private secret: string = "8423ece86afcc763ac2af4a5e14c7617"; // 小程序 appSecret
    private grant_type: string = "authorization_code"; //填写为 authorization_code
    private session_key: string = ""; //会话密钥

    public nickName: string = ""; //名字
    public avatarUrl: string = ""; //头像url

    public bannerAd: any = null;
    /**
     * 检查当前登录状态是否过期
     */
    public checkSession(): void {
        cc.log("检查当前登录状态是否过期");
        let obj: any =
        {
            success: () => {
                cc.log("登录还是有效的，不需要重新登录");
                this.getSetting();
            },
            fail: () => {
                cc.log("登录状态过期了,需要重新登录");
                this.login();
            }
        };
        wx.checkSession(obj);
    }

    /**
    * 登录微信
    */
    private login(): void {
        cc.log("登录微信");
        let obj: any =
        {
            success: (code: string) => {
                cc.log("微信登录成功");
                this.tempCode = code;
                this.getSetting();
            },
            fail: () => {
                cc.log("微信登录失败");
            }
        };
        wx.login(obj);
    }

    //用户请求过的权限
    private getSetting(): void {
        cc.log("查询用户请求过的权限");
        let data: any =
        {
            success: (res: any) => {
                cc.log("查询用户请求过的权限成功");
                if (res.authSetting['scope.userInfo']) {
                    cc.log("用户已经设置过权限");
                    this.getUserInfo();
                }
                else {
                    cc.log("用户没有设置过权限");
                    this.createUserInfoButton();
                }
            },

            fail: () => {
            }
        }

        wx.getSetting(data);
    }

    //创建获取权限按钮
    public createUserInfoButton(): void {
        cc.log("createUserInfoButton");

        AppFacade.getInstance().sendNotification(MainConst.MAIN_MEDIATOR_LOGIN,true);

        let systemInfo = wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        // https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html
        let button = wx.createUserInfoButton({
            type: 'text',
            text: "   ",
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 60,
                backgroundColor: '#eeeeee00',
                color: '#000000',
                textAlign: 'center',
                fontSize: 20,
                borderRadius: 3
            }
        });

        button.onTap((res) => {
            switch (res.errMsg) {
                case 'getUserInfo:ok':
                    button.destroy();
                    this.getUserInfo();
                default:
                    break;
            }
        });
    }

    /**
    * 获取用户信息
    */
    private getUserInfo(): void {
        cc.log("获取用户信息");
        let data: any =
        {
            lang: "zh_CN",
            success: (res: any) => {
                cc.log("获取用户信息成功");
                console.log(res);
                let userInfo: any = res.userInfo;
                this.nickName = userInfo.nickName; //用户昵称
                this.avatarUrl = userInfo.avatarUrl; //用户头像图片 url
                // let gender: number = userInfo.gender //性别 0：未知、1：男、2：女
                // let province: string = userInfo.province; //用户所在省份
                // let city: string = userInfo.city; //用户所在城市
                // let country: string = userInfo.country; // 用户所在国家
                //获取权限后打开游戏主界面
                this.post("getSelfData");
                this.showShareMenu();
                this.onShareAppMessage();
                AppFacade.getInstance().sendNotification(MainConst.MAIN_MEDIATOR_LOGIN,false);
            },
            fail: () => {
                // this.checkSession(); //获取用户信息失败之后 继续去获取
                cc.log("获取用户信息失败:" + this.tempCode);
            }
        }
        wx.getUserInfo(data);
    }

    //发送消息到子域
    public post(curType: string, curKey: string = "", curValue: string = ""): void {
        wx.getOpenDataContext().postMessage({
            type: curType,
            key: curKey,
            value: curValue
        });
    }

    //分享=================================================================================
    public share(isGroup: boolean = false): void {
        cc.log("share-----------------" + isGroup);
        wx.updateShareMenu({
            withShareTicket: isGroup,
            success: () => {
                cc.log("updateShareMenu----------success")
                this.shareAppMessage();
            }
        })
    }


    //群分享
    public shareAppMessage(): void {
        cc.log("groupShare-----------------");
        wx.shareAppMessage({
            title: "经典小游戏始终好玩如初，来吧！一起来回味吧！",
            imageUrl: GameConst.REMOTE_SERVER_ROOT + "res/share/share.png",
            success: (res) => {
                console.log("转发成功!!!");
                if (res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == "") { //没有群信息，说明分享的是个人
                    console.log("res.shareTickets is null");
                    console.log("请分享到群获得生命值");
                } else { //有群信息
                    console.log("res.shareTickets is not null");
                    if (res.shareTickets.length > 0) {
                        console.log("已回满生命值");
                    }
                }
            },
            fail: (res) => {
                console.log("转发失败!!!");
            }
        })
    }

    //侦听游戏分享，修改分享内容
    public onShareAppMessage(): void {
        wx.onShareAppMessage(
            function () {
                return {
                    title: "节奏古堡，就等你来！",
                    imageUrl: GameConst.REMOTE_SERVER_ROOT + "res/share/share.png",
                    success: (res) => {
                        console.log("分享成功!!!")
                    },
                    fail: (res) => {
                        console.log("分享失败!!!")
                    }
                }
            }
        );
    }


    //显示当前页面的转发按钮
    public showShareMenu(): void {
        cc.log("showShareMenu-----------------");
        wx.showShareMenu({
            // withShareTicket: true,
            success: () => {
                cc.log("showShareMenu----------success")
            }
        })
    }
    //广告=================================================================================

    public createBanner(): void {
        if (this.bannerAd != null) {
            this.bannerAd.destroy();
            this.bannerAd = null;
        }

        var screenHeight = wx.getSystemInfoSync().screenHeight
        var screenWidth = wx.getSystemInfoSync().screenWidth
        let bannerHeight = 80;
        let bannerWidth = 300;

        this.bannerAd = wx.createBannerAd({
            adUnitId: '123',
            style: {
                left: (screenWidth - bannerWidth) / 2,
                top: screenHeight - bannerHeight,
                width: bannerWidth,
            }
        })

        this.bannerAd.onError(err => {
            console.log(err);
        });

        this.bannerAd.onLoad(() => {
            console.log('banner 广告加载成功')
        });

        this.bannerAd.onResize(res => {
            console.log(res.width, res.height)
            console.log(this.bannerAd.style.realWidth, this.bannerAd.style.realHeight)
            this.bannerAd.style.top = screenHeight - this.bannerAd.style.realHeight;
        })

        this.bannerAd.show().then(() => console.log('banner 广告显示'));
    }

    public showBanner(): void {
        if (this.bannerAd != null) {
            this.bannerAd.show().then(() => console.log('banner 广告显示'));
        }
    }

    public hideBanner(): void {
        if (this.bannerAd != null) {
            this.bannerAd.hide().then(() => console.log('banner 广告显示'));
        }
    }
}