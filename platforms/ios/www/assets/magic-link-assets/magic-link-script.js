Vue.use(VToaster, {
  timeout: 5000
});
Vue.directive('tooltip', function (el, binding) {
  $(el).tooltip({
    title: binding.value,
    placement: binding.arg,
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
      ledgerTransactions: {
        forwardedBalance: {
          amount: '',
          type: ''
        },
        balance: {
          type: ''
        },
        ledgers: []
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
    isSmall: false
  },
  mounted: function () {
    this.folderPath = window.location.hostname === 'localapp.giddh.com' ? '' : 'app/';
    var id = this.getParameterByName('id');
    this.getMagicLinkData(id)
  },
  created: function () {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    getMagicLinkData: function (id, from, to) {
      var url = '';
      var apiBaseUrl = this.getApi();
      if (from && to) {
        url = apiBaseUrl + 'magic-link/' + id + '?from=' + from + '&to=' + to;
      } else {
        url = apiBaseUrl + 'magic-link/' + id;
      }
      if (id) {
        axios.get(url)
          .then(response => {
            // JSON responses are automatically parsed.
            if (response.data.status === 'success') {
              this.ledgerData = response.data.body;

              if (this.ledgerData && this.ledgerData.ledgerTransactions) {
                if (this.ledgerData.ledgerTransactions.forwardedBalance.amount === 0) {
                  let recTotal = 0;
                  if (this.ledgerData.ledgerTransactions.creditTotal > this.ledgerData.ledgerTransactions.debitTotal) {
                    recTotal = this.ledgerData.ledgerTransactions.creditTotal;
                  } else {
                    recTotal = this.ledgerData.ledgerTransactions.debitTotal;
                  }
                  this.reckoningCreditTotal = recTotal;
                  this.reckoningDebitTotal = recTotal;
                } else {
                  if (this.ledgerData.ledgerTransactions.forwardedBalance.type === 'DEBIT') {
                    if ((this.ledgerData.ledgerTransactions.forwardedBalance.amount + this.ledgerData.ledgerTransactions.debitTotal) <= this.ledgerData.ledgerTransactions.creditTotal) {
                      this.reckoningCreditTotal = this.ledgerData.ledgerTransactions.creditTotal;
                      this.reckoningDebitTotal = this.ledgerData.ledgerTransactions.creditTotal;
                    } else {
                      this.reckoningCreditTotal = this.ledgerData.ledgerTransactions.forwardedBalance.amount + this.ledgerData.ledgerTransactions.debitTotal;
                      this.reckoningDebitTotal = this.ledgerData.ledgerTransactions.forwardedBalance.amount + this.ledgerData.ledgerTransactions.debitTotal;
                    }
                  } else {
                    if ((this.ledgerData.ledgerTransactions.forwardedBalance.amount + this.ledgerData.ledgerTransactions.creditTotal) <= this.ledgerData.ledgerTransactions.debitTotal) {
                      this.reckoningCreditTotal = this.ledgerData.ledgerTransactions.debitTotal;
                      this.reckoningDebitTotal = this.ledgerData.ledgerTransactions.debitTotal;
                    } else {
                      this.reckoningCreditTotal = this.ledgerData.ledgerTransactions.forwardedBalance.amount + this.ledgerData.ledgerTransactions.creditTotal;
                      this.reckoningDebitTotal = this.ledgerData.ledgerTransactions.forwardedBalance.amount + this.ledgerData.ledgerTransactions.creditTotal;
                    }
                  }
                }
              }

              this.dateRange = {};
              this.dateRange.startDate = moment(this.ledgerData.fromDate, 'DD-MM-YYYY');
              this.dateRange.endDate = moment(this.ledgerData.toDate, 'DD-MM-YYYY');
              $('tr').tooltip('hide');
              document.getElementById("loader-1").style.display = 'none';
              document.getElementById("app").style.display = 'block';
            }
          })
          .catch(e => {
            this.$toaster.error('Something went wrong.');
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
      ledgerData.ledgerTransactions.ledgers.forEach(function (lgr) {
        if (unq === lgr.uniqueName) {
          lgr.isCompoundEntry = true;
        } else {
          lgr.isCompoundEntry = false;
        }
      });
      this.ledgerData = {};
      this.ledgerData = ledgerData;
    },
    customFilter: function (txn) {
      return txn.particular.name.indexOf(this.searchText) != -1;
    },
    filterBy: function (list, value) {
      return list.filter(function (txn) {
        return txn.particular.name.toLowerCase().includes(value) || String(txn.amount).includes(value);
      });
    },
    onDateRangeChanged: function (picker) {
      var dates = {
        startDate: moment(picker.startDate).format('DD-MM-YYYY'),
        endDate: moment(picker.endDate).format('DD-MM-YYYY')
      };
      var id = this.getParameterByName('id');
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
    downloadInvoice: function (invoiceNum) {
      var id = this.getParameterByName('id');
      var apiBaseUrl = this.getApi();
      if (id) {
        axios.get(apiBaseUrl + 'magic-link/' + id + '/download-invoice/' + invoiceNum)
          .then(response => {
            // JSON responses are automatically parsed.
            if (response.status === 200 && response.data.status === 'success') {
              var blobData = this.base64ToBlob(response.data.body, 'application/pdf', 512);
              return saveAs(blobData, invoiceNum + '.pdf');
            } else {
              this.$toaster.error('Invoice for ' + invoiceNum + ' cannot be downloaded now.');
            }
          })
          .catch(e => {
            this.$toaster.error('Invoice for ' + invoiceNum + ' cannot be downloaded now.');
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
      switch (window.location.hostname) {
        case 'localapp.giddh.com':
        case 'dev.giddh.com':
          apiBaseUrl = 'http://apitest.giddh.com/';
          break;
        case 'test.giddh.com':
          apiBaseUrl = 'http://apitest.giddh.com/';
          break;
        case 'stage.giddh.com':
          apiBaseUrl = 'http://spi.giddh.com/';
          break;
        case 'giddh.com':
          apiBaseUrl = 'https://api.giddh.com/';
          break;
        default:
          apiBaseUrl = 'http://apidev.giddh.com/';
      }
      return apiBaseUrl;
    }
  }
}).$mount('#app');
