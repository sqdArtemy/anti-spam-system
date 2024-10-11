import pytesseract
import platform
from PIL import Image, ImageEnhance, ImageFilter


def set_tesseract():
    if platform.system() == 'Windows':
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def preprocess_image(image_path: str) -> Image:
    image = Image.open(image_path)
    image = image.convert("L")

    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)
    sharpener = ImageEnhance.Sharpness(image)
    image = sharpener.enhance(2)

    image = image.filter(ImageFilter.MedianFilter())

    return image


def extract_text_from_image(image_path: str) -> str:
    set_tesseract()

    image = preprocess_image(image_path)
    text = pytesseract.image_to_string(image, lang='eng')

    return text
