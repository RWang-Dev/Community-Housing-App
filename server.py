from flask import Flask, render_template, request, redirect, flash, url_for, session, jsonify
from flask_bcrypt import Bcrypt
from data import *
import os, json
from os import environ as env
from urllib.parse import quote_plus, urlencode
from functools import wraps
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from datetime import datetime, timedelta

# from gpt import *

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

# static_url_path allows us to link js files without needing "../" in front
app = Flask(__name__, static_url_path='/static')
app.secret_key = env.get("APP_SECRET_KEY")
bcrypt = Bcrypt(app)
with app.app_context():
    setup()

oauth = OAuth(app)

oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'profile' not in session:
            # Redirect to Login page here
            return redirect('/')
        return f(*args, **kwargs)  # do the normal behavior -- return as it does.

    return decorated


@app.route("/login")
def auth0_login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )

@app.route("/signup")
def auth0_signup():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True),
        screen_hint='signup'
    )


@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    # Manually construct the userinfo URL
    userinfo_url = f'https://{os.getenv("AUTH0_DOMAIN")}/userinfo'
    # Use the full URL to make the request
    resp = oauth.auth0.get(userinfo_url)
    userinfo = resp.json()
    # print(userinfo)
    username = userinfo["nickname"]
    user_email = userinfo["email"]
    
    session["username"] = username
    session["user_email"] = user_email
    

    if not check_user_exists(user_email):
        create_user_account(username, user_email)
        print("created account")

    session["user_id"] = get_user_id(user_email)[0]
    print(session["username"], session["user_email"])
    return redirect("/")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(
        "https://" + env.get("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("login", _external=True),
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )


# landing page
@app.route('/start')
def start():
    return render_template("start.html")


@app.route('/')
def login():
    if 'user' in session:
        # User is logged in
        return redirect("/user/home")  # user home page
    else:
        # User is not logged in
        return redirect("/start")  # landing page


# user home page
@requires_auth
@app.route('/user/home', methods=["GET", "POST"])
def user_home():
    if request.method == "POST":
        house_name = request.form.get("house-name")
        house_name = house_name.strip()
        if house_name.isspace() or house_name == "":
            flash("House name cannot be empty")
            return redirect("/user/home")
        if len(house_name) <= 20:
            pass
        else:
            flash("House name must be alphanumeric and less than 20 characters")
            return redirect("/user/home")
        if not check_house_exists(house_name):
            create_house(house_name)
        else:
            flash("House name already taken")
        return redirect("/user/home")
    else:
        houses = get_houses()
        user_houses = get_user_houses(session["user_id"])
        
        return render_template('user_home.html', houses=houses, user_houses=user_houses, cur_user=session["username"])

@requires_auth
@app.route("/join-house", methods=["POST"])
def join_house():
    data = request.get_json()
    add_user_house(session["user_id"], data["house_id"])

    return jsonify({"result": "ok"})

@requires_auth
@app.route("/leave-house", methods=["POST"])
def leave_house():
    data = request.get_json()
    delete_tasks_by_user_and_house(session["user_id"], data["house_id"])
    remove_user_house(session["user_id"], data["house_id"])

    return jsonify({"result": "ok"})

# for join button in user home
@app.route('/join-house', methods=['POST'])
@requires_auth
def join_house_route():
    user_id = session.get('user_id')
    house_id = request.json.get('house_id')
    join_house(user_id, house_id) # add entry to user_houses
    return jsonify({'message': 'House joined successfully'})

# browse existing houses page (unauthenticated users can view this)
@app.route('/browse')
def browse():
    houses = get_houses()
    return render_template('browse.html', houses=houses)

# used for Current members button in browse.html
@app.route('/get-members')
def get_members():
    house_id = request.args.get('house_id')
    members = get_house_members(house_id)
    return jsonify({'members': members})


# main house page (calendar w/ tasks, scheduling gpt)
@requires_auth
@app.route('/house/<int:house_id>')
def house(house_id):
    house_name = get_house_name_by_id(house_id)
    members = get_house_members(house_id)
    member_id_dict = get_member_id_dict(house_id)
    house_tasks = get_tasks_by_house_id(house_id)
    print(house_tasks)
    return render_template('house.html', house_id=house_id, house_tasks=house_tasks, house_name=house_name, member_id_dict=member_id_dict, members=members, cur_user=session["username"])

def day_rounder(t):
    if t.hour < 12 or (t.hour == 12 and t.minute == 0 and t.second == 0 and t.microsecond == 0):
        return t.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        rounded_up = t.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
        return rounded_up
    
# for calendar in house page 
@app.route("/get-tasks/<int:house_id>", methods=["GET"])
def get_tasks(house_id):
    tasks = get_tasks_by_house_id(house_id)
    events = []
    for task in tasks:
        event = {
            'title': task[1],  # task name
            'assignee': get_user_by_id(task[2])[0],
            'start': task[5],  # due date
            'end': task[5] + timedelta(hours=1),  # add some time from start 
            'end-day': day_rounder(task[5])
        }
        events.append(event)
    # print(events)
    return jsonify(events)

# assign task page
@requires_auth
@app.route('/assign-task/<int:house_id>', methods=["GET", "POST"])
def assign_task(house_id):
    if request.method == "POST":
        task_name = request.form.get("task-name")
        user_responsible = request.form.get("person")
        task_due_date_str = request.form.get("task-due-date")
        task_due_date = datetime.strptime(task_due_date_str, "%Y-%m-%dT%H:%M")
        insert_task(task_name, user_responsible, house_id, task_due_date)

        return redirect(url_for('house', house_id=house_id))
    elif request.method == "GET":
        member_id_dict = get_member_id_dict(house_id)
        return render_template('assign_task.html', house_id=house_id, member_id_dict=member_id_dict)

# edit task page
@requires_auth
@app.route('/edit-task', methods=["GET", "POST"])
# someone will have to implement the DB on the backend to handle this
def edit_task():
    if request.method == "POST":
        response = request.form.to_dict()
        edit_task_db(response)
        return redirect("/house")
    elif request.method == "GET":
        return render_template('edit_task.html')


# ai schedule page
@requires_auth
@app.route('/ai_schedule', methods=["GET"])
# someone will have to implement the DB on the backend to handle this
def ai_schedule():
    house_members = get_house_members(get_house_id())
    diet_members = get_dietary_restrictions(get_house_id())
    schedule_members = get_schedule(get_house_id())
    show_schedule = get_openai_weekly_menu(house_members, diet_members, schedule_members)
    return render_template('gpt.html', show_schedule=show_schedule)

if __name__ == "__main__":
    ip = os.environ.get("IP")
    port = os.environ.get("PORT")
    # app.run(debug=True, host=ip, port=port)
    app.run(debug=True, host="0.0.0.0", port=env.get("PORT", 3000))