const Promise = require('bluebird'),
    fs = require('fs-extra'),
    path = require('path'),
    unlink = Promise.promisify(fs.unlink),
    stat = Promise.promisify(fs.stat),
    mkdir = Promise.promisify(fs.mkdir),
    copy = Promise.promisify(fs.copy),
    remove = Promise.promisify(fs.remove),
    promisePipe = require('promisepipe'),
    fileExists = require('file-exists'),
    hash = require('string-hash');

const fileCtrl = {
    saveImage,
    updateImage,
    getHashedDirName,
    getHashedImageName,
    getImageUrl,
    copyDir,
    deleteFile,
    deleteDir,
    copyFile
};

function saveFile(tempPath, path) {

    /*
     (fileExists(path)
     ? sendFilePath
     : doSavingFile)();
     */

    return doSavingFile();

    function doSavingFile() {
        return promisePipe(
                fs.createReadStream(tempPath),
                fs.createWriteStream(path)
            ).then(streams => {
                return path;
            }).catch(err => {
                throw err;
            });
    }

    function sendFilePath() {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                resolve(path);
            });
        });
    }
}

function deleteFile(path) {
    if(fs.existsSync(path)){//check if file exists async version deprecated
    return unlink(path)
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err;
        })
    }
}

function copyDir(src, dest) {
    return checkDirectory(src)
        .then(directory => {
            return copy(directory, dest)
        })
        .then(() => {
            return null;
        })
        .catch(err => {
            throw err;
        });
}

function copyFile(src, dest) {
    if(fs.existsSync(src)){//check if file exists async version deprecated
        return copy(src, dest);
    }
}

function deleteDir(path) {
    return remove(path).then(dir => {
        return dir;
    }).catch(err => {
        throw err;
    });
}

function updateImage(image) {
    let imageUpdatedPath;

    return saveImage(image)
        .then(imagePath => {
            imageUpdatedPath = imagePath;
            return image.oldPath !== imagePath
                ? deleteFile(image.oldPath)
                : imagePath;
        })
        .then(() => {
            return imageUpdatedPath;
        })
        .catch(err => {
            throw err;
        });
}

function saveImage(image) {
    return checkDirectory(image.directory)
            .then(directory => {
                const newImagePath = path.join(directory, getHashedImageName(image.name));
                return saveFile(image.tempPath, newImagePath)
            })
            .then(imagePath => {
                return imagePath;
            })
            .catch(err => {
                throw err;
            });
}

function getHashedDirName(name) {
    const hashed = hash(name),
        clipped = name.substring(0, 10); // name.length > 20 ? name.match(/(.{20,30})\s/)[1] : name;
    return `${hashed}-${clipped}`;
}

function getHashedImageName(name) {
    const timeSign = Date.now().toString().slice(-4);
    return `${timeSign}-${hash(name)}-${name}`;
}

function getImageUrl(path) {
    const start = path.indexOf('public'),
        clipped = path.substring(start);
    return `../${clipped}`;
}

function checkDirectory(directory) {
    return stat(directory)
            .then(stats => {
                return stats;
            })
            .catch(err => {
                return err.code === "ENOENT"
                    ? mkdir(directory)
                    : err;
            })
            .then(result => {
                return result instanceof Error
                    ? throwError(result.message)
                    : directory;
            });

    function throwError(message) {
        throw new Error(message);
    }
}

module.exports = fileCtrl;