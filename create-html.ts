
import fs from 'fs'
import { parse } from 'node-html-parser';
function createHTML(){
      const allfiles = fs.readdirSync('./src/pages', { recursive: true, withFileTypes:true })
   
      const htmlContent =fs.readFileSync('./src/template.html', 'utf-8');
      allfiles.filter((file)=>file.isFile()).forEach((fileType) => {

          const file = `${fileType.parentPath}/${fileType.name}`;
            
          const htmlChildContent =fs.readFileSync(`${file}`, 'utf-8');
          const root = parse(htmlContent);
          const link = root.querySelector(`[href="./${fileType.name.replace('.html','')}"]`);
          
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
            container.innerHTML=htmlChildContent
            fs.writeFileSync(`./build/${fileType.name}`, root.toString())
        }
         
      })

}
createHTML()