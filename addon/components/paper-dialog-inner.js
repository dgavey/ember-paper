import Ember from 'ember';
import Translate3dMixin from '../mixins/translate3d-mixin';

const { Component } = Ember;

export default Component.extend(Translate3dMixin, {
  tagName: 'md-dialog',
  classNames: ['md-default-theme'],
  classNameBindings: ['contentOverflow:md-content-overflow', 'fullscreen:md-dialog-fullscreen'],

  onTranslateFromEnd() {
    if (this.get('focusOnOpen')) {
      let toFocus = this.$('[autofocus]').last();
      if (toFocus.length === 0) {
        toFocus = this.$('md-dialog-actions button').last();
      }
      toFocus.focus();
    }
  },

  onTranslateToEnd($origin) {
    if ($origin) {
      $origin.focus();
    }
  },

  click(ev) {
    if (this.get('clickOutsideToClose')) {
      ev.stopPropagation();
    }
  }

});
