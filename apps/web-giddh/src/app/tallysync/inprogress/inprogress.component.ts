import { Component, OnDestroy, OnInit } from "@angular/core";
import { ToasterService } from "../../services/toaster.service";
import { TallySyncService } from "../../services/tally-sync.service";
import { TallySyncData } from "../../models/api-models/tally-sync";
import { saveAs } from "file-saver";
@Component({
	selector: "app-inprogress-preview",
	templateUrl: "./inprogress.component.html",
	styleUrls: ["./inprogress.component.scss"]
})
export class InprogressComponent implements OnInit, OnDestroy {
	public imgPath: string = "";
	public progressData: TallySyncData[];
	public isPageLoaded = false;
	public MONTHS = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];

	constructor(
		private _toaster: ToasterService,
		private tallysyncService: TallySyncService
	) { }

	public ngOnInit() {
		this.isPageLoaded = true;
		this.getCurrentData();
		setInterval(() => {
			if (this.isPageLoaded) {
				this.getCurrentData();
			}
		}, 30000);
		this.imgPath = isElectron
			? "assets/images/"
			: AppUrl + APP_FOLDER + "assets/images/";
	}

	public ngOnDestroy() {
		this.isPageLoaded = false;
	}

	public getCurrentData() {
		this.tallysyncService.getInProgressSync().subscribe(res => {
			if (res && res.results && res.results.length > 0) {
				this.progressData = res.results;
				this.progressData.forEach(element => {
					element["dateString"] = this.prepareDate(element.updatedAt);
					//completed
					let tallyGroups =
						(element.totalSavedGroups * 100) /
						element.totalTallyGroups;
					let tallyAccounts =
						(element.totalSavedAccounts * 100) /
						element.totalTallyAccounts;
					let tallyEntries =
						(element.totalSavedEntries * 100) /
						element.totalTallyEntries;
					element["groupsPercent"] =
						(isNaN(tallyGroups) ? 0 : tallyGroups).toFixed(2) + "%";
					element["accountsPercent"] =
						(isNaN(tallyAccounts) ? 0 : tallyAccounts).toFixed(2) +
						"%";
					element["entriesPercent"] =
						(isNaN(tallyEntries) ? 0 : tallyEntries).toFixed(2) +
						"%";

					//error
					let tallyErrorGroups =
						(element.tallyErrorGroups * 100) /
						element.totalTallyGroups;
					let tallyErrorAccounts =
						(element.tallyErrorAccounts * 100) /
						element.totalTallyAccounts;
					let tallyErrorEntries =
						(element.tallyErrorEntries * 100) /
						element.totalTallyEntries;
					element["groupsErrorPercent"] =
						(isNaN(tallyErrorGroups)
							? 0
							: tallyErrorGroups
						).toFixed(2) + "%";
					element["accountsErrorPercent"] =
						(isNaN(tallyErrorAccounts)
							? 0
							: tallyErrorAccounts
						).toFixed(2) + "%";
					element["entriesErrorPercent"] =
						(isNaN(tallyErrorEntries)
							? 0
							: tallyErrorEntries
						).toFixed(2) + "%";
				});
			}
		});
	}

	// download
	public downloadLog(row: TallySyncData) {
		this.tallysyncService
			.getErrorLog(row.id, row.company.uniqueName)
			.subscribe(res => {
				if (res.status === "success") {
					let blobData = this.base64ToBlob(res.body, "text/csv", 512);
					return saveAs(
						blobData,
						`${row.company.name}-error-log.csv`
					);
				} else {
					this._toaster.errorToast(res.message);
				}
			});
	}

	public base64ToBlob(b64Data, contentType, sliceSize) {
		contentType = contentType || "";
		sliceSize = sliceSize || 512;
		let byteCharacters = atob(b64Data);
		let byteArrays = [];
		let offset = 0;
		while (offset < byteCharacters.length) {
			let slice = byteCharacters.slice(offset, offset + sliceSize);
			let byteNumbers = new Array(slice.length);
			let i = 0;
			while (i < slice.length) {
				byteNumbers[i] = slice.charCodeAt(i);
				i++;
			}
			let byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
			offset += sliceSize;
		}
		return new Blob(byteArrays, { type: contentType });
	}

	// download

	public prepareDate(dateArray: any) {
		if (dateArray[5] < 10) {
			dateArray[5] = "0" + dateArray[5];
		}
		return (
			"Last Import on " +
			dateArray[2] +
			" " +
			this.MONTHS[dateArray[1] - 1] +
			" " +
			dateArray[0] +
			" @ " +
			dateArray[3] +
			":" +
			dateArray[4] +
			":" +
			dateArray[5]
		);
	}
}
