"""
Script for generating .env template
"""
import secrets


def env_generator() -> None:
    with open(".env", 'w') as env_file:
        env_file.write(f"""SECRET_KEY="{secrets.token_urlsafe(32)}"
JWT_SECRET_KEY="{secrets.token_urlsafe(32)}"
POSTGRES_USER="postgres"
POSTGRES_PW="admin"
POSTGRES_URL="127.0.0.1:5432"
POSTGRES_DB="spam_system"
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_DB="0"
$env:FLASK_APP = "app.py"

TASK_QUEUE="analyze-tasks"
TEMPORAL_URL=localhost:7233
TASK_QUEUE="analyze-tasks"
MINIO_HOST=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadminpassword
MINIO_BUCKET_NAME=images
""")


if __name__ == "__main__":
    env_generator()