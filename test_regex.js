// Test the .lby dependency regex
const oldLib = 'AsString';
const oldDepPattern = new RegExp(
    `(<Dependency\\s+[^>]*ObjectName\\s*=\\s*")${oldLib}(")`,'gi'
);

const xml1 = '<Dependency ObjectName="asstring" />';
const xml2 = '<Dependency ObjectName="AsString" />';
const xml3 = '    <Dependency ObjectName="asstring" />';
const xml4 = '<Dependency ObjectName="AsBrMath" />';

console.log('Test 1 (asstring):', oldDepPattern.test(xml1));
oldDepPattern.lastIndex = 0;
console.log('Test 2 (AsString):', oldDepPattern.test(xml2));
oldDepPattern.lastIndex = 0;
console.log('Test 3 (indented asstring):', oldDepPattern.test(xml3));
oldDepPattern.lastIndex = 0;
console.log('Test 4 (AsBrMath, should be false):', oldDepPattern.test(xml4));
oldDepPattern.lastIndex = 0;

// Test replacement
const newLib = 'AsBrStr';
const replaced = xml1.replace(oldDepPattern, `$1${newLib}$2`);
console.log('Replacement result:', replaced);

// Test with full .lby content
const fullLby = `<?xml version="1.0" encoding="utf-8"?>
<?AutomationStudio Version=4.0.19.69 SP?>
<Library Version="1.94.0" Description="Basic motion library" xmlns="http://br-automation.co.at/AS/Library">
  <Files>
    <File>MC_BRDK_Basic.st</File>
  </Files>
  <Dependencies>
    <Dependency ObjectName="Runtime" />
    <Dependency ObjectName="asstring" />
    <Dependency ObjectName="Acp10_MC" FromVersion="2.41.0" />
    <Dependency ObjectName="AsBrMath" />
  </Dependencies>
</Library>`;

const fullTest = oldDepPattern.test(fullLby);
oldDepPattern.lastIndex = 0;
console.log('\nFull .lby test:', fullTest);

const fullReplace = fullLby.replace(oldDepPattern, `$1${newLib}$2`);
console.log('\nFull .lby after replace:\n', fullReplace);
