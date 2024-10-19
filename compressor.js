const sharp = require('sharp');
const fs = require('fs');

function compressImages(searchPath) {
    var path = fs.readdirSync(searchPath);

    path.forEach(file => {
        if (!fs.lstatSync(`${searchPath}/${file}`).isDirectory()) return;
        var postImgs = fs.readdirSync(`${searchPath}/${file}`);
        postImgs.forEach(img => {
            if (img.match(/\.(jpg|JPG|jpeg|png)$/)) {
                console.log(`Converting ${file}/${img} to PNG...`);
                fs.mkdirSync(`./source/images/${file}`, { recursive: true });
                
                const image = sharp(`./source/_posts/${file}/${img}`);
                image.metadata((err, metadata) => {
                    metadata = metadata;
                    image.resize(Math.min(500, metadata.width))
                        .toFile(`./source/images/${file}/${img.split('.')[0]}.png`, { quality: 80 })
                        .catch(err => console.error('Error:', err));
                })
                
            }
        });
        var content = fs.readFileSync(`${searchPath}/${file}.md`, 'utf8');
        console.log(`Converting ${file}.md`);
        content = content.replace(
            /<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/g,
            (match, quote, src) => {
                // 檢查src是否已經以/images/postname開頭
                console.log(`${match} -> ${quote}/images/${file}/${src}${quote}`);
                if (!src.startsWith(`/images/${file}`)) {
                    return `<img src=${quote}/images/${file}/${src}${quote}`;
                }
                return match;
            }
        );
        fs.writeFileSync(`${searchPath}/${file}.md`, content, 'utf8');
    });
}

compressImages('./source/_posts');