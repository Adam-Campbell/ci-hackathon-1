# Project Title
## Spotify Playlist Transfer Protocol
![heroimage for adam-zalak-project1](https://github.com/user-attachments/assets/2f19adaf-7163-45a4-9908-4a828f7d6029)

# Live Site link
[https://adam-campbell.github.io/ci-hackathon-1/]
## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [ResponsivityExampleImage](#responsivityexampleimage)
4. [UserExperience](#userexperience)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

# Introduction
## Spotify Playlist Trasfer Protocol:
#### SPTP is a web application that allows users to create unique Spotify playlists where the song titles collectively spell out a custom message. It combines creativity with music sharing in an innovative way.
# Features
- Message-to-Playlist Conversion
- Users can input custom text messages
- The system converts these messages into playlists using song titles
- Supports creation of personalized playlist titles
#### User Interface
-Clean, modern design using Bootstrap framework
-Responsive layout that works across different screen sizes
#### Two main sections:
1. Message input form
2. Playlist display with track listings
# Responsivity Example Image
![project-responsiveimage](https://github.com/user-attachments/assets/e57b0605-d4bb-4aee-840c-29bd2b42de07)
# User Experience
## User Stories:
### Landing page:
**As a: User**
- I can: View the landing page
- So that: I can learn what the app does and decide if I want to use
 ** Acceptance criteria:**
- A landing page shows whenever the user is not logged in.
- The landing page outlines what the app is for
- The landing page is responsive across all devices
### Playlist creation:
**As a: User**
- I can: Get the app to use the playlist details I give it to create a playlist on my Spotify account on my behalf.
- So that: The playlist is saved to my Spotify account and I can share it with the world.
**Acceptance Criteria**
- When the appropriate method of the service layer is called, a playlist with the correct title is added to the users Spotify account.
- Satisfactory track choices are made according to the message supplied by the user, and the tracks are added to the playlist in the correct order.
- The playlist object is returned by the service layer so that it can be rendered in the view.
 ### Playlist display UI:
**As a: User**
- I can: See my created playlist in the UI
- So that: I can bask in its glory
**Acceptance Criteria**
- When the user has created a playlist, the tracks will be displayed in the UI, allowing them to see what the finished playlist will look like.
### Playlist sharing:
**As a: User**
- I can: Access the Spotify URL for the playlist I have created.
- So that: I can show the playlist to its intended recipient.
**Acceptance Criteria**
- After the user has created their playlist, the Spotify URL for it should be displayed in the apps UI.
- A copy button should be next to the URL, that will copy the link to the users clipboard when clicked.
### Adding playlist images:
**As a: User**
- I can: Choose an image from a pre-chosen list to use as my playlist image
- So that: Express myself to a greater extent
**Acceptance Criteria**
- The user can click a button to open up a modal window which contains a small gallery of image thumbnails.
- The user can click a thumbnail, which will select this image to be used for their playlist.
### Auth flow:
**As a: User**
- I can: Log in and stay logged in
- So that: I can use the app
**Acceptance criteria**
- The app handles login using Spotifys Implicit Grant auth flow, initiated when the user chooses to log in.
- The app stores the auth token to minimise the frequency at which the user needs to re-login.
- Each time at startup, the app recognises whether a valid token is present, to determine whether the app or landing page should be shown.
### Playlist creation:
**As a: User**
- I can: Get the app to use the playlist details I give it to create a playlist on my Spotify account on my behalf.
- So that: The playlist is saved to my Spotify account and I can share it with the world.
**Acceptance Criteria**
- When the appropriate method of the service layer is called, a playlist with the correct title is added to the users Spotify account.
- Satisfactory track choices are made according to the message supplied by the user, and the tracks are added to the playlist in the correct order.
- The playlist object is returned by the service layer so that it can be rendered in the view.
  ### Enhanced track selection:
  **As a: User**
- I can: Create a playlist on my Spotify account such that the tracks of the playlist spell out my chosen message in a visually appealing way.
- So that: My playlist looks interesting when I share it with others.
  **Acceptance Criteria**
- Techniques and heuristics are utilised in order to include, where possible, multi-word track titles that match a substring of the message. Ideally a playlist should consist of a combination of multi-word and single-word tracks.
- API calls remain minimal, in order to avoid hitting Spotify's rate limiting.
### Chosen playlist images are added to the playlist:
**As a: User**
- I can: Choose an image for my playlist, from a preselected gallery of images.
- So that: The message I'm trying to convey with the playlist is enhanced by a suitable image.
**Acceptance Criteria**
- When the service layer receives the image from the UI, it adds it to the users spotify playlist.
 #### Kanban Board Image:
 ![kanban board](https://github.com/user-attachments/assets/fca41038-6028-4906-8df5-9b73626c7f0e)
 ### Skeleton (Wireframes)
![Screenshot 2024-12-15 014610](https://github.com/user-attachments/assets/07f4d258-137f-45c2-a403-e8fe02d5bc38)
![Screenshot 2024-12-15 014627](https://github.com/user-attachments/assets/4de06a42-8dbe-4f2c-a67c-9dc6736a3ce7)
![wireframe2](https://github.com/user-attachments/assets/8f34d993-077d-4e91-9567-a80d0584e067)
![wireframe3](https://github.com/user-attachments/assets/f67339ae-a9e8-4593-bd70-ab9f1bfa9504)
## Design:
**Design Analysis:**
**Visual Hierarchy**
- Strong hero section with clear messaging
- Consistent heading hierarchy (H1 for main title, H2 for sections)
- Well-defined sections for features and functionality
. Could enhance visual hierarchy by
- Adding more contrast between different text elements
- Using varying font sizes to better distinguish importance
- Implementing a more dynamic hero section
- **Color Scheme**
- Currently uses minimal color palette
- Introducing Spotify's brand colors (green #1DB954, black #191414)
- Adding accent colors for highlighting important elements
- Using gradients for background elements
- Implementing color coding for different sections
- **Typography and Readability**
- Uses Roboto font family for clean, modern look
- Adding different font weights for better contrast
- Increasing line height for better readability
- Using larger font sizes for important text
- Adding custom fonts for headings
- **Layout and Spacing**
- Adding more padding between sections
- Implementing a grid system for better alignment
- Using white space more effectively
- Adding section dividers or separators
- **Interactive Elements**
- **Could add:**
- Hover effects on buttons and cards
- Smooth transitions between states
- Loading animations
- Progress indicators
- Interactive previews
- **Responsive Design**
- **Ensure consistent experience across devices**
- **Could Add**
- Better mobile navigation
- Responsive images
- Flexible grid layouts
#### Using Color Palette
  We have carefully selected our project's color palette using the Coolors website. This tool allows us to generate and refine color schemes that enhance the visual appeal and user experience of our project. Below is the color palette we chose:![pixelimage ](https://github.com/user-attachments/assets/226ae131-d5a1-44e6-9547-e1f338373fe0)

- Why We Chose This Palette
Consistency: The colors work well together, providing a cohesive look throughout the application.
Accessibility: The palette includes colors with good contrast ratios, ensuring readability for all users.
Aesthetics: The colors were selected to create a modern and attractive design.
![color palate](https://github.com/user-attachments/assets/0ac66e40-3a87-4088-83f1-19402da39fb5)
### Using Google Fonts
We have integrated Google Fonts into our project to enhance typography and improve the overall design. Specifically, we are using the Roboto font. Here are the steps to include Google Fonts in your project:
Embed the Font in HTML: Add the following <link> tag inside the <head> section of your HTML file.
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
![googlefont-image](https://github.com/user-attachments/assets/412fe9c5-0421-46fb-9239-1db61e4cc846)
### Using Pixels for Images:
In our project, we have used pixel measurements for defining the dimensions of images. This approach ensures consistent rendering across different devices and screen sizes. Here is a brief guide on how to use pixels for images:
![pixelimage ](https://github.com/user-attachments/assets/24c9f8d1-679d-441a-ae6f-55b9dba5773e)
# Future Features
