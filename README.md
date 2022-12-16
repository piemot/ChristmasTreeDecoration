# Christmas Tree Decorating!
Christmas pixel tree decoration activity created for the last programming club meeting of the year, in December 2022.

## Running the website:
1. Clone the repository, and run npm install.
2. Set up two tmux sessions, one for the server and one for the website.
3. Inside the server session, run `node server.js` to start the socket server.
4. Inside the website session, run `npm run build && npm run preview` to start the website.
5. Set up nginx so that the socket server website serves port 7000 and the website serves port 8000.
6. If changed, update the socket url in /components/ChristmasCanvas.svelte.


![image](https://user-images.githubusercontent.com/68029599/208048490-2ba0caee-59a8-4af5-9664-9371dcb936c8.png)
<p align=center>December 2022</p>
