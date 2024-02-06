from flask import Flask, render_template
# kluver might want us to use psycopg2 instead
from flask_sqlalchemy import SQLAlchemy 

# static_url_path allows us to link js files without needing "../" in front
app = Flask(__name__, static_url_path='/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://something'
db = SQLAlchemy(app)

# login page
@app.route('/')
def login():
    return render_template('login.html')

# create new account page
@app.route('/create/acct')
def create_acct():
    return render_template('create_acct.html')

# successful account creation page
@app.route('/succ/acct')
def succ_acct():
    return render_template('succ_acct.html')

# user home page
@app.route('/user/home')
def user_home():
    return render_template('user_home.html')

# successful house creation page
@app.route('/succ/house')
def succ_house():
    return render_template('succ_house.html')

# browse existing houses page (unauthenticated users can view this)
@app.route('/browse')
def browse():
    return render_template('browse.html')

# main house page (calendar w/ tasks, scheduling gpt)
@app.route('/house')
def house():
    return render_template('browse.html')

# assign task page
@app.route('/assign/task')
def assign_task():
    return render_template('assign_task.html')

if __name__ == "__main__":
    app.run(debug=True)
