FROM python:3.12-slim

COPY .env .env
WORKDIR /app
COPY . .
COPY ./core/model.pkl ./core/vocab.pkl /app/core/

# Install Tesseract OCR and system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Install requiremenets
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


EXPOSE 7233

CMD ["python", "./worker.py"]

