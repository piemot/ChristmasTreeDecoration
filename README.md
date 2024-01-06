# Christmas Tree Decorating!

Christmas pixel tree decoration activity created for the last programming club meeting of the year, in December 2022.

✨ Updated in December 2023 for real-time editing, SQLite + Drizzle ORM, and Railway deploy!

## Running the website:

1. Clone the repository.
2. Install bun `https://bun.sh/docs/installation` (we use the SQLite3 driver provided by bun)
3. Install the dependencies in root, `/backend`, and `/frontend` with `bun i`.
4. Setup a `.env` file in root; put in:

   ```env
   INITIAL_CANVAS=pixel2023 # or whatever year; this affects the first-loaded canvas
   VITE_BACKEND_URL=http://localhost:6969 # backend runs on port 6969 by default
   SQL_PATH=./temp # this is where the SQLite3 database will be stored relative to /backend; on Railway, this is /temp because that's where the volume is mounted
   ```

5. Run `bun dev` in root to start the backend and frontend servers!

![image](https://user-images.githubusercontent.com/68029599/208048490-2ba0caee-59a8-4af5-9664-9371dcb936c8.png)

<p align=center>December 2022</p>
