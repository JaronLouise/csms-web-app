const { createClient } = require('@supabase/supabase-js');

// Use environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || 'https://rmocowjmaxrxiyhusvll.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtb2Nvd2ptYXhyeGl5aHVzdmxsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDY1ODEwMiwiZXhwIjoyMDY2MjM0MTAyfQ.949_7xvRrjBUqeKJsW3Q0pzPv-8qp0O3_kVjJmifeiI';

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'products'; // Or your preferred bucket name

// Upload image to Supabase Storage
const uploadImage = async (file, folder = 'products') => {
  try {
    const fileName = `${Date.now()}_${file.originalname}`;
    
    const { data, error } = await supabase.storage
      .from(folder)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase returned error:', error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from(folder)
      .getPublicUrl(data.path);

    return {
      public_id: publicUrlData.publicUrl, // Store the full public URL as the ID
      url: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw new Error('Failed to upload image to Supabase: ' + error.message);
  }
};

// Delete image from Supabase Storage
const deleteImage = async (public_id) => {
  try {
    // We need to extract the file path from the full URL
    const url = new URL(public_id);
    const pathParts = url.pathname.split('/');
    const bucketName = pathParts[2]; // Extract bucket name from URL
    const filePath = pathParts.slice(3).join('/'); // Extract file path
    
    if (!filePath) {
        throw new Error('Invalid public_id for deletion.');
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Supabase delete error:', error);
    throw new Error('Failed to delete image from Supabase.');
  }
};

module.exports = {
  supabase,
  uploadImage,
  deleteImage,
}; 