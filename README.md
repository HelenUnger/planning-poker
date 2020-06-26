# WIP - Planning poker app

This is a free, live poker planning application that allows users to join seperate rooms to plan their next sprints seperately. Users can join a room and set a nickname and role: Dealer, Player and Viewer. The Dealer is the leader of the game, and set the game status to ready once everyone has joined the room and is ready to score. The Players are able to select their score and submit when the game is ready. Everyone can see who is in the room and their statuses (busy, waiting for game to start, waiting to score, and has submitted a score) once all the scores have been submitted, they appear for everyone on the main screen, along with the average and the mode (most frequently occurring score)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

'npm install' to download required plugins
'npm run watch' to watch sass and save as compressed css
'npm run start' to get it running locally on port 3000

### Prerequisites

What things you need to install the software and how to install them

any type editor can be used, browsers such as chrome/firefox are compatible

## Deployment

the master branch is linked to heroku which is currently live at https://planning-poker.herokuapp.com/

## Built With

* [node.js](https://nodejs.org/en/docs/) - javascript runtime
* [socket.io](https://socket.io/) - realtime engine
* [vue.js](https://vuejs.org/) - javascript framework
* [sass](https://sass-lang.com/documentation/file.SASS_REFERENCE.html) - style manager

## Authors

* **Helen Unger** - *design and additional modifications*

## Acknowledgments

*thanks trevor for introducing socket.io
