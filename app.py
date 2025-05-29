from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configuration
POSTGRES_USER = os.getenv("POSTGRES_USER", "user")
POSTGRES_PW = os.getenv("POSTGRES_PASSWORD", "password")
POSTGRES_URL = os.getenv("POSTGRES_URL", "db")
POSTGRES_DB = os.getenv("POSTGRES_DB", "learning_tracker")
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{POSTGRES_USER}:{POSTGRES_PW}@{POSTGRES_URL}:5432/{POSTGRES_DB}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init DB and Marshmallow
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Resource Model
class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(300))
    type = db.Column(db.String(50))
    category = db.Column(db.String(100))
    status = db.Column(db.String(50))

class ResourceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Resource

resource_schema = ResourceSchema()
resources_schema = ResourceSchema(many=True)

# Routes
@app.route("/resources", methods=["POST"])
def add_resource():
    data = request.json
    new_resource = Resource(
        title=data["title"],
        url=data.get("url"),
        type=data.get("type"),
        category=data.get("category"),
        status=data.get("status", "Not Started")
    )
    db.session.add(new_resource)
    db.session.commit()
    return resource_schema.jsonify(new_resource)

@app.route("/resources", methods=["GET"])
def get_resources():
    all_resources = Resource.query.all()
    return resources_schema.jsonify(all_resources)

@app.route("/resources/<int:id>", methods=["PUT"])
def update_resource(id):
    resource = Resource.query.get_or_404(id)
    data = request.json
    resource.title = data.get("title", resource.title)
    resource.url = data.get("url", resource.url)
    resource.type = data.get("type", resource.type)
    resource.category = data.get("category", resource.category)
    resource.status = data.get("status", resource.status)
    db.session.commit()
    return resource_schema.jsonify(resource)

@app.route("/resources/<int:id>", methods=["DELETE"])
def delete_resource(id):
    resource = Resource.query.get_or_404(id)
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Resource deleted"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
