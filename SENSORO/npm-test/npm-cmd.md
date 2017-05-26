npm 命令
1. npm install <moduleName@version>     安装依赖包, 参数--save 将版本信息保存到package.json文件, -g 全局安装
2. npm install 方法就可以根据dependencies配置安装所有的依赖包
3. npm init  会引导你创建一个package.json文件，包括名称、版本、作者这些信息等
4. npm remove 移除(不会修改 package.json文件)
5. npm update 更新(不会修改 package.json文件)
6. npm list 列出当前安装的了所有包(-g 列出全局 -l 详细信息)
7. npm root 查看当前包的安装路径(-g 查看全局的包的安装路径)
8. npm uninstall 卸载模块(--save会修改 package.json文件)
9. npm outdated <moduleName> 检查模块是否已经过时
10. npm config 管理npm的配置路径
11. npm cache 管理模块的缓存
12. npm version 查看模块版本
13. npm view 查看模块的注册信息
14. npm run <command>用npm run来跑package.json里面script字段内的命令，可以直接打npm run查看有哪些命令
15. npm install 安装package.json文件中"dependencies" 和 "devDependencies"这两个配置项下面的包
16. npm install --production 只安装package.json文件中"dependencies"配置项下面的包
17. npm install --dev 只安装package.json文件中"devDependencies"配置项下面的包
18. npm install <module-name> -save-dev 自动把模块和版本号添加到devdependencies部分
19. npm prune 将会移除package.json中没有列举的node_modules的包，
    如果是生产环境中或者加--production，将会移除devDependencies里面的包，用于清理多余的包资源
20. npm view async dependencies 查看包的依赖关系
21. npm view moduleName repository.url 查看包的源文件地址
22. npm view moduleName engines 查看包所依赖的Node的版本
23. npm help folders 查看npm使用的所有文件夹
24. npm rebuild moduleName 用于更改包内容后进行重建
25. npm search packageName 发布一个npm包的时候，需要检验某个包名是否已存在