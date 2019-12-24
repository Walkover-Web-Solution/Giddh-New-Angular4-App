import { takeUntil } from 'rxjs/operators';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from '../../../../lodash-optimized';
import { ElementViewContainerRef } from '../../../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { LetterTemplateComponent } from './letter/letter.template.component';

const TEMPLATES = ['LETTER', 'CLASSIC', 'ROYAL'];
const TEMPLATES_ID = ['t001', 't002', 't003'];

@Component({
	templateUrl: './template.component.html',
	styleUrls: ['./template.component.scss']
})
export class CreateInvoiceTemplateComponent implements OnInit, OnDestroy {

	// templates
	@ViewChild('letterTemplateComponent') public letterTemplateComponent: ElementViewContainerRef;

	public TEMPLATES_ID: string[] = TEMPLATES_ID;
	public TEMPLATES: string[] = TEMPLATES;
	public templateId: string;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private componentFactoryResolver: ComponentFactoryResolver
	) {
		//
	}

	public ngOnInit() {
		// check if route params exist else redirect to dashboard
		this._route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
			if (params['templateId'] && (_.indexOf(TEMPLATES_ID, params['templateId']) !== -1)) {
				this.templateId = params['templateId'];
				this.loadComponents();
			} else {
				this._router.navigate(['/create-invoice/invoice']);
			}
		});
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public loadLetterTemplateComponent() {
		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(LetterTemplateComponent);
		let viewContainerRef = this.letterTemplateComponent.viewContainerRef;
		viewContainerRef.remove();
		let componentRef = viewContainerRef.createComponent(componentFactory);
		let componentInstance = componentRef.instance as LetterTemplateComponent;
		componentInstance.closeAndDestroyComponent.subscribe((data: any) => {
			componentInstance.destroyed$.next(true);
			componentInstance.destroyed$.complete();
		});
	}

	private loadComponents() {
		switch (this.templateId) {
			case TEMPLATES_ID[0]: {
				this.loadLetterTemplateComponent();
				break;
			}
			default:
				break;
		}
	}
}
