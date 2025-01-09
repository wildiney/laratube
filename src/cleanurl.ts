const url = `
<iframe width="560" height="315" src="https://www.youtube.com/embed/cFOyYJBZjPk?si=5j-jHj04ecVNERWk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
`

let newurl = url.replace('<iframe width="560" height="315" src=', "")
newurl = newurl.replace(' title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>', '')

console.log(newurl)