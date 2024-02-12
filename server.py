from flask import Flask, render_template, request, redirect, flash, url_for
# kluver might want us to use psycopg2 instead
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from data import *
import os


# static_url_path allows us to link js files without needing "../" in front
app = Flask(__name__, static_url_path='/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://something'
db = SQLAlchemy(app)
app.config['SECRET_KEY'] = 'N^85r7b85rF&$%VR754e6cv43WC&*)&h(^42WNI69&6'

bcrypt = Bcrypt(app)

with app.app_context():  
    setup()

# login page
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get("username")
        password = request.form.get("password")
        user_record = check_user_exists(username)
        if user_record:
            is_valid = bcrypt.check_password_hash(user_record[0], password)
            if is_valid:
                return redirect("/user/home")
            else:
                flash("Incorrect username or password")
                return render_template('login.html')
        else:
            flash("Incorrect username or password")
            return render_template('login.html')

    return render_template('login.html')

# create new account page
@app.route('/create/acct', methods=['GET', 'POST'])
def create_acct():
    if request.method == 'POST':
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        create_user_account(username, email, password_hash)
        return redirect("/user/home")
    else:
        return render_template('create_acct.html')


# user home page
@app.route('/user/home', methods=["GET", "POST"])
def user_home():
    if request.method == "POST":
        house_name = request.form.get("house-name")
        if house_name.isspace() or house_name == "":
            flash("House name cannot be empty")
            return redirect("/user/home")
        if not check_house_exists(house_name):
            create_house(house_name)
        else:
            flash("House name already taken")
        return redirect("/user/home")
    else:
        houses = get_houses()
        print(houses)
        return render_template('user_homeV2.html', houses=houses)

# browse existing houses page (unauthenticated users can view this)
@app.route('/browse')
def browse():
    return render_template('browse.html')

# main house page (calendar w/ tasks, scheduling gpt)
@app.route('/house')
def house():
    return render_template('house.html')

# assign task page
@app.route('/assign-task', methods=["GET", "POST"])
# someone will have to implement the DB on the backend to handle this
def assign_task():
    if request.method == "POST":
        response = request.form.to_dict()
        assign_task_db(response)
        return redirect("/house")
    elif request.method == "GET":
        return render_template('assign_task.html')

@app.route('/edit-task' , methods=["GET", "POST"])
# someone will have to implement the DB on the backend to handle this
def edit_task():
    if request.method == "POST":
        response = request.form.to_dict()
        edit_task_db(response)
        return redirect("/house")
    elif request.method == "GET":
        return render_template('edit_task.html')

if __name__ == "__main__":
    ip = os.environ.get("IP")
    port = os.environ.get("PORT")
    app.run(debug=True, host=ip, port=port)
