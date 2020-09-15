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

        extensions = extensions || ["js"];
        filters = filters || [];
        const regexpInfo = {
            ext: '',
            body: '',
            // or 조건 /.*([.](body|body|body))$/
            // and 조건 /(?=.*body)(?=.*body)/gm            
        }

        const extFilter = extensions.reduce((arr, cur, idx) => `${arr}${idx > 0 ? "|" : ""}${cur}`, "")
        regexpInfo.ext = `.*([.](${extFilter}))$`;

        console.log(regexpInfo);

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
                    let regex = new RegExp(regexpInfo.ext);
                    if (regex.test(ext) === true) {
                        //TODO - 데이터 검색 필터 추가 예정
                        if (filters.length > 0) {
                            result.push(mapFn({ dirent, dirPath, ext }))
                        } else {
                            result.push(mapFn({ dirent, dirPath, ext }))
                        }
                    } else {
                        if (filters.length > 0) {
                            result.push(mapFn({ dirent, dirPath, ext }))
                        }
                    }
                }
            }
            return result;
        }

        return await _getFiles(targetPath);
    }
}

export default SearchFiles;