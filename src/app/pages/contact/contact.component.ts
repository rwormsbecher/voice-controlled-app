import {Component, effect, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {VoiceControlService} from '../../services/voice-control.service';

@Component({
    selector: 'app-contact',
    imports: [
        ReactiveFormsModule,
        NgIf,
        MatFormFieldModule, MatInputModule, MatButtonModule
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    form: FormGroup;
    @ViewChild('contactForm') formElement!: ElementRef<HTMLFormElement>;

    constructor(private fb: FormBuilder, private voiceControlService: VoiceControlService) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required]
        });


        effect(() => {
            const command = this.voiceControlService.command();

            if (command) {
                if (
                    command.includes('enter form') ||
                    command.includes('formulier invullen') ||
                    command.includes('输入表单')
                ) {
                    this.enterForm();
                } else if (
                    command.includes('next field') ||
                    command.includes('volgend veld') ||
                    command.includes('下一个字段')
                ) {
                    this.nextField();
                } else if (
                    command.includes('previous field') ||
                    command.includes('vorig veld') ||
                    command.includes('上一个字段')
                ) {
                    this.previousField();
                } else if (
                    command.includes('symbol space') ||
                    command.includes('symbool spatie') ||
                    command.includes('符号空格')
                ) {
                    this.insertSymbol(' ');
                } else if (
                    command.includes('symbol at') ||
                    command.includes('symbool apenstaartje') ||
                    command.includes('符号艾特')
                ) {
                    this.insertSymbol('@');
                } else if (
                    command.includes('symbol period') ||
                    command.includes('symbool punt') ||
                    command.includes('符号句点') ||
                    command.includes('符号聚点') ||
                    command.includes('符号据点')
                ) {
                    this.insertSymbol('.');
                } else if (
                    command.includes('symbol question mark') ||
                    command.includes('symbool vraagteken') ||
                    command.includes('符号问号')
                ) {
                    this.insertSymbol('?');
                } else if
                (
                    command.startsWith('content ') ||
                    command.startsWith('inhoud ') ||
                    command.startsWith('内容')
                ) {
                    let contentValue = '';
                    if (command.startsWith('content ')) {
                        contentValue = command.substring('content '.length).trim();
                    } else if (command.startsWith('inhoud ')) {
                        contentValue = command.substring('inhoud '.length).trim();
                    } else if (command.startsWith('内容')) {
                        contentValue = command.substring('内容'.length).trim();
                    }
                    this.insertContent(contentValue);
                } else if (
                    command.includes('delete') ||
                    command.includes('verwijder') ||
                    command.includes('删除')
                ) {
                    this.backspaceContent();
                } else if (
                    command.includes('reset field') ||
                    command.includes('veld resetten') ||
                    command.includes('重置')
                ) {
                    this.resetField();
                } else if (command.startsWith('letter ')) {
                    const letter = command.substring('letter '.length).trim().toLowerCase();
                    const allowedLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
                    if (allowedLetters.includes(letter)) {
                        this.insertLetter(letter);
                    }
                } else if (
                    command.startsWith('number ') ||
                    command.startsWith('nummer ') ||
                    command.startsWith('数字')
                ) {
                    this.handleNumberCommand(command);
                } else if (
                    command.includes('submit') ||
                    command.includes('versturen') ||
                    command.includes('提交')
                ) {
                    this.submit();
                }
            }

            this.voiceControlService.clearCommand();
        });
    }

    insertContent(value: string) {
        const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
        if (active && 'value' in active) {
            active.value += value;
            active.dispatchEvent(new Event('input'));
        }
    }

    insertLetter(letter: string) {
        const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
        if (active && 'value' in active) {
            active.value += letter;
            active.dispatchEvent(new Event('input'));
        }
    }

    insertSymbol(symbol: string) {
        const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
        if (active && 'value' in active) {
            active.value += symbol;
            active.dispatchEvent(new Event('input'));
        }
    }

    backspaceContent() {
        const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
        if (active && 'value' in active) {
            active.value = active.value.slice(0, -1);
            active.dispatchEvent(new Event('input'));
        }
    }

    resetField() {
        const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
        if (active && 'value' in active) {
            active.value = '';
            active.dispatchEvent(new Event('input'));
        }
    }

    submit() {
        if (this.form.valid) {
            console.log(this.form.value);
        }
    }

    enterForm() {
        const firstInput = this.formElement.nativeElement.querySelector('input, textarea, select') as HTMLElement | null;
        firstInput?.focus();
    }

    nextField() {
        const inputs = Array.from(this.formElement.nativeElement.querySelectorAll('input, textarea')) as HTMLElement[];
        const active = document.activeElement as HTMLElement;
        const currentIndex = inputs.indexOf(active);
        const nextIndex = (currentIndex + 1) % inputs.length;
        inputs[nextIndex]?.focus();
    }

    previousField() {
        const inputs = Array.from(this.formElement.nativeElement.querySelectorAll('input, textarea')) as HTMLElement[];
        const active = document.activeElement as HTMLElement;
        const currentIndex = inputs.indexOf(active);
        const prevIndex = (currentIndex - 1 + inputs.length) % inputs.length;
        inputs[prevIndex]?.focus();
    }

    handleNumberCommand(command: string) {
        let numberWord = '';
        const numberMap: Record<string, string> = {};

        if (command.startsWith('number ')) {
            numberWord = command.substring('number '.length).trim().toLowerCase();
            Object.assign(numberMap, {
                'zero': '0',
                'one': '1',
                'two': '2',
                'three': '3',
                'four': '4',
                'five': '5',
                'six': '6',
                'seven': '7',
                'eight': '8',
                'nine': '9'
            });
        } else if (command.startsWith('nummer ')) {
            numberWord = command.substring('nummer '.length).trim().toLowerCase();
            Object.assign(numberMap, {
                'nul': '0',
                'een': '1',
                'twee': '2',
                'drie': '3',
                'vier': '4',
                'vijf': '5',
                'zes': '6',
                'zeven': '7',
                'acht': '8',
                'negen': '9'
            });
        } else if (command.startsWith('数字')) {
            numberWord = command.substring('数字'.length).trim();
            Object.assign(numberMap, {
                '零': '0',
                '一': '1',
                '二': '2',
                '三': '3',
                '四': '4',
                '五': '5',
                '六': '6',
                '七': '7',
                '八': '8',
                '九': '9'
            });
        }

        const digit = numberMap[numberWord];
        if (digit) {
            this.insertLetter(digit);
        }
    }

}
