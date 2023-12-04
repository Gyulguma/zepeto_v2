import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Button, Image } from 'UnityEngine.UI';
import { Animator, AnimationClip, HumanBodyBones, Material, Renderer, Vector3, SkinnedMeshRenderer, WaitForEndOfFrame, Collider } from 'UnityEngine';
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter, ZepetoPlayer, KnowSockets } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';

export default class CharacterController extends ZepetoScriptBehaviour {

    public newColorMaterial : Material;
    public changeColorButton : Button;
    public crouchButton: Button;
    public attackButton: Button;
    public Button3: Button;
    public isCrouch: bool;

    private _localPlayerAnimator: Animator;
    private _zepetoCharacter: ZepetoCharacter;
    private runSpeed: int;
    private characterHeight: double;
    private characterCenterY: double;
    private characterVisualHeight: double;
    private player: LocalPlayer

    private _originalColorMaterial : Material;
    private _originalAnimeMaterials : Material[];
    private _animeRend : Renderer;
    private _bodyRend : Renderer;
    private _bodyRends : Renderer[];

    Start() {
        this.crouchButton.onClick.AddListener(() => {
            this.isCrouch = !this.isCrouch;
            this._localPlayerAnimator.SetBool("isCrouch", !this._localPlayerAnimator.GetBool("isCrouch"));

            if(this.isCrouch) this._zepetoCharacter.additionalRunSpeed = -this.runSpeed;
            else this._zepetoCharacter.additionalRunSpeed = this.runSpeed;
            this.StartCoroutine(this.CoSetZepetoPlayer());
        })
        this.attackButton.onClick.AddListener(() => {
            if(this._localPlayerAnimator.GetBool("isZombie") == true){
                this._localPlayerAnimator.SetTrigger("Attack");
                this._localPlayerAnimator.CrossFade("Attack", 1, 1, 0.1);
            }
            
            console.log("attack!");

        })
        this.Button3.onClick.AddListener(() => {
            if(this._localPlayerAnimator.GetBool("isZombie") == false){
                this._localPlayerAnimator.SetTrigger("BeCatched");
                this._localPlayerAnimator.SetBool("isZombie", true);
            }
        })
        // Replace with the preset material when the button is pressed
        this.changeColorButton.onClick.AddListener(() => {
            if(this._zepetoCharacter != null) {
                this._bodyRend.material = this.newColorMaterial;
                
                if(this._animeRend != null) {
                    let tempMaterials : Material[] = [this._animeRend.sharedMaterials[0],this._animeRend.sharedMaterials[1],this.newColorMaterial,this._animeRend.sharedMaterials[3]];
                    this._animeRend.sharedMaterials = tempMaterials;
                }
            }
        });

        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, new SpawnInfo(), true);

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.player = ZepetoPlayers.instance.LocalPlayer;
            this._localPlayerAnimator = this.player.zepetoPlayer.character.GetComponentInChildren<Animator>();
            this._zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            this.runSpeed = 3;
            this.StartCoroutine(this.CoGetZepetoHeight(this.player.zepetoPlayer));

            this._zepetoCharacter.gameObject.tag = "Player";
            console.log("middle: "+this._zepetoCharacter.tag);

            // Find the material of the local player's zepeto context
            this._bodyRend= this._zepetoCharacter.Context.GetComponentInChildren<SkinnedMeshRenderer>();
            // Determine if it is an animated avatar and save related information
            this._bodyRends= this._zepetoCharacter.GetComponentsInChildren<SkinnedMeshRenderer>();
            this._bodyRends.forEach((currentRenderer) =>{
                if(currentRenderer.name.includes("ANIME_BASEMODEL")){
                    this._animeRend = currentRenderer; 
                    this._originalAnimeMaterials = this._animeRend.sharedMaterials;
                }
            });
        });
 
    }

    *CoGetZepetoHeight(zepeto: ZepetoPlayer) {
        yield new WaitForEndOfFrame();
        const headPosition = zepeto.character.GetSocket(KnowSockets.HEAD_UPPER).position;
        const leftFootPosition = zepeto.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.LeftFoot).position;
        const rightFootPosition = zepeto.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.RightFoot).position;
        const characterCenter = Vector3.Lerp(leftFootPosition, rightFootPosition, 0.5);
        this.characterHeight = Vector3.Distance(headPosition, characterCenter);

        this.characterCenterY = this.player.zepetoPlayer.character.characterController.center.y;
        this.characterVisualHeight = this.player.zepetoPlayer.character.characterController.height;
   }

   *CoSetZepetoPlayer(){
        if(this.isCrouch){
            let controllerHeight = this.characterHeight / 0.85 * 0.6;
            let controllerCenterY = controllerHeight / 2;

            this.player.zepetoPlayer.character.characterController.height = controllerHeight;
            this.player.zepetoPlayer.character.characterController.center = new Vector3(0, controllerCenterY, 0);  
        }
        else{
            this.player.zepetoPlayer.character.characterController.height = this.characterVisualHeight;
            this.player.zepetoPlayer.character.characterController.center = new Vector3(0, this.characterCenterY, 0);  
        }
   }

   OnCollisionEnter(collider: Collider){
    console.log("collise");
   }

   OnTriggerEnter(collider: Collider){
    console.log("collise");
   }
}