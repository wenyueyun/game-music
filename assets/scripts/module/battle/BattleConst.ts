export default class BattleConst
{
    //command
    public static BATTLE_COMMAND:string = "battle_command";
    
    //model

    //mediator
    public static BATTLE_MEDIATOR_OPEN:string = "battle_mediator_open";
    public static BATTLE_MEDIATOR_CLOSE:string = "battle_mediator_close";
    public static BATTLE_MEDIATOR_MOVE:string = "battle_mediator_move";
    public static BATTLE_MEDIATOR_RESTART:string = "battle_mediator_restart";
    public static BATTLE_MEDIATOR_CONTINUE:string = "battle_mediator_continue";
    public static BATTLE_MEDIATOR_EXIT:string = "battle_mediator_exit";
    //event
    public static BATTLE_VIEW_OPEN_SUCC:string = "battle_view_open_succ";//点击成功打开界面
    public static BATTLE_VIEW_CLOSE_CLICK:string = "battle_view_close_click";//点击刷新按钮
    public static BATTLE_VIEW_PAUSE_CLICK:string = "battle_view_pause_click";//点击刷新按钮
    public static BATTLE_VIEW_EXIT_CLICK:string = "battle_view_exit_click";//点击退出按钮
    public static BATTLE_VIEW_VIDEO_CLICK:string = "battle_view_video_click";//点击视频按钮
    public static BATTLE_VIEW_TOUCH_LEFT_START:string = "battle_view_touch_left_start";//点击左边开始
    public static BATTLE_VIEW_TOUCH_LEFT_END:string = "battle_view_touch_left_end";//点击左边结束
    public static BATTLE_VIEW_TOUCH_RIGHT_START:string = "battle_view_touch_right_start";//点击右边开始
    public static BATTLE_VIEW_TOUCH_RIGHT_END:string = "battle_view_touch_right_end";//点击右边结束
}