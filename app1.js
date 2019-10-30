let str1 = 'baob\' "test',
    str2 = "baob' \"test",
    str3 = `baob' "test`;
// alert(name1);

const sen1 = 'first: ' + str1 + ' second: ' + str2 + ' third: ' + str3 + '.';
console.log(sen1);

const sen2 = `first: ${str1} second: ${str2} thist: ${str3}.`
console.log(sen2);