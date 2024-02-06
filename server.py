from flask import Flask, render_template, request, redirect, flash, url_for
# kluver might want us to use psycopg2 instead
from flask_sqlalchemy import SQLAlchemy 


# static_url_path allows us to link js files without needing "../" in front
app = Flask(__name__, static_url_path='/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://something'
db = SQLAlchemy(app)
app.config['SECRET_KEY'] = 'N^85r7b85rF&$%VR754e6cv43WC&*)&h(^42WNI69&6'  

# login page
@app.route('/')
def login():
    return render_template('login.html')

# create new account page
@app.route('/create/acct', methods=['GET', 'POST'])
def create_acct():
    if request.method == 'POST':
        return redirect("/user/home")
    else:
        return render_template('create_acct.html')


# user home page
@app.route('/user/home')
def user_home():
    return render_template('user_home.html')

# browse existing houses page (unauthenticated users can view this)
@app.route('/browse')
def browse():
    return render_template('browse.html')

# main house page (calendar w/ tasks, scheduling gpt)
@app.route('/house')
def house():
    return render_template('house.html')

# assign task page
@app.route('/assign/task')
def assign_task():
    return render_template('assign_task.html')

if __name__ == "__main__":
    app.run(debug=True)
