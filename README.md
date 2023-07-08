# MoviePalooza - Movie Finder Website


## Frontend View
The production mode is deployed on Vercel **[https://movie-finder-three-inky.vercel.app/](https://movie-finder-three-inky.vercel.app/)** because of hiding two external API Keys.


## Run Backend

1. Open an terminal and enter the **server** folder

    ```
    > cd server
    ```

1. Download the latest database file **project.db** from **[https://drive.google.com/file/d/1NVoBrm0IEq2UeinP6L2-TUQk9GBpQ55M/view?usp=sharing](https://drive.google.com/file/d/1NVoBrm0IEq2UeinP6L2-TUQk9GBpQ55M/view?usp=sharing)**. The database file should be around 1.8GB.

1. Place the **project.db** file into the **server** folder. When you enter **ls** in the terminal, you should see the following files and folders:

    ```
    > ls

    app.py  db  recom.py    utils   api     config.py   project.db    requirements.txt
    ```

2. Install all dependencies. Ensure you have at least python 3.7 installed !!!

    ```
    pip3 install -r requirements.txt
    ```

    If the terminal says pip3 is not installed, then enter the command to install pip3

    ```
    sudo apt install python3-pip
    ```

    And install the requirements.txt again.

3. Run the app.py file

    ```
    python3 app.py
    ```

    or

    ```
    /bin/python3 server/app.py
    ```

    You should see the following message when the server is in good functioning:

    ```
    * Serving Flask app 'config'
    * Debug mode: on
    WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
    * Running on http://127.0.0.1:5005
    Press CTRL+C to quit
    * Restarting with stat
    * Debugger is active!
    * Debugger PIN: 129-057-237
    ```

The server is running on port 5005.

Open **[http://127.0.0.1:5005](http://127.0.0.1:5005)** to view the backend api interface.

## Screenshots
#### Home Page
![Home Page](/screenshot/home.png)
#### Movies Page
![Movies Page](/screenshot/Movies.png)
#### Movie Page
![Movie Page](/screenshot/MoviePage.png)
#### Login/Sign up Page
![Login/Signup Page](/screenshot/Login.png)
![Login/Signup Page](/screenshot/Signup.png)
#### Cast Page
![Cast Page](/screenshot/actorpage.png)
#### User Page
![Cast Page](/screenshot/Userpage.png)
#### Search Page
![Search Page](/screenshot/search.png)
#### ...Ban List Page, Wish List Page, Following Page etc.