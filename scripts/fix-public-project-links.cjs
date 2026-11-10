const fs=require('fs'),path=require('path');
const roots=process.argv.slice(2);let changed=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(html|js|cjs|json|md)$/i.test(p)){let s=fs.readFileSync(p,'utf8');let next=s.replace(/https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(?=\/|\$\{|["'`\s<]|$)/gi,'');next=next.replace(/(href\s*=\s*["'])\1/g,'$1/$1');next=next.replace(/href=""/g,'href="/"').replace(/href='' /g,"href='/' ");if(next!==s){fs.writeFileSync(p,next);changed++;}}}}
for(const dir of roots)if(fs.existsSync(dir))walk(dir);console.log('Updated '+changed+' files.');
