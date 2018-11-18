const { ccclass, property } = cc._decorator;

import AppFacade from './AppFacade';

@ccclass
export default class Game extends cc.Component {

    onLoad() {
        AppFacade.getInstance().startup();
    }

    update(dt): void {
        AppFacade.getInstance().update(dt);
    }
}
