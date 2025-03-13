Vue.use(VToaster, {
    timeout: 5000
});
Vue.directive('tooltip', function (el, binding) {
    $(el).tooltip({
        title: binding.value,
        trigger: 'hover'
    });
});
Vue.filter('currency', function (value) {
    return parseFloat(value).toFixed(2);
});
Vue.component('date-range-picker', {
    props: ['id', 'range'],
    template: '<div class="input-group"><input type="text" :id="id" :name="id" class="form-control" /><span class="input-group-addon"><span class="fa fa-calendar"></span></span></div>',
    watch: {
        range: function (val, oldVal) {
            var input = $('input[name="' + this.id + '"]');
            input.data('daterangepicker').setStartDate(val.startDate);
            input.data('daterangepicker').setEndDate(val.endDate);
        }
    },
    mounted: function () {
        var self = this;
        var input = $('input[name="' + this.id + '"]');
        input.daterangepicker({
            ranges: {
                'Last 1 Day': [
                    moment().subtract(1, 'days'),
                    moment()
                ],
                'Last 7 Days': [
                    moment().subtract(6, 'days'),
                    moment()
                ],
                'Last 30 Days': [
                    moment().subtract(29, 'days'),
                    moment()
                ],
                'Last 6 Months': [
                    moment().subtract(6, 'months'),
                    moment()
                ],
                'Last 1 Year': [
                    moment().subtract(12, 'months'),
                    moment()
                ]
            },
            startDate: this.range.startDate,
            endDate: this.range.endDate,
            locale: {
                format: 'D-MMM-YY'
            },
        });
        input.on('apply.daterangepicker', function (ev, picker) {
            var dateObj = {
                startDate: picker.startDate,
                endDate: picker.endDate,
            }
            self.$emit('daterangechanged', dateObj);
        });
    }
});

