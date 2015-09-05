'use strict';

var expect = chai.expect,
    contentPath = 'http://localhost:8800/tests/content/';

describe('Savory.js', function() {

  before(function() {

    if (document.getElementById('container')) {
      return;
    }

    // Append container element to test page directly
    var container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);
  });

  describe('Initialization', function() {

    it('initialize', function(done) {

      var savory = new Savory();

      expect(savory).to.be.an.instanceof(Savory);
      savory = savory.destroy();

      done();
    });

    it('destroy', function(done) {

      var savory = new Savory();

      expect(savory).to.be.an.instanceof(Savory);
      savory = savory.destroy();
      expect(savory).to.be.a('null');

      done();
    });

    it('check default config', function(done) {

      var savory = new Savory();

      expect(savoryConfig).to.have.all.keys('autoInit', 'callbacks', 'container', 'error', 'links', 'request', 'scriptsContainer', 'updateScrollPosition');
      
      savory = savory.destroy();

      done();
    });
  });

  describe('Page loader', function() {

    this.timeout(5000);

    it('change document title', function(done) {

      var savory = new Savory(),
        currentTitle = document.title;

      savory.api.load(contentPath + 'full.html', {

        onSuccess : function(){

          if (document.title !== 'Full page') {
            throw new Error('Title wasn\'t changed');
          }

          document.title = currentTitle;

          savory = savory.destroy();

          history.go(-1);
          done();
        }, 

        onError : function(){
          throw new Error('Loading error. Is CORS enabled?');
        }

      });
    });

    it('load whole page content', function(done) {

      var savory = new Savory();

      savory.api.load(contentPath + 'full.html', {

        onSuccess : function(){

          savory = savory.destroy();

          history.go(-1);
          done();
        }, 

        onError : function(){
        	throw new Error('Loading error. Is CORS enabled?');
        }

      });
    });

    it('load partial content', function(done) {

      var savory = new Savory();

      savory.api.load(contentPath + 'partial.tpl', {

        onSuccess : function(){

          savory = savory.destroy();
          history.go(-1);

        	if (document.title !== 'Partial content') {
        		throw new Error('Title wasn\'t changed');
        	}

          done();
        }

      });
    });

    it('execute scripts from whole page', function(done) {

      var savory = new Savory();

      savory.api.load(contentPath + 'scripts.html', {

        onSuccess : function(){

          savory = savory.destroy();
          history.go(-1);

          if (document.title !== 'Scripts in full page') {
            throw new Error('Title wasn\'t changed');
          }

          if (!window.abc) {
            throw new Error('Script wasn\'t executed');
          } else {
            window.abc = null;
            delete window.abc;
          }

          done();
        }

      });
    });

    it('execute scripts from partial page', function(done) {

      var savory = new Savory();

      savory.api.load(contentPath + 'scripts.tpl', {

        onSuccess : function(){

            savory = savory.destroy();
            history.go(-1);

            if (!window.xyz) {
              throw new Error('Script wasn\'t executed');
            } else {
              window.xyz = null;
              delete window.xyz;
            }

            done();
        }

      });
    });

    it('execute remote scripts from whole page', function(done) {

      var savory = new Savory();

      savory.api.load(contentPath + 'scripts-remote.html', {

        onScriptsLoaded : function(){

            savory = savory.destroy();
            history.go(-1);

            if (!window.$ || !window.$.fn) {
              throw new Error('Script wasn\'t executed');
            } else {
              window.$ = null;
              delete window.$;
              window.jQuery = null;
              delete window.jQuery;
            }

            done();
        }

      });
    });

    it('execute remote scripts from partial page', function(done) {

      var savory = new Savory();

      savory.api.load(contentPath + 'scripts-remote.tpl', {

        onScriptsLoaded : function(){

            savory = savory.destroy();
            history.go(-1);

            if (!window.$ || !window.$.fn) {
              throw new Error('Script wasn\'t executed');
            } else {
              window.$ = null;
              delete window.$;
              window.jQuery = null;
              delete window.jQuery;
            }

            done();
        }

      });
    });

    it('execute mixed script types from whole page', function(done) {

      var savory = new Savory();

      savory.api.load(contentPath + 'scripts-mixed.html', {

        onScriptsLoaded : function(){

            savory = savory.destroy();
            history.go(-1);

            if (!window.$ || !window.$.fn) {
              throw new Error('Script wasn\'t executed');
            } else {
              window.$ = null;
              delete window.$;
              window.jQuery = null;
              delete window.jQuery;
            }

            done();
        }

      });
    });

    it('execute mixed script types from partial page', function(done) {

      var savory = new Savory();

      savory.api.load(contentPath + 'scripts-mixed.tpl', {

        onScriptsLoaded : function(){

            savory = savory.destroy();
            history.go(-1);

            if (!window.$ || !window.$.fn) {
              throw new Error('Script wasn\'t executed');
            } else {
              window.$ = null;
              delete window.$;
              window.jQuery = null;
              delete window.jQuery;
            }

            done();
        }

      });
    });

    it('execute scripts with complex dependencies from partial page', function(done) {

      var savory = new Savory();

      window.onScriptExecComplete = function(){
        window.$ = null;
        delete window.$;
        window.jQuery = null;
        delete window.jQuery;
        done();
      }

      savory.api.load(contentPath + 'scripts-complex.tpl', {

        onScriptsLoaded : function(){

            savory = savory.destroy();
            history.go(-1);

            if (!window.$ || !window.$.fn) {
              throw new Error('Script wasn\'t executed');
            }            
        }

      });
    });

  });
});