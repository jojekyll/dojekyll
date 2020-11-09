function submitFormAjax() {
    let xmlhttp= window.XMLHttpRequest ?
        new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200)
            alert(this.responseText); // Here is the response
    }

    let name = document.getElementById('name').innerHTML;
    let email = document.getElementById('email').innerHTML;

    xmlhttp.open("GET","your_url.php?name=" + name + "&email=" + email, true);
    xmlhttp.send();
}