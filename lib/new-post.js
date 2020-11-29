const fs = require("fs")
const path = require("path")
const inquirer = require("inquirer")

const slugify = string => {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;"
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------"
  const p = new RegExp(a.split("").join("|"), "g")

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

const formatDate = date => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

const askForPostInfo = () => {
  const questions = [
    {
      name: "title",
      type: "input",
      message: `What's the title of the post:`,
      validate: function (title) {
        if (title.length) {
          return true
        } else {
          return `Please enter a title for the post`
        }
      },
    },
    {
      name: "date",
      type: "input",
      message: `What's the date of the post:`,
      default: new Date(),
    },
  ]

  return inquirer.prompt(questions)
}

const createDefaultFrontMatter = postInfo => {
  const defaultText = `---
title: ${postInfo.title}
slug: ${postInfo.slug}
date: ${postInfo.date}
excerpt: New post is in the works!
---`
  return defaultText
}

const createDir = dirPath => {
  fs.mkdirSync(dirPath, { recuresive: true }, err => {
    if (err) {
      console.error("An error occured while trying to create directory: ", err)
    } else {
      console.log("Created new directory")
    }
  })
}

const createFile = (filePath, fileContent) => {
  fs.writeFile(filePath, fileContent, err => {
    if (err) {
      console.error("An error occured while trying to create file: ", err)
    } else {
      console.log("New file is ready to be editted!")
    }
  })
}

const main = async () => {
  const postInfo = await askForPostInfo()
  postInfo.slug = await slugify(postInfo.title)
  postInfo.date = formatDate(postInfo.date)

  const newPostPath = path.join(
    process.cwd(),
    "src",
    "posts",
    `${postInfo.date}-${postInfo.slug}`
  )
  createDir(newPostPath)

  const frontMatter = createDefaultFrontMatter(postInfo)
  createFile(`${newPostPath}/index.mdx`, frontMatter)
}

main()
