---
description: 项目编译与测试相关配置
alwaysApply: true
---

## 编译验证

引擎源代码位于**src**目录下，修改代码后，使用以下命令验证编译。编译前先运行代码格式化（忽略报错），只要运行就会生效。

```bash
./tools/bin/egret make
```

## 工具编译
工具代码在**tools**目录下，修改工具代码后使用如下代码编译
```bash
cd tools && npx tsc 2>&1 | head -20
```