import Ember from 'ember';
import PaperMenuAbstract from './paper-menu-abstract';

/*
 * The paper-menu-container-abstract is responsible for animation and positioning the menu / select /  any other
 * menu based component.
 *
 */
export default Ember.Component.extend({
  transitionEvents: Ember.inject.service(),
  constants: Ember.inject.service(),

  classNames: ['md-default-theme'],
  classNameBindings: ['interaction:md-clickable'],

  menuAbstract: Ember.computed(function() {
    let container = this.nearestOfType(PaperMenuAbstract);
    return container;
  }),

  _resizeHandler: Ember.computed(function() {
    return () => {
      this.get('menuAbstract').registerWrapper(this);
    };
  }),

  moveComponentToBody: Ember.on('didInsertElement', function() {
    let _self = this;
    let dom = this.$().detach();
    let parentDomElement = 'body';
    const config = Ember.getOwner(this).resolveRegistration('config:environment');

    if (config.APP.rootElement) {
      //If testing append element to rootElement in users environment/config instead of body
      parentDomElement = config.APP.rootElement;
    }
    Ember.$(parentDomElement).append(dom);

    let menuAbstract = this.get('menuAbstract');

    window.requestAnimationFrame(function() {
      window.requestAnimationFrame(function() {
        menuAbstract.registerWrapper(_self);
        window.requestAnimationFrame(function() {
          if (!_self.get('isDestroyed')) {
            _self.$().addClass('md-active');
            _self.set('alreadyOpen', true);
            _self.$()[0].style[_self.get('constants').get('CSS').TRANSFORM] = '';
          }
        });
      });
    });

    // Register resize handler.
    Ember.$(window).on('resize', this.get('_resizeHandler'));

  }),

  willDestroyElement() {
    // Destroy resize handler.
    Ember.$(window).off('resize', this.get('_resizeHandler'));
  },

  hideWrapper() {
    let _self = this;
    return new Ember.RSVP.Promise(function(resolve/*, reject*/) {
      _self.get('transitionEvents').addEndEventListener(_self.get('element'), function() {
        _self.$().removeClass('md-active');
        resolve();
      });
      _self.$().addClass('md-leave');
    });
  },

  actions: {
    toggleMenu() {
      this.get('menuAbstract').send('toggleMenu');
    }
  }
});
