const fs = require('fs');
const crypto = require('crypto');

// Read raw text of key directly
const rawInput = `"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC33DDrdLjwtS9X\\nRI0t9zBWvTDz1CZSCapo61qSt6FyvMOkNPl01OFDx0e8DDrpMsmkl7kay/8jVaXF\\niSyF+jQB5Qm1QB5Qm1KwBgq9AfvuKU\\Q2biM8zPW28Sau\\a6QHZU4gLWY14OiBncntAKde\\ncPEDjobvsSGKV+geJhUw+itOSfeQduSKQeWJ\\IGmh86K\\le7UNsFSSnd0\\wE6b1\\ndL\\U1vbKs0V3u\\KrzuVTdBhGC58CYhOZbpDLcvI+3rKmiD+7gLtBT+N\\gbNXOOy7\\nbTVWFqFlchPfI76ObL5Kj06KwxzzzXzRzjMp7YcRvH84AALz4KYFEiISe7GDozrx\\nX2Sr79r5AgMBAAECggEACeIc5U7WDbwsC/dQgGLuzgydBUHuar2jmsCqPYPjs2aQ\\n5309EAvNAsxfxpA5vSGXxbetvgs9Njt7RtwuYoRtRCaVtI+e+OiuIApKj8SZrf2Q\\nBAAAOeDbCfJ8cFFV/nDOwYR1uyAtzltuauQacI66Wp0A7+ODJ2Se5aps+71761GP\\nrFvmIPZsx/sYB7Oi05ivRMpufr7E18hrvuxbgBLh8yKrknb9Ht+Y/Y6KbxJZMykk\\nXC60sYLUMa+A9VcfP9CLzJNY3V0o2uW4pZfXAl8JWdklM+NlORpFYS1lorto3Hq3\\n8wo8CpaJZDPA52PbEW154XixQf2b5B8do0Sh+fsh6QKBgQDitt3Iu3qNUVhCo6dO\\nXYRiFU7W+sznVSzRWiBkvK3nhSPgZ81P+iHjbyWyemNd26Yg8DUjc4tF358TkTZZ\\n2OtWIF3za82gm+R2NnsWRpaBaTitvp6SYdYohzZ6WGoWozmi0it4NsmRJOR8ohBr\\n4Ma4TziKXXR5nNFAkKE4luDTOwKBgQDPnDHbDXWecPVyYw+/bKNWyrWX4zhJKAsf\\nKWlVhi8ERfu/UE6myiMHjockxzEf21QqNkiXZOQDT0y8TIZ7j5BFkvMwibrjVQlf\\nuB3rnNgCJLRTHCIBZK0LbYbPDVcqNFkzq/1r8M4umcYuw+dOFm/Or2GbEJr2GbEJdNerLH\\n3sb+4wf\\WwKBgQCBRLOA2SUvnsosdRPYYwowwuWJPsfGv5ImbLU7uzmNYSTrt0Qh\\n7gWUoLNl6NLvmWZIMa6a4C7xUGhrx8itwjmtihcHzNgaU8kYfkgAk48Niul+Z8oS\\nvSZXRYGSkQcskTUz2ZJfoR2dXOPLDL1ARZIJVWJvwom\\LeNCZTUIBzZTUIBz96MQKBgDdi\\n6DoUYSif4hteKjlbdkgVVFTtHXsG39C0b5GNdsWhFgR4HEOK8cV2VL+PFJ\\3F4Eb\\nckpRdDMd2M7za31TU538Ej0EwYMckJ+ksvbEpSwNNr5lZv0QKso9shVS7coopROP\\n8s\\1MkxkYebgBLlkaves+lEwH+1fqop\\+H7Pera5AoGBAJyx3hofaL55hS5BOXLD\\nJHvC+m0t5Dw0cFr7vNhyZVwrmxO1ePBBcqEEPR13pH6XBIl1XutevhZq/q9iJPxr\\nl1CC6PK0W2katAssafUBGxSzu+LmBLZu145kfy+JkRyAL73zibtb0i25gWFjKUL1\\nnokVyiZMy4WPogRej9/7ZMXXTA==\\n-----END PRIVATE KEY-----\\n"`;

console.log('Testing raw input parsing...');
let unquoted = rawInput;
if (unquoted.startsWith('"') && unquoted.endsWith('"')) {
  unquoted = unquoted.slice(1, -1);
}

// 1. As is with \n converted
const parsed1 = unquoted.replace(/\\n/g, '\n');
try {
  const k1 = crypto.createPrivateKey(parsed1);
  console.log('1. As-is SUCCESS! Type:', k1.asymmetricKeyType);
} catch (e) {
  console.log('1. As-is FAIL:', e.message);
}

// 2. What if isolated backslashes in base64 should be forward slashes?
const parsed2 = unquoted.replace(/\\n/g, '\n').replace(/\\([^\n])/g, '/$1');
try {
  const k2 = crypto.createPrivateKey(parsed2);
  console.log('2. Backslash-to-slash SUCCESS! Type:', k2.asymmetricKeyType);
} catch (e) {
  console.log('2. Backslash-to-slash FAIL:', e.message);
}

// 3. What if backslashes were escape chars before forward slashes, or just stray backslashes?
const parsed3 = unquoted.replace(/\\n/g, '\n').replace(/\\/g, '');
try {
  const k3 = crypto.createPrivateKey(parsed3);
  console.log('3. Remove-backslashes SUCCESS! Type:', k3.asymmetricKeyType);
} catch (e) {
  console.log('3. Remove-backslashes FAIL:', e.message);
}
