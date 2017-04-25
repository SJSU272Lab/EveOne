## Fall16-Team25

## Project Name: EveOne - Go Paperless

#### Application URL : https://eveone.herokuapp.com/

#### Demo Video URL: https://youtu.be/n_NlZmN8zBw

#### Presentation URL: http://prezi.com/wageif707gya/?utm_campaign=share&utm_medium=copy&rc=ex0share

#### Understand EveOne URL: https://github.com/SJSU272Lab/EveOne/tree/master/Promotional%20video

#
## Table of Contents
-----------------
- [About EveOne](#about-eveone)
- [Judging Rules](#judging-rules)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [User Stories](#user-stories)
- [Development Stack](#development-stack) 
- [Getting started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installing](#installing)

#


### About EveOne
--------

We have built a solution to automate managing events/tournaments (such as speech and debate) for schools where parent participate for judging the event. Our approach is to facilitate collaboration between organizer and parents seamlessly. Organizer uses our web application to create and manage event and judges information, he can access parent list of mail id's to send invites for event. Parent uses mobile application to accept or decline invites.On demand matching(back filling)  can be done by the admin itself.

#

### Judging Rules
--------------

 Please see the judging instruction to understand the process at this link - http://www.myteacherpages.com/webpages/SpeechandDebate/files/Judging%20Speech%20and%20Debate%20Instructions%20Manual.pdf


#
### Problem Statement
--------------
In today’s date most of the schools face serious problems in managing an event. All parents are
forced to attend the event because there is no clarity on number of judges and who will show
up. Events rarely start on time and there is general confusion surrounding this process. Once
parents show up to the event they have to mark their presence by signing on a paper and then
the administrator has to keep track of all the paperwork. Once parents attendance is done the
management has to assign these parents as judges to the teams, which consume a lot of time
and which itself leads to delay in starting the event. Parents raise conflict on some parents
judging their own children or children related to their family/friends, regarding this issue even
management is helpless.
#
### Solution
--------------
We have built a solution to automate managing events/tournaments (such as speech
and debate) for schools where parent participate for judging the event. Our approach is
to facilitate collaboration between organizer and parents seamlessly. Organizers use
our web application to create and manage event and judges information, he/she can
access parent list of mail id's to send invites for event. Parent uses mobile application to
accept or decline invites. Parent attendance in the event can be recorded by system.
We have implemented a filter algorithm to filter out parents as judges and also backup
judges for every team tournament. Filter algorithm will discard parent as a judge if its
not in accordance with the policy. On demand matching(back filling) can be done by the
system itself.

#

### User Stories
------------

Actors :
1)Organizer : Karen, who manages events from start to end. Creating events, sending
invites and organizing events are prime responsibilities.

2)Student Participant: Sam student participant in the course or event

3)Parent Judge : David, Parent of the participant (judge) in the event.

4)Parent Volunteer : Kumar, parent of the participant or senior student

Use case #1: Karen creates a new event (tournament), sets up policy and schedule

Use case #2: Sam and other students are invited to signup for the tournament

Use Case #3: Karen monitors the signup, and sends invites to parents (of signed up
students) for judging

Use case #4: Karen monitors the sign up and gets alerted on low signup for judging

Use case $5: Karen closes the event signup which triggers final preparations

Use case #6: David gets invite for judging signup he accepts or rejects, he also gets to
view event details and any instructions

Use case #7: David acknowledges his presence at site, system records this

Use case #8: In case of absentee, system matches and fills the backlog automatically
based on policy and rules



#

### Development Stack
------------
Technology Stack implemented:
· MongoDB
· ExpressJS
· AngularJS
· NodeJS
· Heroku

Database:
MongoDB NOSQL database selected because all our data operations are giving or receiving
JSON data and it is easier to perform CRUD operations on JSON using MongoDB. 

Server:
Node.JS Server using Express Framework. Express is the easiest way to handle angular
requests and perform operations on a NOSQL database.

Front-End:
Bootstrap Front-End with AngularJS controllers – UI is device independent.

Cloud deployment:
Heroku is the platform used for deploying the application on cloud, to ensure that multi - tenant
architecture is maintained. Along with this it also allows us to auto scale your app in the cloud.
The main advantage is that in case our users lose or replace their phones, their app data is safe
as it is stored on the cloud.

Heroku deployment : https://eveone.herokuapp.com/

#

### Getting Started

To get started with this application you would need to have a cloud database for and cloud platform where you would launch this application.

#
### Prerequisites
- cloud database
We have used mlab for hosting mongo database in the cloud, for running this application configure a mongo database in the cloud and connect it with this applicaiton in server.js

code to be modified :
```
var db = mongojs('user1:user1@ds113668.mlab.com:13668/272school', ['schoollist']);
```
replace the first paramater inside mongojs with your mongo connection string and second parameter with your collection.

- Node 
To get this application running you would need to install Node from [here](https://nodejs.org/en/download/).

#
### Installing

- Git clone this repository.
- npm install
- update changes as specified above
- run node server.js
