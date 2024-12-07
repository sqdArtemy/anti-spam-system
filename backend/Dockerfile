FROM python:3.12-slim

# Install PostgreSQL development packages
RUN apt-get update && apt-get install -y libpq-dev

WORKDIR /app

COPY . .

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8096

CMD ["sh", "-c", "python env_gen.py && flask db upgrade && python app.py"]
