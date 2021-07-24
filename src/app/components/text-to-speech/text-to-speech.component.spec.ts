import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TextToSpeechComponent} from './text-to-speech.component';
import {AppTranslocoModule} from '../../core/modules/transloco/transloco.module';
import {SimpleChange} from '@angular/core';
import Spy = jasmine.Spy;

describe('TextToSpeechComponent', () => {
  let component: TextToSpeechComponent;
  let fixture: ComponentFixture<TextToSpeechComponent>;

  const voices = [
    {default: false, lang: 'en-US', localService: false, name: 'English non-local', voiceURI: 'English non-local'},
    {default: false, lang: 'en-US', localService: true, name: 'English local', voiceURI: 'English local'},
    {default: false, lang: 'de-DE', localService: false, name: 'German non-local', voiceURI: 'German non-local'},
  ] as SpeechSynthesisVoice[];
  let getVoicesSpy: Spy;

  beforeAll(() => {
    getVoicesSpy = spyOn(window.speechSynthesis, 'getVoices').and.returnValue(voices);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextToSpeechComponent],
      imports: [AppTranslocoModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextToSpeechComponent);
    component = fixture.componentInstance;
    component.lang = 'random';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isSupported).toBeFalse();
    expect(component.isSpeaking).toBeFalse();
  });

  it('voiceschanged event should select local service', () => {
    const voiceSpy = spyOnProperty(component.speech, 'voice', 'set');
    component.lang = 'en';
    window.speechSynthesis.dispatchEvent(new Event('voiceschanged'));
    expect(getVoicesSpy).toHaveBeenCalled();
    expect(voiceSpy).toHaveBeenCalled();

    expect(component.isSupported).toBeTrue();
    const voice = voiceSpy.calls.first().args[0];
    expect(voice.lang).toBe('en-US');
    expect(voice.localService).toBe(true);
  });

  it('language change with no voices should not select service', () => {
    const voiceSpy = spyOnProperty(component.speech, 'voice', 'set');

    component.voices = [];

    component.lang = 'de';
    fixture.detectChanges();
    component.ngOnChanges({lang: new SimpleChange('en', 'de', false)}); // detectChanges does not trigger ngOnChange

    expect(voiceSpy).not.toHaveBeenCalled();
    expect(component.isSupported).toBeFalse();
  });

  it('language change with voices should select service', () => {
    const voiceSpy = spyOnProperty(component.speech, 'voice', 'set');
    component.voices = voices;

    component.lang = 'de';
    fixture.detectChanges();
    component.ngOnChanges({lang: new SimpleChange('en', 'de', false)}); // detectChanges does not trigger ngOnChange

    expect(voiceSpy).toHaveBeenCalled();
    expect(component.isSupported).toBeTrue();
    const voice = voiceSpy.calls.first().args[0];
    expect(voice.lang).toBe('de-DE');
  });

  it('unknown language change should not be supported', () => {
    const voiceSpy = spyOnProperty(component.speech, 'voice', 'set');
    component.voices = voices;

    component.lang = 'unk';
    fixture.detectChanges();
    component.ngOnChanges({lang: new SimpleChange('en', 'unk', false)}); // detectChanges does not trigger ngOnChange

    expect(voiceSpy).not.toHaveBeenCalled();
    expect(component.isSupported).toBeFalse();
  });

  it('play should start speaking', () => {
    component.isSpeaking = false;

    spyOn(window.speechSynthesis, 'speak').and.callFake(() => component.speech.dispatchEvent(new Event('start')));
    component.play();

    expect(component.isSpeaking).toBeTrue();
  });

  it('cancel should stop speaking', () => {
    component.isSpeaking = true;

    spyOn(window.speechSynthesis, 'cancel').and.callFake(() => component.speech.dispatchEvent(new Event('end')));
    component.cancel();

    expect(component.isSpeaking).toBeFalse();
  });
});
