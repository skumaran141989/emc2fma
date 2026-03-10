
import fs from 'fs'
import { parse } from 'node-html-parser';
function createHTML(){
     
      const allfiles = fs.readdirSync('./src/pages', { recursive: true, withFileTypes:true })
   
      const htmlContent =fs.readFileSync('./src/template.html', 'utf-8');
      let urls = ``
      allfiles.filter((file)=>file.isFile()).forEach((fileType) => {
          //const phtml = htmlContent;
          const file = `${fileType.parentPath}/${fileType.name}`;
          urls=`${urls}${createSiteMapEntry(fileType.name.replace('.html',''))}`

          const htmlChildContent =fs.readFileSync(`${file}`, 'utf-8');
          const chtml = parse(htmlChildContent)
          const ctitle = chtml.querySelector('title')
          const metas = chtml.querySelectorAll("meta")
          const root = parse(htmlContent);
          const link = root.querySelector(`[href="./${fileType.name.replace('.html','')}"]`);
          const head = root.querySelector("head")
         

          if(ctitle)
            head?.appendChild(ctitle)
        
          metas.forEach((meta)=>{head?.append(meta)})

          link?.classList.add('active');

          let pnode=link?.parentNode

          if(pnode?.classList.contains('has-submenu')){
            pnode?.querySelector('.submenu')?.classList.add('open');
          }

          while(pnode){
            if(pnode.classList.contains('submenu')){
               pnode.classList.add('open')
            }
            pnode= pnode.parentNode
          }

        const container = root.querySelector('#main');
        
        if(container){
            container.innerHTML=`\n${htmlChildContent}\n`
            fs.writeFileSync(`./docs/${fileType.name}`, root.toString())
        }
         
      })
      createSiteMap(urls)
}

function createSiteMapEntry(url:string){
    const host=`https://wwww.emc2fma.com/`
    return `<url><loc>${host}${url}</loc></url>\n`
}

function createSiteMap(urls:string){
    const prelog =`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
     
      const postlog='</urlset>'

      fs.writeFileSync(`./docs/sitemap.xml`, `${prelog}${urls}${postlog}`)
}

createHTML()