//todo - write module overview
/**
 * @module datepicker-simple
 */
var Simple,
  getCN = Y.ClassNameManager.getClassName,
  CONTENT_BOX = "contentBox",
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
  MS_MINUTE = 60000,
  MS_HOUR = MS_MINUTE * 60,
  MS_DAY = MS_HOUR * 24,
  TPL_INPUT = '<input />';

Simple = Y.Base.create('datepickerSimple', Y.Widget, [ ], {
  initializer : function() {},
  destructor : function() {
    //todo - valid destructor
    this._inputDate.remove().destroy(true);
    this._inputTime.remove().destroy(true);
  },
  renderUI : function() {
    var cb = this.get(CONTENT_BOX);

    this._inputDate = Y.Node.create(TPL_INPUT, Y.config.doc);
    this._inputTime = Y.Node.create(TPL_INPUT, Y.config.doc);

    this._inputDate.addClass(Simple.CLASS_NAMES.DATE);
    this._inputTime.addClass(Simple.CLASS_NAMES.TIME);

    cb.append(this._inputDate);
    cb.append(this._inputTime);
  },
  bindUI : function() {
    this.after('timeRawChange', this._syncDateUI, this);

    var cb = this.get('contentBox');
    //todo - bind
    //todo - after
    //todo - prevent invalid input values changes
    //todo - handle input value changes
    //todo - mousewheel handler
    cb.delegate('keydown', this._defaultPressDelegateFn, 'input', this);
  },
  _defaultPressDelegateFn : function(e) {
    var factor = false,
      type = false;

    switch(e.keyCode) {
      case 38:
        factor = 1;
        break;
      case 40:
        factor = -1;
        break;
    }

    if (e.currentTarget === this._inputDate) {
      if (e.shiftKey && e.ctrlKey) {
        type = YEAR;
      }
      else if (e.ctrlKey) {
        type = MONTH;
      }
      else {
        type = DAY;
      }
    }
    else {
      type = (e.shiftKey || e.ctrlKey) ? HOUR : MINUTE;
    }

    if(type && factor) {
      this._addTime(type, factor);
    }

    //halt an event if we should
    if (factor) {
      e.halt();
    }
  },
  _addTime : function(type, factor) {
    var timeRaw = this.get('timeRaw'),
      minimum = this.get('timeMinimum'),
      maximum = this.get('timeMaximum');

    switch(type) {
      case MINUTE:
        timeRaw += factor * MS_MINUTE;
        break;
      case HOUR:
        timeRaw += factor * MS_HOUR;
        break;
      case DAY:
        timeRaw += factor * MS_DAY;
        break;
      case MONTH:
        timeRaw = (Y.Date.addMonths((new Date(timeRaw)), factor)).getTime();
        break;
      case YEAR:
        timeRaw = (Y.Date.addYears((new Date(timeRaw)), factor)).getTime();
        break;
    }

    if ((!minimum || timeRaw >= minimum) && (!maximum || timeRaw <= maximum)) {
      this.set('timeRaw', timeRaw);
    }
  },
  syncUI : function() {
    this._syncDateUI();
  },
  _syncDateUI : function() {
    var date = new Date(this.get('timeRaw'));

    this._inputDate.set('value', Y.Date.format(date, {
      format : this.get('formatDate')
    }));
    this._inputTime.set('value', Y.Date.format(date, {
      format : this.get('formatTime')
    }));
  }
}, {
  ATTRS : {
    timeRaw : {
      getter : function(value, name) {
        if (!value) {
          value = this.get('timeMinimum') || (new Date()).getTime();
          this.set(name, value);
        }
        return value;
      }
    },
    timeMinimum : { value : false },
    timeMaximum : { value : false },
    formatDate  : { value : '%F' },
    formatTime  : { value : '%R' }
  }
});

Simple.CLASS_NAMES = {
  DATE : getCN('input', 'date'),
  TIME : getCN('input', 'time')
};

// Export
Y.namespace('Datepicker').Simple = Simple;