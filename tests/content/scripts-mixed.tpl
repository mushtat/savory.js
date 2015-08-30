<!--<title>Scripts mixed</title>-->
<div id="container">
    Full page content with remote scripts
</div>
<div id="scripts">
    <script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
    <script type="text/javascript">
        $('#container').text('This was changed by external jQuery');
    </script>
</div>