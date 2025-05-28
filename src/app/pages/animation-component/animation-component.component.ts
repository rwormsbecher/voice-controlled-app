import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit
} from '@angular/core';
import { VoiceControlService } from '../../services/voice-control.service';

declare const THREE: any;

@Component({
  selector: 'app-animation',
  templateUrl: './animation-component.component.html',
  styleUrls: ['./animation-component.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnimationComponent implements AfterViewInit, OnInit {
  @ViewChild('micButton') micButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('commandOutput') commandOutput!: ElementRef<HTMLDivElement>;
  @ViewChild('character') character!: ElementRef;

  recognition: any;
  characterState = {
    position: new THREE.Vector3(0, 0, -5),
    rotation: new THREE.Euler(0, 0, 0),
    speed: 1,
    currentAnimation: 'Idle'
  };

  constructor(private voiceService: VoiceControlService) {}
  ngOnInit(): void {
    this.voiceService.command$.subscribe((command: string) => {
      console.log('started listening in animation component.');
     

      if (command.includes('jump')) {
        console.log('we are lsitening on the new service for jump' )
        this.jumpCharacter();
      } 
  });
}

  ngAfterViewInit(): void {
    this.character.nativeElement.addEventListener('model-loaded', () => {
      this.updateCharacterTransform();
    });
  }



  moveCharacter(x: number, y: number, z: number) {
    this.setAnimation('Run');
    const movement = new THREE.Vector3(x, y, z).applyEuler(this.characterState.rotation);
    this.characterState.position.add(movement.multiplyScalar(this.characterState.speed));
    this.updateCharacterTransform();
  }

  rotateCharacter(angle: number) {
    this.characterState.rotation.y += angle;
    this.updateCharacterTransform();
  }

  setAnimation(clip: string) {
    if (this.characterState.currentAnimation !== clip) {
      this.characterState.currentAnimation = clip;
      this.character.nativeElement.setAttribute('animation-mixer', { clip });
    }
  }

  updateCharacterTransform() {
    this.character.nativeElement.object3D.position.copy(this.characterState.position);
    this.character.nativeElement.object3D.rotation.y = this.characterState.rotation.y;
  }

  jumpCharacter() {
    this.setAnimation('Jump');
    const startY = this.characterState.position.y;
    const peak = 1;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const height = 4 * progress * (1 - progress) * peak;

      this.characterState.position.y = startY + height;
      this.updateCharacterTransform();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.characterState.position.y = startY;
        this.updateCharacterTransform();
        this.setAnimation('Idle');
      }
    };

    animate();
  }
}