void(function(){
  let pjson = nodeRequire('./package.json');
  let version = 'v' + pjson.version;

  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.github.com/repos/MegaApplePi/mdp-osu/releases');
  xhr.addEventListener('load', function(){
    let response = this.response;
    if( version !== response[0].tag_name){
      error("A new version of mdp-osu has been released! <span class=\"download\">Download</span>");
      $('.snackbar > .text > .download')[0].onclick = function(){
        shell.openExternal('https://github.com/MegaApplePi/mdp-osu/releases/latest');
      };
    }
  });
  xhr.responseType = 'json';
  xhr.send();
})();
