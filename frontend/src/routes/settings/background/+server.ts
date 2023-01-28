import { json} from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';

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
    const files = fs.readdirSync(imageDir);
    const toRemove = files.filter(file => file.startsWith("background."));
    toRemove.forEach(file => {
        fs.unlinkSync(path.join(imageDir, file));
    });


    const buffer = Buffer.from( await image.arrayBuffer() );
    const imageType = image.type.split("/")[1];
    const imageName = `background.${imageType}`;
    const imagePath = path.join(imageDir, imageName);
    fs.writeFileSync(imagePath, buffer);
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