var app = new Vue({
    data: {
        dateRange: {
            startDate: moment().subtract(30, 'days'),
            endDate: moment()
        },
        ledgerData: {
            account: {},
            ledgersTransactions: {
                balance: {
                    type: ''
                },
                ledgers: []
            }
        },
        legderBalanceData: {
            forwardedBalance: {
                amount: '',
                type: ''
            },
            closingBalance: {
                amount: '',
                type: ''
            }
        },
        reckoningDebitTotal: 0,
        reckoningCreditTotal: 0,
        responseMsg: '',
        selectedTab: '',
        isResponsive: false,
        formSubmitted: false,
        searchText: '',
        cForm: {},
        txn: {},
        folderPath: '',
        isSmall: false,
        voucherVersion: 1
    },
    mounted: function () {
        this.folderPath = window.location.hostname === 'localhost' ? '' : 'app/';
        var id = this.getParameterByName('id');
        this.getMagicLinkData(id);
        this.voucherVersion = Number(this.getParameterByName('voucherVersion'));
    },
    created: function () {
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleResize)
    },
    methods: {
        getMagicLinkData: function (id, from, to) {
            $('tr').tooltip('dispose');
            $('span').tooltip('dispose');

            var url = '';
            var apiBaseUrl = this.getApi();
            if (from && to) {
                url = apiBaseUrl + 'magic-link-ledger/' + id + '?sort=asc&from=' + from + '&to=' + to;
            } else {
                url = apiBaseUrl + 'magic-link-ledger/' + id + '?sort=asc';
            }

            if (id) {
                axios.get(url)
                    .then(response => {
                        // JSON responses are automatically parsed.
                        if (response.data.status === 'success') {
                            this.ledgerData = response.data.body;

                            this.dateRange = {};
                            this.dateRange.startDate = moment(this.ledgerData.ledgersTransactions.from, 'DD-MM-YYYY');
                            this.dateRange.endDate = moment(this.ledgerData.ledgersTransactions.to, 'DD-MM-YYYY');
                        }

                        // hide loader and show app
                        document.getElementById("loader-1").style.display = 'none';
                        document.getElementById("app").style.display = 'block';
                    })
                    .catch(e => {
                        var msg = 'Something Went Wrong';
                        if (e && e.response && e.response.data) {
                            msg = e.response.data.message;
                        }
                        this.$toaster.error(msg);
                    });

                if (from && to) {
                    url = apiBaseUrl + 'magic-link-ledger-balance/' + id + '?from=' + from + '&to=' + to;
                } else {
                    url = apiBaseUrl + 'magic-link-ledger-balance/' + id;
                }

                axios.get(url)
                    .then(response => {
                        if (response.data.status === 'success') {
                            this.legderBalanceData = response.data.body;

                            if (this.legderBalanceData) {
                                if (this.legderBalanceData.forwardedBalance.amount === 0) {
                                    let recTotal = 0;
                                    if (this.legderBalanceData.creditTotal > this.legderBalanceData.debitTotal) {
                                        recTotal = this.legderBalanceData.creditTotal;
                                    } else {
                                        recTotal = this.legderBalanceData.debitTotal;
                                    }
                                    this.reckoningCreditTotal = recTotal;
                                    this.reckoningDebitTotal = recTotal;
                                } else {
                                    if (this.legderBalanceData.forwardedBalance.type === 'DEBIT') {
                                        if ((this.legderBalanceData.forwardedBalance.amount + this.legderBalanceData.debitTotal) <= this.legderBalanceData.creditTotal) {
                                            this.reckoningCreditTotal = this.legderBalanceData.creditTotal;
                                            this.reckoningDebitTotal = this.legderBalanceData.creditTotal;
                                        } else {
                                            this.reckoningCreditTotal = this.legderBalanceData.forwardedBalance.amount + this.legderBalanceData.debitTotal;
                                            this.reckoningDebitTotal = this.legderBalanceData.forwardedBalance.amount + this.legderBalanceData.debitTotal;
                                        }
                                    } else {
                                        if ((this.legderBalanceData.forwardedBalance.amount + this.legderBalanceData.creditTotal) <= this.legderBalanceData.debitTotal) {
                                            this.reckoningCreditTotal = this.legderBalanceData.debitTotal;
                                            this.reckoningDebitTotal = this.legderBalanceData.debitTotal;
                                        } else {
                                            this.reckoningCreditTotal = this.legderBalanceData.forwardedBalance.amount + this.legderBalanceData.creditTotal;
                                            this.reckoningDebitTotal = this.legderBalanceData.forwardedBalance.amount + this.legderBalanceData.creditTotal;
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .catch(e => {
                        var msg = 'Something Went Wrong';
                        if (e && e.response && e.response.data) {
                            msg = e.response.data.message;
                        }

                        if ((from && to) || (e && e.response && e.response.data && e.response.data.code !== "NOT_FOUND")) {
                            this.$toaster.error(msg);
                        }
                    });
            } else {
                this.$toaster.error('Magic link ID not found.');
            }
        },
        getParameterByName: function (name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        checkCompEntry: function (ledger) {
            var unq = ledger.uniqueName;
            ledger.isCompoundEntry = true;
            var ledgerData = this.ledgerData;
            if (ledgerData && ledgerData.ledgersTransactions && ledgerData.ledgersTransactions.ledgers) {
                ledgerData.ledgersTransactions.ledgers.forEach(function (lgr) {
                    if (unq === lgr.uniqueName) {
                        lgr.isCompoundEntry = true;
                    } else {
                        lgr.isCompoundEntry = false;
                    }
                });
            }
            this.ledgerData = {};
            this.ledgerData = ledgerData;
        },
        customFilter: function (txn) {
            return (txn.particular && txn.particular.name.indexOf(this.searchText) != -1);
        },
        filterBy: function (list, value) {
            let arrayList = [];
            arrayList.push(list);

            if (!value) {
                value = "";
            }

            return arrayList.filter(function (txn) {
                return (txn.particular && txn.particular.name.toLowerCase().includes(value.toLowerCase())) || String(txn.amount).includes(value.toLowerCase());
            });
        },
        onDateRangeChanged: function (picker) {
            var dates = {
                startDate: moment(picker.startDate).format('DD-MM-YYYY'),
                endDate: moment(picker.endDate).format('DD-MM-YYYY')
            };
            var id = this.getParameterByName('id');

            // show loader when date changes
            document.getElementById("loader-1").style.display = 'flex';
            document.getElementById("app").style.display = 'none';

            this.getMagicLinkData(id, dates.startDate, dates.endDate);
        },
        handleResize: function (ev) {
            var width = ev.currentTarget.innerWidth;
            if (width > 992) {
                this.selectedTab = '';
                this.isResponsive = false;
            } else {
                this.isResponsive = true;
            }
            if (width < 768) {
                this.isSmall = true;
            } else {
                this.isSmall = false;
            }
        },
        downloadInvoice: function (entry) {
            var id = this.getParameterByName('id');
            var apiBaseUrl = this.getApi();
            if (id) {
                var voucherVersion = this.voucherVersion;
                var apiObservable;
                if (voucherVersion === 2) {
                    apiObservable = axios.post(apiBaseUrl + 'magic-link/' + id + '/download-voucher?voucherVersion=' + voucherVersion + '&downloadOption=VOUCHER', {
                        voucherType: entry.voucherName,
                        uniqueName: (entry.voucherUniqueName) ? entry.voucherUniqueName : undefined,
                        entryUniqueName: (entry.voucherUniqueName) ? undefined : entry.entryUniqueName
                    }, {
                        responseType: 'blob'
                    });
                } else {
                    apiObservable = axios.get(apiBaseUrl + 'magic-link/' + id + '/download-invoice/' + entry.voucherNumber);
                }

                apiObservable.then(response => {
                    // JSON responses are automatically parsed.
                    if (response?.data?.status !== "error") {
                        if (voucherVersion === 2) {
                            return saveAs(response?.data, entry.voucherNumber + '.pdf');
                        } else {
                            var blobData = this.base64ToBlob(response.data.body, 'application/pdf', 512);
                            return saveAs(blobData, entry.voucherNumber + '.pdf');
                        }
                    } else {
                        this.$toaster.error('Invoice for ' + entry.voucherNumber + ' cannot be downloaded now.');
                    }
                })
                .catch(e => {
                    this.$toaster.error('Invoice for ' + entry.voucherNumber + ' cannot be downloaded now.');
                })
            } else {
                this.$toaster.error('Magic link ID not found.');
            }
        },
        downloadAttachedFile: function (entry, attachedFileUniqueName, attachedFileName) {
            var id = this.getParameterByName('id');
            var apiBaseUrl = this.getApi();
            if (id) {
                var voucherVersion = this.voucherVersion;
                var apiObservable;
                if (voucherVersion === 2) {
                    apiObservable = axios.post(apiBaseUrl + 'magic-link/' + id + '/download-voucher?voucherVersion=' + voucherVersion + '&downloadOption=ATTACHMENT', {
                        voucherType: entry.voucherName,
                        uniqueName: (entry.voucherUniqueName) ? entry.voucherUniqueName : undefined,
                        entryUniqueName: (entry.voucherUniqueName) ? undefined : entry.entryUniqueName
                    }, {
                        responseType: 'blob'
                    });
                } else {
                    apiObservable = axios.get(apiBaseUrl + 'magic-link/' + id + '/ledger/upload/' + attachedFileUniqueName);
                }

                apiObservable.then(response => {
                    // JSON responses are automatically parsed.
                    if (response?.data?.status !== "error") {
                        if (voucherVersion === 2) {
                            return saveAs(response?.data, attachedFileName);
                        } else {
                            var blobData = this.base64ToBlob(response.data.body.uploadedFile, 'image/' + response.data.body.fileType, 512);
                            return saveAs(blobData, response.data.body.name);
                        }
                    } else {
                        this.$toaster.error('Attachment ' + attachedFileName + ' cannot be downloaded now.');
                    }
                })
                    .catch(e => {
                        this.$toaster.error('Attachment ' + attachedFileName + ' cannot be downloaded now.');
                    })
            } else {
                this.$toaster.error('Magic link ID not found.');
            }
        },
        downloadPurchaseInvoice: function (invoiceNum) {
            this.$toaster.error('Invoice for ' + invoiceNum + ' cannot be downloaded now.');
        },
        base64ToBlob: function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];
            var offset = 0;
            while (offset < byteCharacters.length) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);
                var byteNumbers = new Array(slice.length);
                var i = 0;
                while (i < slice.length) {
                    byteNumbers[i] = slice.charCodeAt(i);
                    i++;
                }
                var byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
                offset += sliceSize;
            }
            return new Blob(byteArrays, {
                type: contentType
            });
        },
        validateEmail: function (emailStr) {
            let pattern =
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(emailStr);
        },
        submitForm: function (formObj, ev) {
            ev.preventDefault();
            let form = formObj;
            if (!(this.validateEmail(form.email))) {
                this.$toaster.warning('Enter valid Email ID');
                return false;
            }
            this.sendContactFormData(form);
            this.formSubmitted = true;
            this.responseMsg = 'Thanks! we will get in touch with you soon';
        },
        sendContactFormData: function (data) {
            axios.get('https://giddh.com/contactus.php?fn=contactUs', {
                params: data
            })
                .then(response => {
                    console.log('the response is :', response);
                })
                .catch(e => {
                    console.log('the error is :', e);
                })
        },
getApi: function () {
    var apiBaseUrl = '';
    var region = this.getParameterByName('region'); // Get the region from URL query params

    // Check if region is present and set the apiBaseUrl accordingly
    if (region) {
        apiBaseUrl = 'https://gbapi.giddh.com/';
    } else {
        const whiteLabelData = JSON.parse(localStorage.getItem('whiteLabel'));
        if (whiteLabelData) {
       apiBaseUrl = `${whiteLabelData?.body?.giddhWhiteLabel?.apiDomain}/`;
        } else {
             // Original logic based on hostname
            switch (window.location.hostname) {
                case 'localhost':
                case 'test.giddh.com':
                    apiBaseUrl = 'https://apitest.giddh.com/';
                    break;
                case 'dev.giddh.com':
                    apiBaseUrl = 'https://apidev.giddh.com/';
                    break;
                case 'stage.giddh.com':
                    apiBaseUrl = 'https://apitest.giddh.com/';
                    break;
                case 'giddh.com':
                case 'books.giddh.com':
                    apiBaseUrl = 'https://api.giddh.com/';
                    break;
                default:
                    apiBaseUrl = 'https://api.giddh.com/';
            }
        }
    }
    return apiBaseUrl;
},
    }
}).$mount('#app');
