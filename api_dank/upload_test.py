import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

# Create a session using your AWS credentials
s3 = boto3.client('s3', region_name='us-east-2')  # Specify your region

def upload_file_to_s3(file_path, bucket_name, object_name=None):
    if object_name is None:
        object_name = file_path  # If no object name is provided, use the file path
    
    try:
        s3.upload_file(file_path, bucket_name, object_name)
        print(f"File uploaded successfully: {object_name}")
        return True
    except FileNotFoundError:
        print(f"File {file_path} not found.")
        return False
    except NoCredentialsError:
        print("Credentials not available.")
        return False
    except PartialCredentialsError:
        print("Incomplete credentials.")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

file_path = 'test1.png'
bucket_name = "tmkdankbank"
upload_file_to_s3(file_path, bucket_name)