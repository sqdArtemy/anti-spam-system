import os
import uuid

from dotenv import load_dotenv
from minio import Minio

from utilities.enums import Messages

load_dotenv()


class MinioService:
    def __init__(self):
        self.client = Minio(
            os.getenv("MINIO_HOST"),
            os.getenv("MINIO_ACCESS_KEY"),
            os.getenv("MINIO_SECRET_KEY"),
            secure=False
        )
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME")

        if not self.client.bucket_exists(self.bucket_name):
            self.client.make_bucket(self.bucket_name)

    def upload_image(self, image):
        """
        Uploads the image to MinIO.
        """
        if not image:
            raise ValueError(Messages.IMAGE_MISSING.value)

        file_extension = os.path.splitext(image.filename)[1]
        new_filename = f"{uuid.uuid4()}{file_extension}"

        try:
            image_stream = image.stream
            self.client.put_object(
                self.bucket_name,
                new_filename,
                image_stream,
                length=os.fstat(image.stream.fileno()).st_size
            )
            return f"images/{new_filename}"

        except Exception as e:
            raise OSError(Messages.IMAGE_UPLOAD_ERROR.value.format(str(e)))


minio_service = MinioService()
