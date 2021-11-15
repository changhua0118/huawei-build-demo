'use strict';

const { readFileSync, existsSync } = require('fs-extra');
const { join } = require('path');

const Vue = require('vue/dist/vue.js');
let panel: any = null;
let vm: any;
Vue.config.productionTip = false;
Vue.config.devtools = false;

// 原生平台类型
const nativeArr = ['android', 'ohos', 'huawei-agc', 'windows', 'mac', 'ios'];

// 面板的内容
export const template = readFileSync(join(__dirname, '../../static/huawei/index.html'), 'utf8');

// 面板上的样式
export const style = readFileSync(join(__dirname, '../../dist/huawei/index.css'), 'utf8');

// 快捷选择器
export const $ = {
    build: '#huawei-build-demo'
};

// 面板上定义的方法
export const methods = {};

interface platformOptions {
    buildPath: string;
    name: string;
    outputName: string;
    platform: string;
    [key: string]: any;
};

// 面板启动后触发的钩子函数
export async function ready() {
    // @ts-ignore
    panel = this;
    vm = new Vue({
        el: panel.$.build,
        data: {
            info: '暂无构建任务，请前往 `项目->构建发布->新建构建任务` 进行新建',
            nativeArr,
            taskList: null
        },
        methods: {
            /**
             * 获取构建任务列表
             */
            async getTaskList() {
                const that: any = this;
                try {
                    const { queue } = await Editor.Message.request('builder', 'query-tasks-info');
                    if (Object.keys(queue).length > 0 ) {
                        that.taskList = queue;
                    }
                } catch (error) {
                    that.info = '获取构建任务列表失败';
                }
            },
            /**
             * 调试
             */
            onDebug(key: string) {
                const that: any = this;
                const options: platformOptions = that.taskList[key].options;
                // 构建后 exe 文件目录
                const basePath = options.buildPath.startsWith('project://') ? join(Editor.Project.path, options.buildPath.substring(9)) : options.buildPath;
                let exePath = join(basePath, options.outputName, 'proj/Release');
                if (existsSync(exePath)) {
                    exePath = join(exePath, `${options.name}.exe`);
                    that.onRun(exePath);
                } else {
                    console.warn('未找到执行文件，请确认已经生成！');
                }
            },
            /**
             * 运行
             */
            onRun(exePath: string) {
                let exec = require('child_process').exec;
                // 方式一：使用 exec 启动子进程，执行 exe 程序，参数在命令中空格分开
                exec(`${exePath} -dev`, (error: Error) => {
                    if (error) {
                        console.error('error', error); 
                        return;
                    }
                    // else ...
                });
            }
            // onRun(exePath: string) {
            //     let spawn = require('child_process').spawn;
            //     // 方式二：使用 spawn 启动子进程，执行 exe 程序，参数为第二个参数的字符串数组
            //     const childProcess = spawn(`${exePath}`, ['dev']);
            //     childProcess.on('error', (error: Error) => {
            //         console.error('error', error); 
            //     });
            // }
        },
        async mounted() {
            const that: any = this;
            await that.getTaskList();
        }
    });
};

// 面板准备关闭的时候会触发的函数，return false 的话，会终止关闭面板
export async function beforeClose() {};

// 面板关闭后的钩子函数
export async function close() {
    if (vm) {
        vm.$destroy();
    }
};
