from flask import Flask, request, Response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
