export default class PauseConst {
    //command
    public static PAUSE_COMMAND = "pause_command";
    public static PAUSE_COMMAND_ENTER = "pause_command_enter";

    //model
  

    //mediator
    public static PAUSE_MEDIATOR_OPEN = "pause_mediator_open";      //打开UI
    public static PAUSE_MEDIATOR_CLOSE = "pause_mediator_close";    //关闭UI

    //event
    public static PAUSE_VIEW_OPEN_SUCC = "pause_view_open_succ"; //界面打开成功
    public static PAUSE_VIEW_EXIT_CLICK = "pause_view_exit_click"; //点击退出按钮
    public static PAUSE_VIEW_RESTART_CLICK = "pause_view_restart_click"; //点击重新开始按钮
    public static PAUSE_VIEW_CONTINUE_CLICK = "pause_view_continue_click"; //点击继续按钮
}