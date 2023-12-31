import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Client from "./Client";
import {GameObject} from "UnityEngine";
import GameTimer from "./GameTimer";
import {ZepetoWorldMultiplay} from "ZEPETO.World";


//전체 시간, 백신 기계 위치 세팅, 백신 기계 수리 현황, 팀 나누기
export default class GameManager extends ZepetoScriptBehaviour {

    public multiPlay: ZepetoWorldMultiplay;
    private client:Client;
    private gameTimer: GameTimer;

    //싱글톤
    public static instance:GameManager = null
    public static getInstance() {
        if (this.instance == null) {
            this.instance = GameObject.FindObjectOfType<GameManager>();
        }
        return this.instance
    }

    Start(){
        this.client = Client.getInstance();
        this.gameTimer = GameTimer.getInstance();
    }

    
    //전체 게임 타이머 시작하기
    private timerStart() {

    }

}