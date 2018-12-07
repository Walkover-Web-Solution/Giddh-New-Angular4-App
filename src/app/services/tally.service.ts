import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { TallyApi } from './apiurls/tally.api';
import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Injectable()
export class TallyService {
  public moment = moment;
  constructor(private errorHandler: ErrorHandler,
              public _httpClient: HttpClient,
              public _http: HttpWrapperService,
              public _router: Router,
              private _generalService: GeneralService,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

  }

  public GetCurrentTallyLogs(companyUniqueName): Observable<BaseResponse<string, string>> {
    return this._http.get(this.config.apiUrl + TallyApi.GET_TALLY_LOGS
      .replace(':companyUniqueName', 'walkovindia154339767837502tc2e'))
      .pipe(map((res) => {
      let data: BaseResponse<string, string> = res;
      data.request = '';
      data.queryString = {};
      // data.response.results.forEach(p => p.isOpen = false);
      return data;
    }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
  }

  public GetOldTallyLogs(payload): Observable<BaseResponse<string, string>> {
    // companyUniqueName
    let params = {}
    params['to'] = payload.to
    params['from'] = payload.from
    return this._http.get(this.config.apiUrl + TallyApi.GET_TALLY_LOGS
      .replace(':companyUniqueName', 'walkovindia154339767837502tc2e'), params)
      .pipe(map((res) => {
        let data: BaseResponse<string, string> = res;
        data.request = '';
        data.queryString = {};
        // data.response.results.forEach(p => p.isOpen = false);
        return data;
      }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
  }

  public DownloadFile(payload) : Observable<BaseResponse<string, string>>{
    let params = {}
    params['fileName'] = payload.fileName;
    return this._http.get(this.config.apiUrl + TallyApi.DOWNLOAD_FILE
      .replace(':companyUniqueName', 'walkovindia154339767837502tc2e')
      , params)
      .pipe(map((res) => {
        let data = this.b64toBlob(res.body, 'application/json', 512);
        saveAs(data, payload.fileName);
        return res;
        // data.response.results.forEach(p => p.isOpen = false);
      }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, '')));
  }

  private b64toBlob = (b64Data, contentType, sliceSize) => {
    let blob;
    let byteArray;
    let byteArrays;
    let byteCharacters;
    let byteNumbers;
    let i;
    let offset;
    let slice;
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    byteCharacters = atob(b64Data);
    byteArrays = [];
    offset = 0;
    while (offset < byteCharacters.length) {
      slice = byteCharacters.slice(offset, offset + sliceSize);
      byteNumbers = new Array(slice.length);
      i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  }
}
