/**
 * @module datepicker-simple-form
 */
var SimpleForm,
  CONTENT_BOX = "contentBox",
  SUBMIT = 'submit',
  KEY_DOWN = 'keydown',
  Datepicker = Y.namespace('Datepicker');

SimpleForm = Y.Base.create('datepickerSimpleForm', Datepicker.Simple, [ ], {
  initializer : function() {
    this.publish(SUBMIT, {
      emitFacade : true
    });

    this._button = (new Y.Plugin.Button.createNode(null, {
      label : this.get('submitLabel')
    }));

    Y.onceAfter(this._afterRenderUI, this, 'renderUI');
    Y.onceAfter(this._afterBindUI, this, 'bindUI');
    Y.after(this._afterShowFn, this, 'show');

    Y.detach('show', this._afterShowFn, this);
  },
  destructor : function() {
    this._button.remove().destroy(true);
    this.get(CONTENT_BOX).detach(KEY_DOWN, this._contentBoxKeyDownFn, this);


  },
  _afterRenderUI : function() {
    var cb = this.get(CONTENT_BOX);

    cb.append(this._button);
  },
  _afterBindUI : function() {
    var cb = this.get(CONTENT_BOX);

    this._button.on('click', this._defButtonClickFn, this);

    cb.on(KEY_DOWN, this._contentBoxKeyDownFn, this);
  },
  _afterShowFn : function() {
    this._inputDate.focus();
  },
  _defButtonClickFn : function(e) {
    this.fire(SUBMIT, { originalEvent: e });
  },
  _contentBoxKeyDownFn : function(e) {
    if (e.keyCode === 13) {
      this.fire(SUBMIT, { originalEvent: e });
    }
  }
}, {
  ATTRS : {
    submitLabel : { value : 'Ok' }
  }
});

Datepicker.SimpleForm = SimpleForm;
