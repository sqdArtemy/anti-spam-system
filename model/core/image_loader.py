import logging

from PIL import Image
from io import BytesIO


def get_image(minio_client, bucket_name: str, file_name: str) -> Image.Image:
    logging.info(f"Downloading image {file_name} from bucket {bucket_name}.")
    response = minio_client.get_object(bucket_name, file_name)

    try:
        image = Image.open(BytesIO(response.read()))
        return image
    finally:
        response.close()
        response.release_conn()
