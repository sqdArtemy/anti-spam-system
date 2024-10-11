import json
import logging
import re
from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    import dill as pickle
    import time
    import torch
    import torch.nn as nn
    import numpy as np
    import nltk
    from torch import tensor
    from nltk.corpus import stopwords
    from nltk.stem import PorterStemmer


nltk.download('stopwords')
device = "cuda" if torch.cuda.is_available() else "cpu"


def preprocess_text(text: str) -> str:
    logging.info("Start preprocessing text.")
    lower_text = text.lower()
    text_without_links = re.sub(r'http\S+|www\S+|https\S+', '', lower_text, flags=re.MULTILINE)
    plain_text = re.sub(r'[^a-zA-Z\s]', '', text_without_links)
    logging.info("Finish preprocessing text.")
    return plain_text


def tokenizer(text) -> list[str]:
    logging.info("Start tokenizing text.")
    stemmer = PorterStemmer()
    tokens = re.findall(r'\b\w+\b', text)

    stop_words = set(stopwords.words("english"))
    tokens = [word for word in tokens if word not in stop_words]

    tokens = [stemmer.stem(word) for word in tokens]
    logging.info("Finish tokenizing text.")
    return tokens


# Model
class PhishingDetectorModel(nn.Module):
    def __init__(self, input_size: int, hidden_size: int, hidden_size_2: int, output_size: int):
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.layers = nn.ModuleList([
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, hidden_size_2),
            nn.ReLU(),
            nn.Linear(hidden_size_2, output_size)
        ])

    def forward(self, x):
        for layer in self.layers:
            x = layer(x)
        return x


# Core logic function that will serve like an interface
def predict_email(
        email: str, model, vectorizer, top_n: int = 5
) -> str:
    logging.info("Start analyzing email.")
    model.eval()
    time_before = time.time()

    # Vectorizing and transforming mail to a matrix
    logging.info("Transforming mail to tensor.")
    email_csrmatrix = vectorizer.transform([email])
    email_coomatrix = email_csrmatrix.tocoo()
    indices = tensor(np.array([email_coomatrix.row, email_coomatrix.col])).to(device)
    values = tensor(email_coomatrix.data, dtype=torch.float32).to(device)
    email_tensor = torch.sparse_coo_tensor(indices, values, torch.Size(email_coomatrix.shape)).to_dense().to(device)

    with torch.no_grad():
        logging.info("Predicting email by using model.")
        # Predicting and selecting important words
        outputs = model(email_tensor)
        _, prediction = torch.max(outputs, 1)

        first_layer_weights = model.layers[0].weight.data.cpu().numpy()
        suspicious_weights = first_layer_weights[1]

        word_importance = email_tensor[0].cpu() * suspicious_weights
        important_words_indices = np.argsort(word_importance)[-top_n:]

        important_words = [vectorizer.get_feature_names_out()[i] for i in important_words_indices]
        important_scores = [word_importance[i] for i in important_words_indices]

        important_scores = tensor(important_scores).softmax(dim=0)
        important_scores = [score.item() * 100 for score in important_scores]

    time_after = time.time()
    time_taken = time_after - time_before

    confidences = torch.softmax(outputs, dim=1).cpu().numpy()
    formatted_output = {
        "is_suspicious": prediction.item(),
        "confidence": float(confidences.max()) * 100,
        "important_words": list(zip(important_words, important_scores)),
        "time_taken": time_taken,
    }
    logging.info(f"Finished analyzing email in {time_taken} seconds.")

    return json.dumps(formatted_output)


if __name__ == '__main__':
    # Loading pretrained model and vectorized, that were trained in "model.ipynb"
    with open("./vocab.pkl", "rb") as file:
        logging.info("Loading vocabulary for vectorization.")
        vectorizer = pickle.load(file)

    with open("./model.pkl", "rb") as file:
        logging.info("Loading model for prediction.")
        model = pickle.load(file)
