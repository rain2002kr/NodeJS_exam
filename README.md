﻿# NodeJS_exam

NODE JS 를 이용한 예제코드 

예제코드는 아래와 같은 내용을 담고 있습니다. 

쿼리 데이터 관련 
var _url = request.url;
var queryData = url.parse(_url,true).query;
var pathname = url.parse(_url,true).pathname;

Rest API 
 POST, GET 관련 
 리다이렉션 관련 

HTTP 응답코드 관련 
100 ~ 500 까지 

동기 비동기 처리 
fs.readFile(`data/${filteredId}`,'utf8',function(err,descriton){
비동기 처리가 효율적이다. 다음과 같이 펑션에 콜백함수 기법을 사용한다. 

통신 관련 
 request.on('data 
 request.on('end

파일 관련
 fs.readdir : 디렉토리 정보읽기 
 fs.readfile : 파일 읽기 
 fs.writefile : 파일 쓰기 
 fs.unlink : 파일 삭제 
 

보안 관련 
 입력 path.parse(경로).base
사용한 라이브러리 
 use helmet
 var sanitizeHTML = require('sanitize-html');
 
