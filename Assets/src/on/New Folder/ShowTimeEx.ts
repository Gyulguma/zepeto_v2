import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Camera, Canvas, Collider, GameObject, Transform, Object, AnimationClip, Animation, Time} from 'UnityEngine';
import { Button, Text } from 'UnityEngine.UI';
import { UnityEvent } from 'UnityEngine.Events';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
 
export default class InteractionIcon extends ZepetoScriptBehaviour {
    // AnimationClip
    @SerializeField() private animationClip: AnimationClip; 
    // Icon
    @Header("[Icon]")
    @SerializeField() private prefIconCanvas: GameObject;
    @SerializeField() private iconPosition: Transform;
     
    // Unity Event    
    @Header("[Unity Event]")
    public OnClickEvent: UnityEvent;
    public OnTriggerEnterEvent: UnityEvent;
    public OnTriggerExitEvent: UnityEvent;
 
    private _button: Button;
    private _canvas: Canvas;   
    private _cachedWorldCamera: Camera;
    private _isIconActive: boolean = false;
    private _isDoneFirstTrig: boolean = false;
    private animation : Animation; 
    
    // 백신 시간 체크
    private startTime : float = 0;
    private finishTime : float = 5;
    private TimeCheck : boolean = false;

    /* 백신 현황판
    @Header("[Source]")
    @SerializeField() private vaccine : Text;
    private vaccineClear : int=5;
    private vaccineCondition : int=0;*/

    private Start() {
        this.animation=this.gameObject.GetComponentInParent<Animation>();
    }
    private Update() {
        if (this._isDoneFirstTrig && this._canvas?.gameObject.activeSelf) {
            this.UpdateIconRotation();
        }
        if(this.TimeCheck) {
            this.startTime+=Time.deltaTime;
            if(this.startTime>this.finishTime) {
                this.AnimationPlay();
                //this.Vaccine();
                this.TimeCheck=false;
            }

        }
    }
     
    private OnTriggerEnter(coll: Collider) {
        if (coll != ZepetoPlayers.instance.LocalPlayer?.zepetoPlayer?.character.GetComponent<Collider>()) {
            return;
        }
        this.ShowIcon();
        this.OnTriggerEnterEvent?.Invoke();
    }
 
    private OnTriggerExit(coll: Collider) {
        if (coll != ZepetoPlayers.instance.LocalPlayer?.zepetoPlayer?.character.GetComponent<Collider>()) {
            return;
        }
         
        this.HideIcon();
        this.TimeCheck=false;
        this.startTime=0;
        this.OnTriggerExitEvent?.Invoke();
    }
     
    public ShowIcon(){
        if (!this._isDoneFirstTrig) {
            this.CreateIcon();
            this._isDoneFirstTrig = true;
        }
        else {
            this._canvas.gameObject.SetActive(true);
        }
        this._isIconActive = true;
    }
     
    public HideIcon() {
        this._canvas?.gameObject.SetActive(false);
        this._isIconActive = false;
    }
 
    private CreateIcon() {
        if (this._canvas === undefined) {
            const canvas = GameObject.Instantiate(this.prefIconCanvas, this.iconPosition) as GameObject;
            this._canvas = canvas.GetComponent<Canvas>();
            this._button = canvas.GetComponentInChildren<Button>();
            this._canvas.transform.position = this.iconPosition.position;
        }
        this._cachedWorldCamera = Object.FindObjectOfType<Camera>();
        this._canvas.worldCamera = this._cachedWorldCamera;
 
        this._button.onClick.AddListener(() => {
            this.OnClickIcon();
        });
    }
     
    private UpdateIconRotation() {
        this._canvas.transform.LookAt(this._cachedWorldCamera.transform);
    }
 
    private OnClickIcon() {
        this.OnClickEvent?.Invoke();
        this.TimeCount();
        
    }
    private AnimationPlay() {
        this.animation.Play("Crate_Open");
    }    
    private TimeCount() {
        this.TimeCheck=true;
    }
    /*private Vaccine() {
        this.vaccineCondition+=1;
        this.vaccine.text = "백신 현황"+"("+this.vaccineCondition+"/"+this.vaccineClear+")";
    }*/
    
}