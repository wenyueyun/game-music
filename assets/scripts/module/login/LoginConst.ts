export default class LoginConst {
    //command
    public static LOGIN_COMMAND = "login_command";
    public static LOGIN_COMMAND_ENTER = "login_command_enter";

    //model
    public static LOGIN_MODEL_SUCC = "login_model_succ";
    public static LOGIN_MODEL_FAIL = "login_model_fail";

    //mediator
    public static LOGIN_MEDIATOR_OPEN = "login_mediator_open";      //打开UI
    public static LOGIN_MEDIATOR_CLOSE = "login_mediator_close";    //关闭UI

    //event
    public static LOGIN_VIEW_OPEN_SUCC = "login_view_open_succ";    //界面打开成功
    public static LOGIN_VIEW_LOGIN_CLICK = "login_view_login_click";//点击登录按钮
}