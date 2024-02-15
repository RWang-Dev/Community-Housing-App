from flask import Flask, render_template, request, redirect, flash, url_for, session
from flask_bcrypt import Bcrypt
from data import *
import os, json
from os import environ as env
from urllib.parse import quote_plus, urlencode
from functools import wraps
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv

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

        print(houses)
        return render_template('user_home.html', houses=houses)


# browse existing houses page (unauthenticated users can view this)
@app.route('/browse')
def browse():
    houses = get_houses()
    return render_template('browse.html', houses=houses)


# main house page (calendar w/ tasks, scheduling gpt)
@requires_auth
@app.route('/house')
def house():
    return render_template('house.html')


# assign task page
@requires_auth
@app.route('/assign-task', methods=["GET", "POST"])
# someone will have to implement the DB on the backend to handle this
def assign_task():
    if request.method == "POST":
        response = request.form.to_dict()
        assign_task_db(response)
        return redirect("/house")
    elif request.method == "GET":
        return render_template('assign_task.html')


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
