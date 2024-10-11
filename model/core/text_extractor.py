import pytesseract
import platform
from PIL import Image, ImageEnhance, ImageFilter
from minio import Minio

from core.image_loader import get_image


def set_tesseract():
    if platform.system() == 'Windows':
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def preprocess_image(image: Image.Image) -> Image.Image:
    image = image.convert("L")

    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)
    sharpener = ImageEnhance.Sharpness(image)
    image = sharpener.enhance(2)

    image = image.filter(ImageFilter.MedianFilter())

    return image


def extract_text_from_image(minio_client: Minio, image_path: str) -> str:
    set_tesseract()
    bucket_name, file_name = image_path.split('/')

    image = get_image(
        minio_client=minio_client,
        bucket_name=bucket_name,
        file_name=file_name
    )
    image = preprocess_image(image)
    text = pytesseract.image_to_string(image, lang='eng')

    return text
