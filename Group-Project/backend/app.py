from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import os
import re
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules


# --------------------------------------------------
# Create Flask application
# --------------------------------------------------

app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# Validation helpers
# --------------------------------------------------

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


def is_valid_email(email):
    return bool(EMAIL_REGEX.match(email))


def password_error(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r"[A-Za-z]", password):
        return "Password must contain at least one letter."
    if not re.search(r"[0-9]", password):
        return "Password must contain at least one number."
    return None


# --------------------------------------------------
# Database Setup (MongoDB - users, orders, transactions)
# --------------------------------------------------

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "recoai")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[MONGO_DB_NAME]

users_col = db["users"]
orders_col = db["orders"]
transactions_col = db["transactions"]


def init_db():
    # Unique email index replaces the SQLite UNIQUE constraint
    users_col.create_index("email", unique=True)
    orders_col.create_index([("user_id", 1), ("created_at", -1)])
    transactions_col.create_index("TransactionID", unique=True)

    # Seed the transactions collection from the CSV on first run
    if transactions_col.count_documents({}) == 0:
        seed = pd.read_csv("transactions.csv")
        docs = [
            {
                "TransactionID": int(row["TransactionID"]),
                "Products": row["Products"],
            }
            for _, row in seed.iterrows()
        ]
        if docs:
            transactions_col.insert_many(docs)
            print(f"Seeded {len(docs)} transactions into MongoDB.")


init_db()


def parse_object_id(value):
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        return None


# --------------------------------------------------
# Load Dataset
# --------------------------------------------------

data = pd.DataFrame(
    list(transactions_col.find({}, {"_id": 0}).sort("TransactionID", 1))
)


# Convert Products column into lists
transactions = data["Products"].apply(
    lambda x: x.split("|")
).tolist()


# --------------------------------------------------
# Convert transactions into one-hot encoded data
# --------------------------------------------------

encoder = TransactionEncoder()

encoded_data = encoder.fit(transactions).transform(transactions)

basket = pd.DataFrame(
    encoded_data,
    columns=encoder.columns_
)


# --------------------------------------------------
# Find frequent itemsets
# --------------------------------------------------

frequent_itemsets = apriori(
    basket,
    min_support=0.05,
    use_colnames=True
)


# --------------------------------------------------
# Generate association rules
# --------------------------------------------------

rules = association_rules(
    frequent_itemsets,
    metric="confidence",
    min_threshold=0.2
)


# --------------------------------------------------
# Debug information
# --------------------------------------------------

print("\n========== DATASET ==========")
print("Number of transactions:", len(data))
print("Products:", list(encoder.columns_))

print("\n========== FREQUENT ITEMSETS ==========")
print(frequent_itemsets)

print("\n========== ASSOCIATION RULES ==========")

if len(rules) > 0:
    print(
        rules[
            [
                "antecedents",
                "consequents",
                "support",
                "confidence",
                "lift"
            ]
        ]
    )
else:
    print("No association rules found.")


