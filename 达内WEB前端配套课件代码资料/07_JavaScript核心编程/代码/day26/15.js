/*
验证HTML双标记、单标记标签
<br  id=""/>  <p id="">....</p>   
*/


var tagPatt = /(<[a-z]+[1-6]?\s*(\s[a-z]{2,}(=.+)?)?)\/>|(<()><\/\5>)/i;