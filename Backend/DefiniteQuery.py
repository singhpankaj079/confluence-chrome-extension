from settings import *
import json

db = SQLAlchemy(app)


class DefiniteQuery(db.Model):
    __tablename__ = 'DefiniteQuery'
    question = db.Column(db.String(80), nullable=False, primary_key=True)
    data = db.Column(db.String(80), nullable=False)

    @staticmethod
    def create_question(_question, _data):

        if _question.isspace() or _question is None or _data is None or _data.isspace():

            raise Exception("Invalid data")

        if DefiniteQuery.query.filter_by(question=_question).first() is None:

            new_definite_query = DefiniteQuery(data=_data, question=_question)

            db.session.add(new_definite_query)

            db.session.commit()

        else:

            query_to_update = DefiniteQuery.query.filter_by(question=_question).first()

            query_to_update.data = query_to_update.data+"|#|"+_data

            query_to_update.question = _question

            db.session.commit()

    @staticmethod
    def read_all_questions():
        return [definite_query.question for definite_query in DefiniteQuery.query.all()]

    @staticmethod
    def read_question(_question):
        requiredQuery = DefiniteQuery.query.filter_by(question=_question).first()
        return {"data": requiredQuery.data}

    @staticmethod
    def update_question(_question, _data):
        query_to_update = DefiniteQuery.query.filter_by(question=_question).first()
        query_to_update.data = _data
        query_to_update.question = _question
        db.session.commit()

    @staticmethod
    def delete_question(_question):
        DefiniteQuery.query.filter_by(question=_question).delete()
        db.session.commit()
