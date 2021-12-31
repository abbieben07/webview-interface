const path = require('path')
const fs = require('fs')

const getAndroidFiles = () => {
    const dir = './src/platforms/android'
    if (!fs.existsSync(dir)) {
        console.log("No Android Native Library");
        return;
    }

    let files = fs.readdirSync(dir);
        for(let i = 0; i < files.length; i++){
            let filename=path.join(dir,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            console.log('-- found: ',filename);
        };
        }
    
}