let htmlTags = Object.solidify([
  "html",
  "base", "head", "link", "meta", "style", "title",
  "address", "article", "aside", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "nav", "section",
  "blockquote", "dd", "div", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre", "ul",
  "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "rtc", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr",
  "area", "audio", "img", "map", "track", "video",
  "embed", "object", "param", "source",
  "canvas", "noscript", "script",
  "del", "ins",
  "caption", "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
  "button", "datalist", "fieldset", "form", "input", "label", "legend", "meter", "optgroup", "option", "output", "progress", "select", "textarea",
  "details", "dialog", "menu", "menuitem", "summary",
  "content", "element", "shadow", "slot", "template",
  "acronym", "applet", "basefont", "big", "blink", "center", "command", "content", "dir", "element", "font", "frame", "frameset", "isindex", "keygen", "listing", "marquee", "multicol", "nextid", "noembed", "plaintext", "spacer", "strike", "tt", "xmp",
  "iframe"
]);
function inspect(lines){
  lines = lines.split("\n");

  let h1exists = false;
  for( let i = 0; i < lines.length; i++ ){
    let line_number = i + 1;
    if( /^######\s/.test(lines[i]) )
    {
      _body._errors._lists["_list[markdown]"]["_group[headings]"].$ul.insertAdjacentHTML('beforeEnd', "<li>Use of level 6 heading (line: " + line_number + ")</li>");
    }
    else if( /^#\s/.test(lines[i]) || (lines[i + 1] && /^=+$/.test(lines[i + 1].trim())) )
    {
      if( h1exists ){
        _body._errors._lists["_list[markdown]"]["_group[headings]"].$ul.insertAdjacentHTML('beforeEnd', "<li>Extra level 1 heading (line: " + line_number + ")</li>");
      }
      h1exists = true;
    }
    if( /<([A-z][A-z0-9]*)\b[^>]*>|<\/([A-z][A-z0-9]*)\b[^>]*>/g.test(lines[i]) ){
      let matches = lines[i].match(/<([A-z][A-z0-9]*)\b[^>]*>|<\/([A-z][A-z0-9]*)\b[^>]*>/g);
      for( let j = 0; j < matches.length; j++ ){
        let tag = matches[j].replace(/^<\/?/, "").replace(/\/?>$/, "");
        if( htmlTags.includes(tag.toLowerCase()) ){
          _body._errors._lists["_list[markdown]"]["_group[html]"].$ul.insertAdjacentHTML('beforeEnd', "<li>HTML tag: <code>" + matches[j].replace(/^</, "&lt;").replace(/>$/, "&gt;") + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    if( /\bi\b/ig.test(lines[i]) ){
      let matches = lines[i].match(/\bi\b/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          _body._errors._lists["_list[asg]"]["_group[first-person]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    if( /(\w)+(n't|'ve|'d|'ll|'m|'re)|it's/ig.test(lines[i]) ){
      let matches = lines[i].match(/(\w)+(n't|'ve|'d|'ll|'m|'re)|it's/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          _body._errors._lists["_list[asg]"]["_group[contractions]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    /* jshint ignore:start */
    if( /\b(?<!osu!)(Standard|Taiko|Catch\sthe\sBeat|ctb|Mania)\b/ig.test(lines[i]) ){
      let matches = lines[i].match(/\b(?<!osu!)(Standard|Taiko|Catch\sthe\sBeat|ctb|Mania)\b/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          _body._errors._lists["_list[asg]"]["_group[game-modes]"].$ul.insertAdjacentHTML('beforeEnd', "<li><code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
    /* jshint ignore:end */
    if( /fig\:|\"wikilink\"/ig.test(lines[i]) ){
      let matches = lines[i].match(/fig\:|\"wikilink\"/ig);
      if( matches ){
        for( let j = 0; j < matches.length; j++ ){
          _body._errors._lists["_list[asg]"]["_group[mediawiki]"].$ul.insertAdjacentHTML('beforeEnd', "<li>MediaWiki keyword: <code>" + matches[j] + "</code> (line: " + line_number + ")</li>");
        }
      }
    }
  }
  if( !h1exists ){
    _body._errors._lists["_list[markdown]"]["_group[headings]"].$ul.insertAdjacentHTML('afterBegin', "<li>Title (heading level 1) is missing!</li>");
  }
  return;
}
function imageTransCheck(){
  let _img = $('osu-wiki > markdown img');
  let ctx = _body._menu.$canvas;
  if( ctx.getContext ){
    ctx = ctx.getContext('2d');
    (function check(imageNumber){
      if( imageNumber < _img.length ){
        let src = _img[imageNumber].getAttribute('src');
        if( !/^(https?|mailto)\:/i.test(src) ){
          let image = new Image();
          let name = src.substring(src.lastIndexOf("/"), src.length).replace(/\//, "").replace(/\?t\=\d+/, "");
          image.addEventListener('load', function(){
            if( this.width > 680 ){
              _body._errors._lists["_list[images]"]["_group[wide]"].$ul.insertAdjacentHTML('afterBegin', "<li><code>" + name + "</code> (" + this.width + "px)</li>");
            }
            if( /png/i.test(src.split(".").pop()) ){
              ctx.clearRect(0, 0, ctx.width, ctx.height);
              _body._menu.$canvas.width = this.width;
              _body._menu.$canvas.height = this.height;
              ctx.drawImage(image, 0, 0);

              let imageData = ctx.getImageData(0, 0, _body._menu.$canvas.width, _body._menu.$canvas.height).data;

              let isTransparent = false;
              for (var i = 0, n = imageData.length; i < n; i += 4) {
                if( imageData[i] === 0 && imageData[i + 1] === 0 && imageData[i + 2] === 0 && imageData[i + 3] === 0 ){
                  isTransparent = true;
                  break;
                }
              }

              if( !isTransparent ){
                _body._errors._lists["_list[images]"]["_group[png]"].$ul.insertAdjacentHTML('afterBegin', "<li><code>" + name + "</code></li>");
              }
            }
            check(imageNumber + 1);
          });
          image.src = src;
        }
      }
    })(0);
  }
  return;
}
