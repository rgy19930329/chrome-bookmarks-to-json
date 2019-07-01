var fs = require("fs");

fs.readFile(__dirname + "/data/bookmarks.html", "utf-8", function (err, str) {
  str = str.replace(/<!DOCTYPE NETSCAPE-Bookmark-file-1>[\r\n]*/, "")
           .replace(/<!-- This is an automatically generated file.[\r\n]*/, "")
           .replace(/     It will be read and overwritten.[\r\n]*/, "")
           .replace(/     DO NOT EDIT! -->[\r\n]*/, "")
           .replace(/<META HTTP-EQUIV="Content-Type" CONTENT="text\/html; charset=UTF-8">[\r\n]*/, "")
           .replace(/<TITLE>Bookmarks<\/TITLE>[\r\n]*/img, "");
  str = str.replace(/<H1>Bookmarks<\/H1>[\r\n]*<DL><p>/, "[")
           .replace(/<\/DL><p>[\r\n]*$/, "]");
  str = str.replace(/<DL><p>/g, `"children":[`).replace(/<\/DL><p>/g, "]},");
  str = str.replace(/<DT><H3[^>]+>(.*)<\/H3>/g, function(all, $1) {
    return `{"title":"${$1}",`;
  });
  str = str.replace(/<DT><A HREF="([^\s]*)" [^>]+>(.*)<\/A>/g, function(all, $1, $2) {
    return `{"title":"${$2}","url":"${$1}"},`;
  });
  str = str.replace(/,[\s\r\n]*]/g, "]");
  str = JSON.stringify(JSON.parse(str), null, 2); // json数据格式化输出
  console.log(str);
  // 写入文件
  fs.writeFile("./bookmarks.json", str, function(err) {
    if (err) {
      throw err;
    }
    console.log("\r\n文件写入成功");
  });
});
