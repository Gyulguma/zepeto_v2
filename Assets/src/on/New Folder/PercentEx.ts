import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Camera, Canvas, Collider, GameObject, Transform, Object, AnimationClip, Animation, Time} from 'UnityEngine';
import { Slider , Button} from 'UnityEngine.UI';
import { UnityEvent } from 'UnityEngine.Events';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
 
export default class PercentEx extends ZepetoScriptBehaviour {
    // AnimationClip
    @SerializeField() private animationClip: AnimationClip; 
    // Icon
    @Header("[Icon]")
    @SerializeField() private prefIconCanvas: GameObject;
    @SerializeField() private percent: GameObject;
    @SerializeField() private iconPosition: Transform;
     
    // Unity Event    
    @Header("[Unity Event]")
    public OnClickEvent: UnityEvent;
    public OnTriggerEnterEvent: UnityEvent;
    public OnTriggerExitEvent: UnityEvent;
 
    private _button: Button;
    private _canvas1: Canvas;
    private _canvas2: Canvas;   
    private _cachedWorldCamera: Camera;
    private _isIconActive: boolean = false;
    private _isDoneFirstTrig: boolean = false;
    private animation : Animation; 
    
    // 백신 시간 체크
    private startTime : float = 0;
    private finishTime : float = 5;
    private TimeCheck : boolean = false;
    private isTimePercent: Slider;

    /* 백신 현황판
    @Header("[Source]")
    @SerializeField() private vaccine : Text;
    private vaccineClear : int=5;
    private vaccineCondition : int=0;*/

    private Start() {
        this.animation=this.gameObject.GetComponentInParent<Animation>();
    }
    private Update() {
        if (this._isDoneFirstTrig && this._canvas1.gameObject.activeSelf) {
            this.UpdateIconRotation();
        }
        if(this.TimeCheck) {
            this.startTime+=Time.deltaTime;
            this.HideIcon();
            this.CreateSlide();
            this.isTimePercent.value+=this.startTime;
            if(this.startTime>this.finishTime) {
                this.HideSlide();
                this.AnimationPlay();
                this.isTimePercent.value=0;
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
        this.HideSlide();
        this.TimeCheck=false;
        this.startTime=0;
        this.isTimePercent.value=0;
        this.OnTriggerExitEvent?.Invoke();
    }
     
    public ShowIcon(){
        if (!this._isDoneFirstTrig) {
            this.CreateIcon();
            this._isDoneFirstTrig = true;
        }
        else {
            this._canvas1.gameObject.SetActive(true);
        }
        this._isIconActive = true;
    }
     
    public HideIcon() {
        this._canvas1.gameObject.SetActive(false);
        this._isIconActive = false;
    }
 
    private CreateIcon() {
        if (this._canvas1 === undefined) {
            const canvas1 = GameObject.Instantiate(this.prefIconCanvas, this.iconPosition) as GameObject;
            this._canvas1 = canvas1.GetComponent<Canvas>();
            this._button = canvas1.GetComponentInChildren<Button>();
            this._canvas1.transform.position = this.iconPosition.position;
        }
        this._cachedWorldCamera = Object.FindObjectOfType<Camera>();
        this._canvas1.worldCamera = this._cachedWorldCamera;
 
        this._button.onClick.AddListener(() => {
            this.OnClickIcon();
        });
    }

    private CreateSlide() {
        const canvas2 = GameObject.Instantiate(this.percent, this.iconPosition) as GameObject;
        this._canvas2 = canvas2.GetComponent<Canvas>();
        this.isTimePercent = canvas2.GetComponentInChildren<Slider>();
        this._canvas2.transform.position = this.iconPosition.position;
        this._cachedWorldCamera = Object.FindObjectOfType<Camera>();
        this._canvas2.worldCamera = this._cachedWorldCamera;
        this._canvas2.gameObject.SetActive(true);
    }

    private HideSlide() {
        this._canvas2.gameObject.SetActive(false);
        this._isIconActive = false;
    }
     
    private UpdateIconRotation() {
        this._canvas1.transform.LookAt(this._cachedWorldCamera.transform);
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