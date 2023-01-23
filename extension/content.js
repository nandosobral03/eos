let url = window.location.href;
if (url && url.includes("9anime.") && url.includes("/watch/") && url.includes("ep-")) {
  if (url.includes("watch") && url.includes("ep-")) {
    const req = new XMLHttpRequest();
    const baseUrl = "http://localhost:3000/tracker";
    const body = {
      current_url: url,
    };
    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(body));
    req.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("success", url);
        }
    }
  }
}


