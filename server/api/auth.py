from flask_restx import Resource, Namespace
from flask import request, abort, jsonify
from db.util import *
from utils.models import *
from utils.util import *
import email
import smtplib


api = Namespace(
    "auth", description="authentication actions, including signup, and login"
)


@api.route("/login")
class Login(Resource):
    @api.doc(description="login, provide email & password in the json body")
    @api.expect(login_model)
    @api.response(200, "Success")
    @api.response(403, "Incorrect email or password / No json body supplied")
    @api.response(500, "Database error")
    def post(self):
        # check json
        data = request.json
        if not data:
            abort(403, "No json supplied")

        email = data.get("email")
        password = data.get("password")

        if email is None or password is None:
            abort(403, "Need to provide both email and password")

        token = get_token(email, password)
        result = {"token": token}
        return jsonify(result)


@api.route("/signup")
class Signup(Resource):
    @api.doc(
        description="signup, provide username, email, and password in the json body, optional avatar in base64"
    )
    @api.expect(signup_model)
    @api.response(200, "Success")
    @api.response(401, "email has been taken")
    @api.response(403, "No json body supplied / Missing values in json")
    @api.response(500, "Database error")
    def post(self):
        data = request.json
        if not data:
            abort(403, "No json supplied")

        # the first 3 values need to be exist
        email = data.get("email")
        password = data.get("password")
        username = data.get("username")
        avatar = data.get("avatar")

        if email is None or password is None or username is None:
            abort(403, "Require email, password, and username in the json")

        # password at least 6 characters
        if len(password) < 6:
            abort(403, "Password at least 6 characters length")

        # username should not be empty
        if len(username) == 0 or len(email) == 0:
            abort(403, "Username and email should not be empty")

        # check if email is taken
        if is_email_taken(email):
            abort(401, "Email has been taken")

        # insert to database
        insert_new_user(username, password, email, avatar)

        # return the token
        token = get_token(email, password)
        result = {"token": token}
        return jsonify(result)


@api.route("/reset_password")
class ResetPassword(Resource):
    @api.doc(description="reset password to a random generated one when give the account email")
    @api.expect(reset_pwd_model, validate=True)
    @api.response(200, "Successfully reset password to a random generated one for the given email")
    @api.response(400, "Invalid parameter")
    @api.response(401, "No account with that email")
    @api.response(500, "Database error")
    def post(self):
        data = request.json
        receiveemail = data["email"]

        # check if there is account with this email
        if not is_email_taken(receiveemail):
            abort(401, "No account with that email {}".format(receiveemail))

        # update password to a random password
        new_password = reset_password(receiveemail)

        # Login Credential
        SenderEmail = 'ericzhaomsender@hotmail.com'
        SenderPassword = 'Zhao123456.'
        SMTPServer = 'smtp-mail.outlook.com'
        SMTPPort = 587

        # Email Content
        msg = email.message_from_string('This is your new password: ' + str(new_password))
        msg['From'] = SenderEmail
        msg['To'] = receiveemail
        msg['Subject'] = "MoviePalooza | Reset Password"

        # Establish Connection to SMTP Server and Send Email
        s = smtplib.SMTP(SMTPServer, SMTPPort)
        s.ehlo()  # Hostname to send for this command defaults to the fully qualified domain name of the local host.
        s.starttls()  # Puts connection to SMTP server in TLS mode
        s.ehlo()
        s.login(SenderEmail, SenderPassword)
        s.sendmail(SenderEmail, receiveemail, msg.as_string())

        # End Connection
        s.quit()

        return


