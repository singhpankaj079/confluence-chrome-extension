
To run the backend:
$$$  python <API_FILE>.py //Here API_file --> Api.py

___________________________________________________
Made Any changes to db structure:

$$$ python
>>> from <DbNAME> import db //here dbName= DefiniteQuery
>>> db.create_all()
________________________________________________________________________________

How to initialize project:

If you install any new dependencies:
$ pip freeze > requirements.txt

If you are downloading this for the first time:
$ pip install -r requirements.txt

If you made changes to requirements.txt:
pip install --upgrade -r requirements.txt
____________________________________________________________________
FYI: https://realpython.com/lessons/using-requirement-files/#description
_______________________________________________________________________________
