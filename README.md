# filesystem

This server-side content manager allows for efficient management and retrieval of content. It utilizes caching to improve performance and supports post-processing of data based on defined field types.

```js
constructor(collection, collectionName, basePath = '.') // Initializes a content manager with the specified collection, collection name, and base path.
list(grabItems = false) // Retrieves a list of filenames that match the files pattern defined in the collection. If grabItems is true, it also retrieves the content of each file as items.
get(filename) // Retrieves a single article based on the filename. It reads the file content, extracts metadata using gray-matter, and performs post-processing on the data.
```
