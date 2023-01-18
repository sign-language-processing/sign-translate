import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {BaseComponent} from '../../components/base/base.component';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {SetVideo, StartCamera} from '../../core/modules/ngxs/store/video/video.actions';
import {TranslocoService} from '@ngneat/transloco';
import {SetSetting} from '../../modules/settings/settings.actions';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent extends BaseComponent implements OnInit {
  receiveVideo$ = this.store.select<boolean>(state => state.settings.receiveVideo);

  constructor(private store: Store, private translocoService: TranslocoService) {
    super();
  }

  ngOnInit(): void {
    this.translocoService.events$
      .pipe(
        tap(() => (document.title = this.translocoService.translate('playground.title'))),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.receiveVideo$
      .pipe(
        filter(Boolean),
        tap(() => this.store.dispatch(StartCamera)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.store.dispatch(new SetSetting('pose', true));
    this.store.dispatch(new SetVideo('assets/tmp/example-sentence.mp4'));
  }
}
