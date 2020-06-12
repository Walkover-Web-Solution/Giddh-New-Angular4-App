import { Inject, Optional } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './httpWrapper.service';
import { HttpClient } from '@angular/common/http';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { catchError, map } from 'rxjs/operators';
import { EstimateGetVersionByVersionNoRequest, ProformaDownloadRequest, ProformaFilter, ProformaGetAllVersionRequest, ProformaGetAllVersionsResponse, ProformaGetRequest, ProformaResponse, ProformaUpdateActionRequest } from '../models/api-models/proforma';
import { ESTIMATES_API, PROFORMA_API } from './apiurls/proforma.api';
import { GenericRequestForGenerateSCD, VoucherClass } from '../models/api-models/Sales';

export class ProformaService {
	private companyUniqueName: string;

	constructor(private _generalService: GeneralService, private _http: HttpWrapperService,
		private _httpClient: HttpClient, private errorHandler: GiddhErrorHandler,
		@Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
		this.companyUniqueName = this._generalService.companyUniqueName;
	}

	public getAll(request: ProformaFilter, voucherType: string): Observable<BaseResponse<ProformaResponse, ProformaFilter>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		let url = this._generalService.createQueryString(this.config.apiUrl + PROFORMA_API.getAll, {
			page: request.page, count: request.count, from: request.from, to: request.to, q: request.q, sort: request.sort, sortBy: request.sortBy
		});

		return this._http.post(url
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType), request)
			.pipe(
				map((res) => {
					let data: BaseResponse<ProformaResponse, ProformaFilter> = res;
					data.queryString = { page: request.page, count: request.count, from: request.from, to: request.to, type: 'pdf' };
					data.request = request;
					return data;
				}),
				catchError((e) => this.errorHandler.HandleCatch<ProformaResponse, ProformaFilter>(e, request, { page: request.page, count: request.count, from: request.from, to: request.to, type: 'pdf' })));
	}

	public get(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<VoucherClass, ProformaGetRequest>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + PROFORMA_API.base
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<VoucherClass, ProformaGetRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<VoucherClass, ProformaGetRequest>(e, request)));
	}

	public generate(request: VoucherClass): Observable<BaseResponse<VoucherClass, VoucherClass>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + PROFORMA_API.generate
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', request.voucherDetails.voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountDetails.uniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<VoucherClass, VoucherClass> = res;
				data.queryString = request.accountDetails.uniqueName;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<VoucherClass, VoucherClass>(e, request)));
	}

	public update(request: VoucherClass): Observable<BaseResponse<VoucherClass, VoucherClass>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.put(this.config.apiUrl + PROFORMA_API.base
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', request.voucherDetails.voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountDetails.uniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<VoucherClass, VoucherClass> = res;
				data.queryString = request.accountDetails.uniqueName;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<VoucherClass, VoucherClass>(e, request)));
	}

	public delete(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.deleteWithBody(this.config.apiUrl + PROFORMA_API.base
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<string, ProformaGetRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<string, ProformaGetRequest>(e, request)));
	}

	public download(request: ProformaDownloadRequest, voucherType: string): Observable<BaseResponse<string, ProformaDownloadRequest>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + PROFORMA_API.download
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':fileType', request.fileType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<string, ProformaDownloadRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<string, ProformaDownloadRequest>(e, request)));
	}

	public generateInvoice(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + (voucherType === 'proformas' ? PROFORMA_API.generateInvoice : ESTIMATES_API.generateInvoice)
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<string, ProformaGetRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<string, ProformaGetRequest>(e, request)));
	}

	public generateProforma(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + ESTIMATES_API.generateProforma
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<string, ProformaGetRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<string, ProformaGetRequest>(e, request)));
	}

	public generateViaEstimate(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + PROFORMA_API.generateEstimate
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<string, ProformaGetRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<string, ProformaGetRequest>(e, request)));
	}

	public updateAction(request: ProformaUpdateActionRequest, voucherType: string): Observable<BaseResponse<string, ProformaUpdateActionRequest>> {
		return this._http.put(this.config.apiUrl + PROFORMA_API.updateAction
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<string, ProformaUpdateActionRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<string, ProformaUpdateActionRequest>(e, request)));
	}

	public getEstimateVersionByVersionNumber(request: EstimateGetVersionByVersionNoRequest, voucherType: string): Observable<BaseResponse<string, EstimateGetVersionByVersionNoRequest>> {
		return this._http.post(this.config.apiUrl + ESTIMATES_API.getVersion
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<string, EstimateGetVersionByVersionNoRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<string, EstimateGetVersionByVersionNoRequest>(e, request)));
	}

	public getAllVersions(request: ProformaGetAllVersionRequest, voucherType: string): Observable<BaseResponse<ProformaGetAllVersionsResponse, ProformaGetAllVersionRequest>> {
	    this.companyUniqueName = this._generalService.companyUniqueName;
    	let url = this._generalService.createQueryString(this.config.apiUrl + ESTIMATES_API.getVersions, {
			page: request.page, count: request.count
        });
        this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(url
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<ProformaGetAllVersionsResponse, ProformaGetAllVersionRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<ProformaGetAllVersionsResponse, ProformaGetAllVersionRequest>(e, request)));
	}

	public sendEmail(request: ProformaGetRequest, voucherType: string): Observable<BaseResponse<string, ProformaGetRequest>> {
		this.companyUniqueName = this._generalService.companyUniqueName;
		return this._http.post(this.config.apiUrl + PROFORMA_API.mailProforma
			.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
			.replace(':vouchers', voucherType)
			.replace(':accountUniqueName', encodeURIComponent(request.accountUniqueName)),
			request
		).pipe(
			map((res) => {
				let data: BaseResponse<string, ProformaGetRequest> = res;
				data.queryString = voucherType;
				data.request = request;
				return data;
			}),
			catchError((e) => this.errorHandler.HandleCatch<string, ProformaGetRequest>(e, request)));
	}
}
