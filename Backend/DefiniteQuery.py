from settings import *
import json
from sqlalchemy import func
db = SQLAlchemy(app)


class DefiniteQuery(db.Model):
    __tablename__ = 'DefiniteQuery'
    question = db.Column(db.String(80), nullable=False, primary_key=True)
    data = db.Column(db.String(80), nullable=False)

    @staticmethod
    def create_question(_question, _data):
        if _question.isspace() or _question is None or _data is None or _data.isspace():

            raise Exception("Invalid data")
        _question = _question.strip()
        _data = _data.strip()
        if DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first() is None:

            new_definite_query = DefiniteQuery(data=_data, question=_question)

            db.session.add(new_definite_query)

            db.session.commit()

        else:

            query_to_update = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()

            query_to_update.data = query_to_update.data+"|#|"+_data

            query_to_update.question = _question

            db.session.commit()

    @staticmethod
    def read_all_questions():
        return [definite_query.question for definite_query in DefiniteQuery.query.all()]

    @staticmethod
    def read_question(_question):
        requiredQuery = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()

        _question = _question.strip()
        return {"data": requiredQuery.data}

    @staticmethod
    def update_question(_question, _data):
        query_to_update = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()

        _question = _question.strip()
        _data = _data.strip()
        query_to_update.data = _data
        query_to_update.question = _question
        db.session.commit()

    @staticmethod
    def delete_question(_question):
        DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first().delete()
        # DefiniteQuery.query.filter_by(question=_question).delete()
        _question = _question.strip()
        db.session.commit()

    @staticmethod

    def delete_answer(_question, _data):
        _question = _question.strip()
        _data = _data.strip()
        if DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first() is None:
            pass

        else:
            # query_to_update = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()
            _question = _question.strip()
            query_to_update = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()
            _data = _data.strip()
            allAnswers = query_to_update.data.split("|#|")

            for idx,i in enumerate(allAnswers):

                if(i.casefold()==_data.casefold()):

                    del allAnswers[idx]

            query_to_update.data = ("|#|").join(allAnswers)

            query_to_update.question = _question

            db.session.commit()

    @staticmethod
    def update_faq(_question, _faq,_new_answer):
        _question = _question.strip()
        _faq = _faq.strip()
        if DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first() is None:
            new_definite_query = DefiniteQuery(data="", question=_question)

            db.session.add(new_definite_query)

            db.session.commit()
    
        # query_to_update = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()
        query_to_update = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()
        
        allAnswers = query_to_update.data.split("|#|")
       

        for idx,i in enumerate(allAnswers):
            if(i.find('|##|')!=-1 ):
                faqFound = i.split('|##|')[0]
                if(faqFound.casefold()==_faq.casefold()):
                    del allAnswers[idx]

        query_to_update.data = ("|#|").join(allAnswers) + '|#|' +_faq + '|##|' + _new_answer

        query_to_update.question = _question

        db.session.commit()

    @staticmethod
    def delete_faq(_question, _faq):
        _question = _question.strip()
        _faq = _faq.strip()
        if DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first() is None:
            pass

        else:
            # query_to_update = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()
            query_to_update = DefiniteQuery.query.filter(func.lower(DefiniteQuery.question) == func.lower(_question)).first()
            allAnswers = query_to_update.data.split("|#|")

            for idx,i in enumerate(allAnswers):
                if(i.find('|##|')!=-1 ):
                    faqFound = i.split('|##|')[0]
                    if(faqFound.casefold()==_faq.casefold()):
                        del allAnswers[idx]

            query_to_update.data = ("|#|").join(allAnswers)

            query_to_update.question = _question

            db.session.commit()
