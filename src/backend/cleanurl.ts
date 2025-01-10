import { input } from '@inquirer/prompts';

export interface JSONFile {
  id: string,
  title: string,
  url: string
}

const jsonFile: string = './src/data/videos.json'

import { promises as fsPromises } from 'fs'

export async function readFile (jsonFile: string): Promise<JSONFile[]> {
  const rawData = await fsPromises.readFile(jsonFile, 'utf-8')
  return JSON.parse(rawData)
}
export async function writeFile (jsonFile: string, data: JSONFile[]) {
  await fsPromises.writeFile(jsonFile, JSON.stringify(data, null, 2))
}

function parseEmbedCode (code: string): { src: string, title: string } {
  const regex = /src="([^"]+)"\s+title="([^"]+)"/;
  const match = code.match(regex)
  if (!match) {
    throw new Error('Embed code format invalid. Ensure it has src and title attributes.');
  }
  return { src: match[1], title: match[2] }
}

async function updateList () {
  try {
    const code = await input({ message: "Insert the embed code" })
    const file = await readFile(jsonFile)
    const newURL = parseEmbedCode(code)
    const uniqueId = Math.random().toString(36).substring(2) + Date.now().toString(36);

    const videoExists = file.some((item) => item.url === newURL.src);
    if (videoExists) {
      console.log("This video already exists")
    } else {
      file.push({ id: uniqueId, title: newURL.title, url: newURL.src })
      await writeFile(jsonFile, file)
      console.log("File updated")
    }
  } catch (error) {
    console.error(error)
  }
}

updateList().catch((error) => console.error(error))