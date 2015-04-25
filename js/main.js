'use strict';
!function(){
    if (window.Site) {
        return;
    }
    window.Site = {
        audio : {
            player : null,
            container : document.getElementById('audio'),
            Player : function(){
                var button = document.getElementById('audio-trigger'),
                    playing = false,
                    player = new MediaElement('player', {
                        // shows debug errors on screen
                        enablePluginDebug: false,
                        // remove or reorder to change plugin priority
                        plugins: ['flash','silverlight'],
                        // specify to force MediaElement to use a particular video or audio type
                        // path to Flash and Silverlight plugins
                        pluginPath: 'media/',
                        // name of flash file
                        flashName: 'flashmediaelement.swf',
                        // name of silverlight file
                        silverlightName: 'silverlightmediaelement.xap',
                        // default if the <video width> is not specified
                        defaultVideoWidth: 480,
                        // default if the <video height> is not specified     
                        defaultVideoHeight: 270,
                        // overrides <video width>
                        pluginWidth: -1,
                        // overrides <video height>       
                        pluginHeight: -1,
                        // rate in milliseconds for Flash and Silverlight to fire the timeupdate event
                        // larger number is less accurate, but less strain on plugin->JavaScript bridge
                        timerRate: 250,
                        loop : true,
                        // method that fires when the Flash or Silverlight object is ready
                        success: function (mediaElement, domObject) { 
                             
                            // add event listener
                            button.addEventListener('click', function(e) {
                                playing = !playing;
                                if (playing) {
                                    button.innerHTML = 'Pause audio';
                                    mediaElement.play();
                                } else {
                                    button.innerHTML = 'Play audio';
                                    mediaElement.stop();
                                }
                            }, false);                     
                        },
                        // fires when a problem is detected
                        error: function () { 
                         
                        }
                    });
                return player;
            },
            init : function(){
                if (this.inited) {
                    return;
                }
                // https://soundcloud.com/relaxdaily/relaxdaily-n084-relaxing-instrumental-music-studying-relaxing-spa
                this.container.innerHTML += '<audio id="player" src="./media/background.mp3" type="audio/mp3" controls="controls"></audio>';
                this.player = new Site.audio.Player();
                this.inited = true;
            }
        },
        highlight : {
            _styleAppended : false,
            config : {
                style : 'css/monokai_sublime.css'
            },
            init : function(){
                var codeTags = document.getElementsByTagName('code'),
                    preTags = document.getElementsByTagName('pre');

                if (codeTags.length === 0 && preTags.length === 0) {
                    return false;
                }

                if (!this._styleAppended) {
                    this.appendStyle(this.config.style);                
                }

                for (var i = 0; i < preTags.length; i++) {
                    hljs.highlightBlock(preTags[i]);
                };
            },
            appendStyle : function(href){
                var ss = document.createElement('link');
                ss.type = 'text/css';
                ss.rel = 'stylesheet';
                ss.href = href;
                document.getElementsByTagName('head')[0].appendChild(ss);
            }
        },
        init : function(){
            this.audio.init();
            this.highlight.init();
        }
    }
}();