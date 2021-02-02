javascript: function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function getFlutterClass() {
  var str = "import 'package:flutter/widgets.dart';\r\n\r\n";
  str += "class IconFontIcons{ \r\n";
  var arr = document.querySelectorAll(".icon-item");
  for (var i = arr.length - 1; i >= 0; i--) {
    var item = arr[i];
    var item_name = toHump(item.querySelectorAll(".icon-code")[1].textContent);
    var item_code = item
      .querySelectorAll(".icon-code")[0]
      .textContent.replace(/\&\#/g, "0");
    item_code = item_code.replace(/\;/g, "");
    str +=
      "    static const IconData " +
      item_name +
      " = IconData(" +
      item_code +
      ",fontFamily:'IconFontIcons');";
    str += "\r\n";
  }
  str += "}";
  return str;
}

function toHump(name){
    name =name.replace(/\s+/g,"-");
    return name.replace(/\-(\w)/g,function(all,letter){
        return letter.toUpperCase();
    })
}


download("IconFontIcons.dart", getFlutterClass());
