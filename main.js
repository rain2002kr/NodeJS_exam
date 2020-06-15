var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHTML = require('sanitize-html');


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    if(pathname === '/'){
        if(queryData.id === undefined){ //home 이다. 
            
            fs.readdir('./data', function(err, filelist){
                var title = 'Welcome';
                var descriton = 'Hello, Node.js';
                var list = template.list(filelist)
                var html = template.html(title,list,
                    `<h2>${title}</h2>${descriton}`,
                    `<a href="/create">create</a>`
                    
                    );
                response.writeHead(200);   //웹서버와 브라우저간에 통신하기 위한 간결한 약속 200 성공 문자
                response.end(html);
            });
            
        }else{
            fs.readdir('./data', function(err, filelist){
                
                //var filteredId =  path.parse(queryData.id).base
                var filteredId = queryData.id;
                fs.readFile(`data/${filteredId}`,'utf8',function(err,descriton){
                var title = filteredId;
                var list = template.list(filelist)
                var html = template.html(title,list,
                    `<h2>${title}</h2>${descriton}`,
                    `<a href="/create">create</a>  
                     <a href="/update?id=${title}">update</a>
                     <form action="delete_process" method="post">
                     <input type="hidden" name="id" value="${title}">
                     <input type="submit" value="delete">
                     </form>
                     `
                    );
                response.writeHead(200);   //웹서버와 브라우저간에 통신하기 위한 간결한 약속 200 성공 문자
                response.end(html);
            });
        });
        }
    } else if(pathname === '/create'){
        
            fs.readdir('./data', function(err, filelist){
                var title = 'WEB - create';
                var list = template.list(filelist)
                var html = template.html(title,list,`
                <form action="/create_process"
                    method="POST">
                    <p><input type="text" name="title" placeholder="title"></p>

                    <p><textarea name="description"></textarea></p>

                    <p><input type="submit"></p>

                    </form>
                
                `,'');
                response.writeHead(200);   //웹서버와 브라우저간에 통신하기 위한 간결한 약속 200 성공 문자
                response.end(html);
            });  

    }else if(pathname === '/create_process'){
        
        var body ='';
        request.on('data', function(data){
            body = body + data;
            //용량이 크면 끊는 코드도 넣을수 있음. 
        });
        //이제 마지막 콜백이 실행될때, 정보수신이 끝났다.
        request.on('end', function(){
            var post = qs.parse(body);
            
            var sanitizeTitle = sanitizeHTML(post.title);
            var sanitizeDescription = sanitizeHTML(post.description);
            
            fs.writeFile(`data/${sanitizeTitle}`,sanitizeDescription,'utf8',function(err){
                if(err){

                }else{
                    response.writeHead(302, {location:'/?id=${title}'});
                    response.end();        
                }
            })
        });
        
        
    } else if (pathname === '/update'){
       
        fs.readdir('./data', function(err, filelist){
            
            var filteredId = path.parse(queryData.id).base
            
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                var title = filteredId;
                var list = template.list(filelist)
                var html = template.html(title,list,
                   `
                  <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                      <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                      <input type="submit">
                    </p>
                  </form>
                  `,
                  `<a href="/create">create</a> 
                   <a href="/update?id=${title}">update</a>
                   <form action="delete_process" method="post">
                     <input type="hidden" name="id" value="${title}">
                     <input type="submit" value="delete">
                   </form>
                   `
                );
                response.writeHead(200);
                response.end(html);
              });
            });
    } else if (pathname === '/update_process'){
        var body ='';
        request.on('data', function(data){
            body = body + data;
            //용량이 크면 끊는 코드도 넣을수 있음. 
        });
        //이제 마지막 콜백이 실행될때, 정보수신이 끝났다.
        request.on('end', function(){
            var post = qs.parse(body);
            var id = path.parse(post.id).base; //경로세탁 
            var sanitizeTitle = post.title; //sanitizeHTML(post.title);           //보안 출력
            var sanitizeDescription = post.description//sanitizeHTML(post.description);

            fs.rename(`data/${id}`,`data/${sanitizeTitle}`, function(error){
                fs.writeFile(`data/${sanitizeTitle}`,sanitizeDescription, 'utf8',function(err){
                    if(err){
                        response.end('error')
                    }else{
                        response.writeHead(302, {location: `/?id=${sanitizeTitle}`});
                        response.end();
                    }
                })
            })
        });
    }
    else if (pathname === '/delete_process'){
        var body ='';
        request.on('data', function(data){
            body = body + data;
            //용량이 크면 끊는 코드도 넣을수 있음. 
        });
        //이제 마지막 콜백이 실행될때, 정보수신이 끝났다.
        request.on('end', function(){
            var post = qs.parse(body);
            var id = path.parse(post.id).base; //경로세탁 
            fs.unlink(`data/${id}`,function(error){
                response.writeHead(302,{location: `/`});
                response.end();
            })
        });
    }
    else {
        response.writeHead(404);
        response.end('not found')
    }
});
app.listen(3001);

