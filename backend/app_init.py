from flask import Flask
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.app_context().push()
app.config.from_object("config.DevelopmentConfig")
app.json.sort_keys = False

ma = Marshmallow(app)