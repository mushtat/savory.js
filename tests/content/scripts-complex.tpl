<!--<title>Scripts with complex dependencies</title>-->

<div id="container" style="background:white;">
</div>
<div id="scripts">
    <script src="./../vendor/jquery-1.11.3.min.js"></script>
    <script src="./../vendor/jquery.color.js"></script>
    <script src="./../vendor/jquery-ui.js"></script>
    <script type="text/javascript">
        jQuery('#container').animate({
            backgroundColor: 'gray'
        }, {
            duration : 500,
            complete : function(){
                jQuery('#container').css({
                    background : 'green'
                });
                jQuery('#container').animate({
                	height : 30
                }, {
                	complete : function(){

	                    $('#container').progressbar({
	                        value: false
	                    });

                        setTimeout(function(){
                            $('#container').progressbar('destroy');

                            $('#container').css({
                                background : 'none'
                            });

                            $('#container').text = 'Pass';
                        }, 500);

	                    setTimeout(function(){

                            $('#container').remove();

		                    if (onScriptExecComplete) {
		                        onScriptExecComplete();
		                        window.onScriptExecComplete = null;
		                        delete window.onScriptExecComplete;
		                    }
	                    }, 1000);	                
	                }
	            });

            }
        });
    </script>
    <script type="text/javascript">
        jQuery('#container').css({
            height : 100
        });
    </script>
</div>