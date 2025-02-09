export async function uploadFile(file: File): Promise<string> {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  
    const s3 = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
      },
    });
  
    // Convert File to Uint8Array (Buffer)
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
  
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "",
      Key: file.name,
      Body: fileBuffer, // Use the converted buffer
      ContentType: file.type,
    };
  
    const command = new PutObjectCommand(params);
    await s3.send(command);
  
    return `https://${params.Bucket}.s3.amazonaws.com/${file.name}`;
  }
  