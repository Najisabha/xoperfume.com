import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_URL?.split('@')[1] || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// If CLOUDINARY_URL is present, cloudinary.config() might already be set 
// but it's safer to explicitly set it or just call cloudinary.config() 
// if the URL is in the right format.
if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL
    });
}

export default cloudinary;
