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