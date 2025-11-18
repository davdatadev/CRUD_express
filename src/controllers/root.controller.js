// import { fileURLToPath } from "url"
// import { dirname, join } from "path"

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

export const rootHandler = (req, res) => { 
    // const filePath = join(__dirname, "..", "views", "index.html")
    // res.sendFile(filePath)
    res.render("index")
}