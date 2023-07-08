from config import create_app

app = create_app()

if __name__ == "__main__":
    # print("***************************** !!!!!!!!!!! *****************************")
    # print("Ensure you downloaded the latest database file from the google drive")
    # print("And store it in the folder server/instance")
    # print("Otherwise the database does not have images")
    # print("***************************** !!!!!!!!!!! *****************************")
    app.run(debug=True, port=5005)
