import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGifflossy from 'imagemin-gifsicle';
import imageminWebp from 'imagemin-webp';
import imagemin, { type Plugin } from 'imagemin';


import path from 'path';
import fs from 'fs';
import imageminGifsicle from 'imagemin-gifsicle';
import { json } from '@sveltejs/kit';

export async function POST({ request }: { request: Request }) {
    const data = await request.formData() as FormData;
    if(!data){
        return new Response("No file uploaded",{ status: 400 })
    }
    
    const image = data.get("image") as unknown as Blob;
    if (!image) {
        return new Response("No file uploaded",{ status: 400 })
    }
    if(!image.type.startsWith("image/")){
        return new Response("File is not an image",{ status: 400 })
    }

    //First remove background.* from static/images
    const imageDir = path.join(process.cwd(), "static", "images");
    {
        const files = fs.readdirSync(imageDir);
        const toRemove = files.filter(file => file.startsWith("background."));
        toRemove.forEach(file => {
            fs.unlinkSync(path.join(imageDir, file));
        });
    }
    const buffer = Buffer.from( await image.arrayBuffer() );
    const imageType = image.type.split("/")[1];
    const imageName = `background.${imageType}`;
    const imagePath = path.join(imageDir, imageName);
    fs.writeFileSync(imagePath, buffer);
    console.log("Image saved");
    compressImage(imageType).then(() => {
        console.log("Image compressed");
    });
    return json({ message: "Image updated" });
}

export async function GET() {
    const imageDir = path.join(process.cwd(), "static", "images");
    const files = fs.readdirSync(imageDir);
    const backgroundFile = files.filter(file => file.startsWith("background."));
    if(backgroundFile.length === 0){
        return new Response("No background image found",{ status: 404 })
    }
    const imagePath = path.join(imageDir, backgroundFile[0]);
    const image = fs.readFileSync(imagePath);
    const imageType = backgroundFile[0].split(".")[1];
    return new Response(image, {
        headers: {
            "Content-Type": `image/${imageType}`
        }
    });
}

const compressImage = async (imageType:string) => {
    const imageDir = path.join(process.cwd(), "static", "images");
    const imagePath = path.join(imageDir, `background.${imageType}`);
    const compressedImagePath = path.join(imageDir, `compressed`);
    {
        const files = fs.readdirSync(imageDir);
        const toRemove = files.filter(file => file.startsWith("background."));
        toRemove.forEach(file => {
            fs.unlinkSync(path.join(compressedImagePath, file));
        });
    }
    try{
        let plugins:Plugin[] = [];
        switch(imageType){
            case "png":
                plugins = [imageminPngquant({quality: [0.6, 0.7]})];
                break;
            case "jpeg":
                plugins = [imageminMozjpeg({quality: 70})];
                break;
            case "gif":
                plugins = [imageminGifsicle ({interlaced: true, optimizationLevel: 3})];
                break;
            case "webp":
                plugins = [imageminWebp({quality: 70})];
                break;
        }
        await imagemin([imagePath], {
            destination: compressedImagePath,
            plugins,
            
        });
    }
    catch(err){
        console.error("Error compressing image, saving original");
        
        fs.copyFileSync(imagePath, path.join(compressedImagePath, `background.${imageType}`));
    }
}
