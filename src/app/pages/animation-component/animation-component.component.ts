import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, OnInit, ViewChild} from '@angular/core';
import {VoiceControlService} from '../../services/voice-control.service';

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

    characterState = {
        position: new THREE.Vector3(0, 0, -5),
        rotation: new THREE.Euler(0, 0, 0),
        speed: 1,
        currentAnimation: 'Idle'
    };

    constructor(private voiceService: VoiceControlService) {
        // Create an effect to handle command changes
        effect(() => {
            const command = this.voiceService.command();

            if (command) {
                if (command.includes('jump') || command.includes('spring') || command.includes('跳')) {
                    this.jumpCharacter();
                } else if (command.includes('turn right') || command.includes('draai rechts') || command.includes('向右转')) {
                    this.rotateCharacter(-Math.PI / 2);
                } else if (command.includes('turn left') || command.includes('draai links') || command.includes('向左转')) {
                    this.rotateCharacter(Math.PI / 2);
                } else if (command.includes('move forward') || command.includes('ga vooruit') || command.includes('前进')) {
                    this.moveCharacter(0, 0, 1);
                } else if (command.includes('move backward') || command.includes('ga achteruit') || command.includes('后退')) {
                    this.moveCharacter(0, 0, -1);
                } else if (command.includes('move right') || command.includes('ga rechts') || command.includes('向右走')) {
                    this.moveCharacter(1, 0, 0);
                } else if (command.includes('move left') || command.includes('ga links') || command.includes('向左走')) {
                    this.moveCharacter(-1, 0, 0);
                }
            }
            this.voiceService.clearCommand();
        });
    }

    ngOnInit(): void {
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

            // Important: Use string, not object
            this.character.nativeElement.setAttribute('animation-mixer', `clip: ${clip}`);
            console.log(`Switched animation to: ${clip}`);

            const availableClips = this.character.nativeElement.components['animation-mixer']?.mixer?._actions;
            if (availableClips) {
                console.log('Available clips:', Object.keys(availableClips));
            }
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
