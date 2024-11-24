from http import HTTPStatus

import pandas as pd
import requests

from db_init import db, transaction
from models import SusError
from schemas.sus_error import SusErrorCreateSchema

API_URL = "http://127.0.0.1:5000/analyze"
dataset_path = "media/emails.csv"
quantity = 1


# Load the dataset
def load_dataset():
    try:
        df = pd.read_csv(dataset_path)
        if len(df) < quantity:
            raise ValueError("Not enough data in the dataset.")
        return df.sample(n=quantity)
    except Exception as e:
        print(f"Error loading dataset: {str(e)}")
        return None


def process_row(row):
    """Process a single dataset row and insert data into DB."""
    email_content = row["text"]
    spam_label = row["spam"]

    payload = {
        "text": email_content,
        "word_number": 10
    }

    try:
        response = requests.post(API_URL, data=payload)

        if response.status_code == HTTPStatus.OK:
            with transaction():
                info = {
                    "is_game": False,
                    "actual_sus": bool(spam_label),
                    "check_request_id": int(response.json()["id"]),
                }

                sus_error = SusError(
                    check_request_id=info["check_request_id"],
                    is_game=info["is_game"],
                    actual_sus=info["actual_sus"]
                )

                print(sus_error)
                db.session.add(sus_error)
                db.session.commit()


    except Exception as e:
        db.session.rollback()
        print(f"Error processing row: {str(e)}")
        return None


def main():

    df = load_dataset()
    if df is None:
        print("Failed to load dataset. Exiting.")
        return

    results = []
    for _, row in df.iterrows():
        result = process_row(row)
        if result:
            results.append(result)

    print(f"Processed {len(results)} rows successfully.")


if __name__ == "__main__":
    main()
