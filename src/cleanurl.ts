import { readFileSync, writeFileSync } from 'fs'
import { input } from '@inquirer/prompts';

const jsonFile: string = './src/data/videos.json'
const code = await input({ message: "Insert the embed code" })

function getFile (jsonFile: string) {
  const rawData = readFileSync(jsonFile, 'utf-8')
  const list = JSON.parse(rawData)
  return list
}

function clean (code: string) {
  const regexSRC = /src="([^"]+)"\s+title="([^"]+)"/;
  const match = code.match(regexSRC)
  if (!match) {
    throw new Error('Invalid embed code format');
  }
  const src = match[1]
  const title = match[2]

  return { src, title }
}

const file = getFile(jsonFile)
const newURL = clean(code)
if (file.filter((item: { id: string, url: string, title: string }) => item.url === newURL.src).length > 0) {
  console.log("Video já cadastrado")

} else {
  file.push({ id: (file.length + 1).toString(), title: newURL.title, url: newURL.src })
  writeFileSync(jsonFile, JSON.stringify(file))
  console.log("File updated")
}