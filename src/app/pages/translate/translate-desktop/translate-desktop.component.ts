import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../components/base/base.component';
import {IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {TranslateInputButtonComponent} from '../input/button/button.component';
import {LanguageSelectorsComponent} from '../language-selectors/language-selectors.component';
import {SendFeedbackComponent} from '../send-feedback/send-feedback.component';
import {TranslocoPipe} from '@ngneat/transloco';
import {NtkmeButtonModule} from '@ctrl/ngx-github-buttons';
import {SpokenToSignedComponent} from '../spoken-to-signed/spoken-to-signed.component';
import {SignedToSpokenComponent} from '../signed-to-spoken/signed-to-spoken.component';
import {DropPoseFileComponent} from '../drop-pose-file/drop-pose-file.component';
import {MatTooltip} from '@angular/material/tooltip';
import {addIcons} from 'ionicons';
import {cloudUpload, language, videocam} from 'ionicons/icons';

@Component({
  selector: 'app-translate-desktop',
  templateUrl: './translate-desktop.component.html',
  styleUrls: ['./translate-desktop.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonTitle,
    TranslateInputButtonComponent,
    LanguageSelectorsComponent,
    SendFeedbackComponent,
    TranslocoPipe,
    NtkmeButtonModule,
    SpokenToSignedComponent,
    SignedToSpokenComponent,
    DropPoseFileComponent,
    MatTooltip,
  ],
})
export class TranslateDesktopComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);

  spokenToSigned: boolean;

  constructor() {
    super();

    addIcons({language, videocam, cloudUpload});
  }

  ngOnInit(): void {
    this.spokenToSigned$
      .pipe(
        tap(spokenToSigned => (this.spokenToSigned = spokenToSigned)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