# --------------------------------------------------
# Register API
# --------------------------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    body = request.get_json(silent=True) or {}

    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required."}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    pw_error = password_error(password)
    if pw_error:
        return jsonify({"error": pw_error}), 400

    password_hash = generate_password_hash(password)

    try:
        users_col.insert_one({
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    except DuplicateKeyError:
        return jsonify({"error": "An account with this email already exists."}), 409

    return jsonify({"message": "Registration successful."}), 201


# --------------------------------------------------
# Login API
# --------------------------------------------------

@app.route("/api/login", methods=["POST"])
def login():

    body = request.get_json(silent=True) or {}

    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = users_col.find_one({"email": email})

    if user is None or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    return jsonify({
        "message": "Login successful.",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
        },
    }), 200


# --------------------------------------------------
# Orders API
# --------------------------------------------------

@app.route("/api/orders", methods=["POST"])
def create_order():

    body = request.get_json(silent=True) or {}

    user_id = body.get("user_id")
    items = body.get("items")
    total = body.get("total")

    if not user_id or not items or total is None:
        return jsonify({"error": "user_id, items and total are required."}), 400

    user_oid = parse_object_id(user_id)

    if user_oid is None or users_col.find_one({"_id": user_oid}, {"_id": 1}) is None:
        return jsonify({"error": "Invalid user."}), 400

    result = orders_col.insert_one({
        "user_id": user_oid,
        "items": items,
        "total": float(total),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return jsonify({"message": "Order placed.", "order_id": str(result.inserted_id)}), 201


@app.route("/api/orders/<user_id>")
def get_orders(user_id):

    user_oid = parse_object_id(user_id)

    if user_oid is None:
        return jsonify([])

    rows = orders_col.find({"user_id": user_oid}).sort("created_at", -1)

    orders = []

    for row in rows:
        orders.append({
            "id": str(row["_id"]),
            "items": row["items"],
            "total": row["total"],
            "created_at": row["created_at"],
        })

    return jsonify(orders)


# --------------------------------------------------
# Home API
# --------------------------------------------------

@app.route("/")
def home():

    return jsonify({
        "message": "RecoAI Recommendation API is running!"
    })


# --------------------------------------------------
# Get Products
# --------------------------------------------------

@app.route("/api/products")
def get_products():

    products = []

    for product in encoder.columns_:

        products.append({
            "name": product
        })

    return jsonify(products)


# --------------------------------------------------
# Recommendation API
# --------------------------------------------------

@app.route("/api/recommendations/<path:product_name>")
def get_recommendations(product_name):

    # Convert URL format to dataset format
    product_name = product_name.replace("-", " ")

    # Fix USB-C naming
    product_name = product_name.replace(
        "USB C",
        "USB-C"
    )

    print("\nRequested product:", product_name)

    recommendations = []

    # Search association rules
    for _, rule in rules.iterrows():

        antecedents = list(rule["antecedents"])
        consequents = list(rule["consequents"])

        # Check if selected product is in antecedent
        if product_name in antecedents:

            for product in consequents:

                # Don't recommend selected product
                if product != product_name:

                    recommendations.append({

                        "name": product,

                        "score": round(
                            float(rule["confidence"]) * 100,
                            2
                        ),

                        "support": round(
                            float(rule["support"]) * 100,
                            2
                        ),

                        "confidence": round(
                            float(rule["confidence"]) * 100,
                            2
                        ),

                        "lift": round(
                            float(rule["lift"]),
                            2
                        )
                    })


    # --------------------------------------------------
    # Remove duplicate recommendations
    # --------------------------------------------------

    unique_recommendations = {}

    for recommendation in recommendations:

        name = recommendation["name"]

        if (
            name not in unique_recommendations
            or recommendation["score"]
            > unique_recommendations[name]["score"]
        ):

            unique_recommendations[name] = recommendation


    # --------------------------------------------------
    # Sort recommendations
    # --------------------------------------------------

    final_recommendations = sorted(
        unique_recommendations.values(),
        key=lambda x: x["score"],
        reverse=True
    )


    print(
        "Final recommendations:",
        final_recommendations
    )


    return jsonify({

        "product": product_name,

        "recommendations": final_recommendations

    })
# --------------------------------------------------
# Popular Products API
# --------------------------------------------------

@app.route("/api/popular-products")
def popular_products():

    product_count = {}

    for transaction in transactions:

        for product in transaction:

            if product in product_count:
                product_count[product] += 1
            else:
                product_count[product] = 1

    products = []

    for product, count in product_count.items():

        products.append({
            "name": product,
            "category": "General",
            "purchases": count,
            "growth": f"+{round(count/len(data)*100,1)}%"
        })

    products = sorted(
        products,
        key=lambda x: x["purchases"],
        reverse=True
    )

    return jsonify(products)
# --------------------------------------------------
# Admin API
# --------------------------------------------------

@app.route("/api/admin")
def admin():

    return jsonify({

        "transactions": len(data),

        "products": len(encoder.columns_),

        "rules": len(rules),

        "confidence": round(
            rules["confidence"].mean() * 100,
            2
        ) if len(rules) > 0 else 0,

        "algorithm": "Apriori",

        "support": "5%",

        "min_confidence": "20%",

        "backend": "Flask + MongoDB",

        "frontend": "React + TypeScript",

        "status": "Running"

    })


# --------------------------------------------------
# Dashboard Statistics API
# --------------------------------------------------

@app.route("/api/stats")
def get_stats():

    total_transactions = len(data)

    total_products = len(encoder.columns_)

    total_rules = len(rules)

    average_confidence = 0

    if len(rules) > 0:

        average_confidence = round(
            rules["confidence"].mean() * 100,
            2
        )

    return jsonify({

        "total_transactions": total_transactions,

        "total_products": total_products,

        "total_rules": total_rules,

        "average_confidence": average_confidence

    })


# --------------------------------------------------
# Run Flask
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )