let T = {
  locale: null,
  locales: {},           //语言包内容
  langCode: ['cn', 'en']
}

T.registerLocale = function (locales) {
  T.locales = locales;      //将语言包里的对象赋给当前对象的locales属性
}

T.setLocale = function (code) {
  T.locale = code;          //存储当前语言的种类('zh_jian'或者'zh_fan')
}

T.setLocaleByIndex = function (index) {
  console.log("T.setLocaleByIndex:"+index);
  T.setLocale(T.langCode[index]);
}

T.getLanguage = function () {
  return T.locales[T.locale];
}


export default T;