'use strict';

//@ts-ignore
import packageJSON from '../package.json';

/**
 * 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    open() {
        // 打开插件面板
        console.log('open-panel');
        Editor.Panel.open(packageJSON.name);
    }
};

/**
 * 扩展加载完成后触发的钩子
 */
export const load = function() {
    console.log('load-plugin');
};

/**
 * 扩展卸载完成后触发的钩子
 */
export const unload = function() {
    console.log('unload-plugin');
};
