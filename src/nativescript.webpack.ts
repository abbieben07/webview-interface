module.exports = webpack => {
    webpack.Utils.addCopyRule({
        from: '@abbieben/webview-interface/www',
        to: 'www/',
        context: webpack.Utils.project.getProjectFilePath('node_modules')
    })
}
