from DefiniteQuery import *
#Dummy
@app.route('/questions', methods=['GET'])
def get_questions():
    return jsonify({'questions': DefiniteQuery.read_all_questions()})


@app.route('/questions/<string:question>', methods=['GET'])
def get_question(question):
    return jsonify(DefiniteQuery.read_question(_question=question))


@app.route('/questions', methods=['POST'])
def post_question():
    request_data = request.get_json()
    if (request_data is None):
        return Response("Question Empty", 200, mimetype='application/json')
    DefiniteQuery.create_question(_question=request_data["question"], _data=request_data["data"])
    response = Response("Question added", 201, mimetype='application/json')
    return response


@app.route('/questions/update', methods=['PUT'])
def update_data():
    request_data = request.get_json()
    DefiniteQuery.update_question(_question=request_data["question"], _data=request_data['data'])
    response = Response("Question Updated", status=200, mimetype='application/json')
    return response


@app.route('/questions/<string:question>/remove', methods=['DELETE'])
def remove_question(question):
    print("__"+question)
    DefiniteQuery.delete_question(question)
    response = Response("Question Deleted", status=200, mimetype='application/json')
    return response

@app.route('/questions/deleteAnswer',methods = ['POST'])
def delete_answer():
    request_data = request.get_json()
    DefiniteQuery.delete_answer(_question=request_data["question"], _data=request_data['data'])
    response = Response("Answer Deleted", status=200, mimetype='application/json')
    return response

@app.route('/questions/updateFAQ',methods = ['POST'])
def update_faq():
    request_data = request.get_json()
    DefiniteQuery.update_faq(_question=request_data["question"], _faq=request_data['faq'], _new_answer = request_data['new_answer'])
    response = Response("Answer updated", status=200, mimetype='application/json')
    return response

@app.route('/questions/deleteFAQ',methods = ['POST'])
def delete_faq():
    request_data = request.get_json()
    DefiniteQuery.delete_faq(_question=request_data["question"], _faq=request_data['faq'])
    response = Response("Answer deleted", status=200, mimetype='application/json')
    return response

if __name__ == "__main__":
    app.run(port=1234, debug=True)
