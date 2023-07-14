// Server-side manager of content

import { glob } from 'glob'
import matter from 'gray-matter'
import { readFileSync } from 'node:fs'
import { tt, loadProcessors } from '@slimplate/utils'

const cache = {}

export default class Content {
  constructor (collection, collectionName, basePath = '.') {
    this.collection = collection
    this.basePath = basePath
    this.collection.name = collectionName
    for (const f of Object.keys(this.collection.fields)) {
      this.collection.fields[f].name = f
    }
  }

  // get all filenames that matches files pattern in def
  async list () {
    if (cache[this.collection.name]) {
      return cache[this.collection.name]
    }
    const list = (await glob(this.basePath + this.collection.files)).map(f => '/' + f)
    cache[this.collection.name] = await Promise.all(list.map(f => {
      const { data, content, excerpt } = matter(readFileSync(this.basePath + filename, 'utf8'), { excerpt: true })
      data.url = tt(this.collection.url, { ...data, filename, content })
      data.excerpt = excerpt
      data.filename = filename
      data.children = content

      // post-process data
      for (const f of Object.keys(data)) {
        const field = this.collection.fields[f]
        if (field && loadProcessors[field.type]) {
          data[f] = loadProcessors[field.type](data[f])
        }
      }
    }))
    return cache[this.collection.name]
  }

  async get (filename) {
    return this.getByField('filename', filename)
  }

  async getByUrl (url) {
    return this.getByField('url', url)
  }

  // get a single article, based on value of a field
  async getByField (fieldName, value) {
    const list = await this.list()
    return list.find(a => a[fieldName] === value)
  }

  // get all articles that match a filter
  async getByFilter (filter = () => true) {
    const list = await this.list()
    return list.filter(filter)
  }
}
