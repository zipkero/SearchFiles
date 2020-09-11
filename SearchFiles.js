import fs from 'fs';
import path from 'path';

const promises = fs.promises;

class SearchFiles {
    constructor() {
    }

    async search(targetPath, options) {
        let {
            extensions,
            mapFn,
            filters
        } = options || {};

        extensions = extensions || [];
        mapFn = mapFn || (({ dirent, dirPath, ext }) => {
            return { name: dirent.name, path: path.resolve(dirPath, dirent.name), ext }
        })

        const _getFiles = async (dirPath) => {
            let result = [];
            const dirList = await promises.opendir(dirPath);
            for await (const dirent of dirList) {
                let fullPath = path.resolve(dirPath, dirent.name);
                if (dirent.isDirectory()) {
                    result = result.concat(await _getFiles(fullPath));
                } else {
                    let ext = path.extname(fullPath)
                    if (extensions.length > 0) {
                        if (extensions.includes(ext)) {
                            result.push(mapFn({ dirent, dirPath, ext }))
                        }
                    } else {
                        result.push(mapFn({ dirent, dirPath, ext }))
                    }
                }
            }
            return result;
        }

        return await _getFiles(targetPath, extensions, map);
    }

    async getFileRead(targetPath) {
        for (const fileInfo of this.result) {
            const data = await promises.readFile(fileInfo.path, 'utf-8')
            console.log(data);
        }
    }

    async getFileRead(targetPath) {

    }
}

export default SearchFiles;