'use strict';

const { join } = require('path');
const { execSync } = require('child_process');

console.time('tsc');
const tsPath = join(__dirname, 'source');
try {
    execSync('tsc', {
        cwd: tsPath,
        stdio: [0, 1, 2],
    });
} catch (error) {
    console.error(`tsc ${tsPath} failed!`);
}
console.timeEnd('tsc');

console.time('lessc');
const lessSource = join(__dirname, 'static/huawei', 'index.less');
const lessPath = join(__dirname, 'dist/huawei', 'index.css');
try {
    execSync(`lessc ${lessSource} ${lessPath}`, {
        cwd: join(__dirname, 'static'),
        stdio: [0, 1, 2],
    });
} catch (error) {
    console.error(`lessc ${lessPath} failed!`);
}
console.timeEnd('lessc');