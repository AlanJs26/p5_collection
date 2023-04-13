import express from 'express';
import { readdirSync } from 'fs'
import path from 'path'

function getDirectories(source){
  return readdirSync(source, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory() && !exclude_folders.includes(dirent.name) && !dirent.name.startsWith('.') )
          .map(dirent => dirent.name)
}

const port = 5000
const exclude_folders = ['views', 'node_modules']
const directories = getDirectories('./')
  
// Initialize App
const app = express();


// Assing route for static files
for(let dir of directories){
  app.use(`/${dir}`, express.static(path.join(process.cwd(), dir)))
}

// Assign the main route
app.use('/', (req, res, next) => {
  res.render('index.pug', {files: directories});
});

  
// Start server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
