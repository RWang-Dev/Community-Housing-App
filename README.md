# Module 1 Group Assignment

CSCI 5117, Spring 2024, [assignment description](https://canvas.umn.edu/courses/413159/pages/project-1)

## App Info:

* Team Name: The Forge
* App Name: The Forge
* App Link: https://five117project1.onrender.com/

### Students

* Ariel Larin, larin006@umn.edu
* Stephen Ma, ma000094@umn.edu
* Robert Wang, wan00379@umn.edu
* Benjamin Lindeen, lind1669@umn.edu
* Justin Lee, lee03360@umn.edu


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* It was challenging figuring out how to have the monthly, weekly, and daily views of the calendar display different texts for the events.
* It was challenging implementing the GPT feature specifically for meal prep scheduling.
* It was challenging getting the Auth0 authentication to work while integrating user login information with our database.

## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

When you git clone and run it locally, use "python server.py".


## Screenshots of Site
Landing Page:
![start](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/1805df76-1a7e-4931-80d5-c7890a69dd17)

Browse Houses (for unauthenticated users):
![browse](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/89720671-407f-49fa-b2ef-b22d6ea99b91)

User Home: 
![userhome](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/36e9284b-d099-4516-bc88-c8faa90b3b7a)

House (includes schedule with tasks for specific house):
![house](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/dbc52fef-8243-4145-9984-edde0de24aa0)

Assign a task:
![assigntask](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/83da778d-1b10-497d-bf0b-c6204d698d4f)

Edit a task:
![edittask](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/a475c1b0-ba1c-4c95-8ebe-e0bbe5d0783d)

Delete task:
![deletetask](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/cdfbb199-5f8a-45e0-90f5-99ced015b9bb)

Add dietary and scheduling restrictions:
![restrictions](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/0e53d98b-72ed-4213-9780-6586bf89f7ae)

GPT generated Meal schedule:
![mealscheduling](https://github.com/csci5117s24/project-1-the-forge/assets/96703864/09a21cda-724e-48b1-ba19-1e37cb6ddda6)



## Mock-up 

For our mock-up, we used moqups.com. Here is the link to our project's mock-up: https://app.moqups.com/YNMhuzHJvPp6BjuZ5UiGY9PxBvGqCi8I/view/page/a880590a1.



<img width="1208" alt="Screenshot 2024-02-05 at 12 14 26 PM" src="https://github.com/csci5117s24/project-1-the-forge/assets/96703864/78e60ac7-31e3-41c6-b734-8515e09d562b">

## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries. or libraries that are mentioned in the product requirements**

* Flask-psycopg2: for interacting with Postgres database
* Authlib and OAuth: for implementing authentication and user management
* GPT: for generating AI-generated content for weekly meal schedules based on dietary restrictions and member schedules
* Button Inspiration: https://gradientbuttons.colorion.co/ for silverish buttons on /house and https://getcssscan.com/css-buttons-examples for purplish buttons on /start
* Inspirtion for Wave Gradients on assign-task, edit-task, and delete-task: https://devdevout.com/css/css-animated-backgrounds
* Video background on start page: https://www.pexels.com/video/night-view-of-minneapolis-city-in-minnesota-usa-17153645/

**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:
  A great deal of YouTube, MDN, and docs were used as a means of learning the skills required to build our app.
**

...
