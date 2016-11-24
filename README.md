## Fall16-Team25

##Project Name: EventOne

Table of Contents
-----------------

- [Abstract](#abstract)
- [Judging Rules](#judging-rules)
- [User Stories](#user-stories)
- [OAuth URI Image](#oauth-uri-image)

#
#
#

#Abstract
--------

We are building a solution to automate managing events/tournaments (such as speech and debate) for schools where parent participate for judging the event.
Our approach is to facilitate collaboration between organizer and parents seamlessly. Organizer uses our web application to create and manage event and judges information, he can access parent list of mail id's to send invites for event. Parent uses mobile application to accept or decline invites. Parent attendance in the event can be recorded by scanning the parent QR code using QR scanner. We propose a filter algorithm to filter out parents as judges and also backup judges for every team tournament. Filter algorithm will discard parent as a judge if its not in accordance with the policy. On demand matching(back filling)  can be done by the system itself.

#
#
Judging Rules
--------------

### Please see the judging instruction to understand the process: http://www.myteacherpages.com/webpages/SpeechandDebate/files/Judging%20Speech%20and%20Debate%20Instructions%20Manual.pdf

#
#

User Stories
------------

Actors :

1)Organizer	: 	Karen, who manages events from start to end. Creating events, sending invites and 
				organizing events are prime responsibilities.
2) Student Participant: Sam student participant in the course or event

2)Parent Judge	: 	David, Parent of the participant (judge) in the event.

3) Parent Volunteer : Kumar, parent of the participant or senior student 


Use case #1: Karen creates a new event (tournament), sets up policy and schedule 

Use case #2: Sam and other students are invited to signup for the tournament 

Use Case #3:  Karen monitors the signup, and sends invites to parents (of signed up students) for judging

Use case #4: Karen monitors the sign up and get alerted on low signup for judging 

Use case $5: Karen closes the event signup which triggers final preparations

Use case #6: David gets invite for judging signup he accepts or rejects, he alsogets to view event details and any instructions 

Use case #7: David scans a QR code published on site of events to acknowledge his presence at site, system records this

Use case #8: In case of absentee, system matches and fills the backlog automatically based on policy and rules

Use case #9: system sends a Thank you note to parents 

good enough for now.. 


#
#

OAuth URI Image
---------------

![](https://cloud.githubusercontent.com/assets/21318180/20609485/03ab2ed2-b242-11e6-8258-201611297c81.PNG)


